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
import { m } from "framer-motion";
import AuroraBackground from "@/components/visual/AuroraBackground";
import ParticleField from "@/components/visual/ParticleField";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";

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
        <GlassCard variant="strong" className="max-w-md p-6 text-center border border-danger-200/40">
          <p className="font-semibold text-danger">Payment unavailable</p>
          <p className="mt-2 text-sm text-default-500">
            Stripe is not configured. Check your <code>NEXT_PUBLIC_STRIPE_KEY</code>
            {" "}in <code>.env.local</code> and restart the dev server.
          </p>
        </GlassCard>
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
        billing_details: { email },
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
    <div className="relative flex min-h-[80vh] w-full items-center justify-center py-10">
      <AuroraBackground variant="auth" className="!fixed" />
      <ParticleField density="low" />

      <m.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-full max-w-md flex-col gap-4"
      >
        <GlassCard variant="strong" glow className="px-8 pb-8 pt-7">
          <div className="flex flex-col items-center pb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1CF7] via-[#b249f8] to-[#22d3ee] shadow-lg shadow-fuchsia-500/40 mb-3">
              <Logo />
            </div>
            <p className="text-xl font-semibold tracking-tight">Subscribe</p>
            <p className="text-small text-default-500 mt-1">
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
            <div className="rounded-xl border border-default-200/60 bg-default-50/40 px-4 py-3">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
            <MagneticButton strength={0.25} className="w-full block">
              <Button
                className="w-full bg-gradient-to-r from-[#FF1CF7] via-[#b249f8] to-[#22d3ee] animate-gradient-pan text-white font-semibold shadow-lg shadow-fuchsia-500/30"
                type="submit"
                startContent={!loading && <Icon icon="solar:card-send-bold" fontSize={19} />}
                isDisabled={!stripe || loading}
                isLoading={loading}
              >
                {loading ? "Processing..." : "Subscribe"}
              </Button>
            </MagneticButton>
          </form>
        </GlassCard>
      </m.div>
    </div>
  );
};

export default Subscribe;
