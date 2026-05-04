import { headers } from "next/headers";

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import stripe from "../utils/stripe";
import User from "../models/user-model";
import dbConnect from "../config/dbconnect";

export const createSubscription = catchAsyncErrors(
  async (email: string, paymentMethodId: string) => {
    await dbConnect();

    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new Error(
        "Missing STRIPE_PRICE_ID env var. Create a recurring price in your Stripe dashboard and add it to .env.local."
      );
    }

    // Create a new subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    // Persist subscription to DB IMMEDIATELY so the user stays subscribed across
    // logout/login, even when Stripe webhooks can't reach localhost during dev.
    // The webhook still handles later events (renewals, failures, cancellations).
    const item = subscription.items?.data?.[0];
    const periodStart = item?.current_period_start;
    const periodEnd = item?.current_period_end;

    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          "subscription.id": subscription.id,
          "subscription.customerId": customer.id,
          "subscription.status": subscription.status,
          "subscription.created": new Date(subscription.created * 1000),
          "subscription.startDate": periodStart
            ? new Date(periodStart * 1000)
            : new Date(),
          "subscription.currentPeriodEnd": periodEnd
            ? new Date(periodEnd * 1000)
            : new Date(),
        },
      }
    );

    // Return ONLY plain serializable fields — Stripe's Subscription object
    // is a class instance with toJSON()/Decimal types which Next.js refuses
    // to pass from a Server Action to a Client Component.
    return {
      subscription: {
        id: subscription.id,
        status: subscription.status,
      },
    };
  }
);

export const cancelSubscription = catchAsyncErrors(async (email: string) => {
  await dbConnect();

  const user = await User.findOne({ email });

  if (!user || !user.subscription?.id) {
    throw new Error("User or Subscription not found");
  }

  const subscription = await stripe.subscriptions.cancel(user.subscription.id);

  // Persist canceled status to DB immediately — don't rely on webhook
  // (which can't reach localhost during dev without Stripe CLI/ngrok).
  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        "subscription.status": subscription.status,
        "subscription.nextPaymentAttempt": null,
      },
    }
  );

  return { status: subscription?.status };
});

export const subscriptionWebhook = async (req: Request) => {
  const rawBody = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event;
                                                       
  try {
    event = stripe.webhooks.constructEvent( 
      rawBody,
      signature,  
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log("Webhook error => ", error);
  }

  if (!event) {
    throw new Error("Error. Payment event not found");
  }

  await dbConnect();

  switch (event.type) {
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;

      const email = invoice.customer_email;
      const customer = await stripe.customers.retrieve(
        invoice.customer as string
      );

      // Newer Stripe API moved `subscription` off Invoice — pull it from the parent
      // (parent.subscription_details) or from the line item, with safe fallbacks.
      // The "subscription" field has moved across Stripe API versions —
      // try every known location and force to a plain string.
      const subRaw =
        (invoice as unknown as { subscription?: string | { id: string } })
          .subscription ??
        invoice.parent?.subscription_details?.subscription ??
        (invoice.lines?.data?.[0] as unknown as {
          subscription?: string | { id: string };
        })?.subscription;
      const subscriptionId =
        typeof subRaw === "string" ? subRaw : subRaw?.id;

      const period = invoice.lines?.data?.[0]?.period;

      // Update customer subscription status
      await User.findOneAndUpdate(
        { email },
        {
          subscription: {
            id: subscriptionId,
            customerId: customer?.id,
            status: "active",
            created: new Date(invoice.created * 1000),
            startDate: period ? new Date(period.start * 1000) : new Date(),
            currentPeriodEnd: period
              ? new Date(period.end * 1000)
              : new Date(),
          },
        }
      );
      break;
    }

    case "invoice.payment_failed": {
      const paymentFailed = event.data.object;
      const nextPaymentAttempt = paymentFailed.next_payment_attempt;

      const failedSubRaw =
        (paymentFailed as unknown as {
          subscription?: string | { id: string };
        }).subscription ??
        paymentFailed.parent?.subscription_details?.subscription;
      const failedSubscriptionId =
        typeof failedSubRaw === "string" ? failedSubRaw : failedSubRaw?.id;

      await User.findOneAndUpdate(
        { "subscription.id": failedSubscriptionId },
        {
          $set: {
            "subscription.status": "past_due",
            "subscription.nextPaymentAttempt": nextPaymentAttempt
              ? new Date(nextPaymentAttempt * 1000)
              : null,
          },
        }
      );

      break;
    }

    case "customer.subscription.deleted": {
      const subscriptionDeleted = event.data.object;

      await User.findOneAndUpdate(
        { "subscription.id": subscriptionDeleted.id },
        {
          $set: {
            "subscription.status": "canceled",
            "subscription.nextPaymentAttempt": null,
          },
        }
      );

      break;
    }

    default:
      break;
  }

  return { success: true };
};