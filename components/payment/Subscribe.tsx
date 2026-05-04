"use client";

import React, { useState } from "react";

import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Logo } from "@/config/Logo";
import { Icon } from "@iconify/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createNewSubscription } from "@/actions/payment-action";
import toast from "react-hot-toast";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY;

if (!publishableKey) {
  console.error(
    "Missing NEXT_PUBLIC_STRIPE_KEY in .env.local. " +
      "Make sure: (1) the key exists, (2) there are no spaces around '=' " +
      "(write `NEXT_PUBLIC_STRIPE_KEY=pk_test_...` not `KEY = pk_test_...`), " +
      "(3) you restarted `next dev` after editing .env.local."
  );
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const Subscribe = () => {
  if (!stripePromise) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="max-w-md rounded-xl border border-danger-200 bg-danger-50 p-6 text-center">
          <p className="font-semibold text-danger-700">
            Payment unavailable
          </p>
          <p className="mt-2 text-sm text-danger-600">
            Stripe is not configured. Check your <code>NEXT_PUBLIC_STRIPE_KEY</code>
            {" "}in <code>.env.local</code> and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

const CheckoutForm = () => {
  const { data, update } = useSession();

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  // Derive email directly from session — no mirror state, no useEffect
  const email = data?.user?.email ?? "";

  const [loading, setLoading] = useState<boolean>(false);

  const showError = (message: string) => {
    toast.error(message);
    setLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const cardElements = elements.getElement(CardElement);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElements!,
        billing_details: {
          email,
        },
      });

      if (error) {
        showError(error.message || "An error occurred");
        return;
      }

      const res = await createNewSubscription(email, paymentMethod!.id);

      if ("error" in res) {
        showError(res.error.message);
        return;
      }

      if ("subscription" in res && res.subscription) {
        const updateSession = await update({
          subscription: {
            id: res.subscription.id,
            status: res.subscription.status,
          },
        });

        setLoading(false);

        if (updateSession) {
          toast.success("Subscription successful");
          router.push("/app/dashboard");
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      showError(message);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Subscribe</p>
          <p className="text-small text-default-500">
            Enter your email and card details to subscribe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <RadioGroup isDisabled label="Your Plan" defaultValue={"9.99"}>
            <Radio value="9.99">$9.99 per month</Radio>
          </RadioGroup>

          <Input
            type="email"
            label="Email Address"
            placeholder="Email"
            variant="bordered"
            value={email}
            isDisabled
          />
          <div className="my-4">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
          <Button
            className="w-full"
            color="primary"
            type="submit"
            startContent={<Icon icon="solar:card-send-bold" fontSize={19} />}
            isDisabled={!stripe || loading}
          >
            {loading ? "Processing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Subscribe;