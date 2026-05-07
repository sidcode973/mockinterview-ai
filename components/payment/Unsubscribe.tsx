"use client";

import React from "react";

import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Logo } from "@/config/Logo";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IUser } from "@/backend/models/user-model";
import toast from "react-hot-toast";
import { cancelUserSubscription } from "@/actions/payment-action";
import { m } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import MagneticButton from "../ui/MagneticButton";

const Unsubscribe = () => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const { data, update } = useSession();
  const user = data?.user as IUser;

  const handleUnsubscribe = async () => {
    setLoading(true);

    const res = await cancelUserSubscription(user.email);

    setLoading(false);

    if ("error" in res) {
      toast.error(res.error.message);
      return;
    }

    if ("status" in res && res.status) {
      const updateSession = await update({
        subscription: {
          status: res.status,
        },
      });

      if (updateSession) {
        toast.success("Subscription cancelled successfully");
        router.push("/");
      }
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center py-10">
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <GlassCard variant="strong" glow className="px-8 py-7">
          <div className="flex flex-col items-center pb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-fuchsia-500 to-purple-500 shadow-lg shadow-rose-500/40 mb-3">
              <Logo />
            </div>
            <p className="text-xl font-semibold tracking-tight">Unsubscribe</p>
            <p className="text-small text-default-500 mt-1">
              Unsubscribe from your current plan
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <RadioGroup isDisabled label="Your Plan" defaultValue={"9.99"}>
              <Radio value="9.99">$9.99 per month</Radio>
            </RadioGroup>

            <Input
              type="email"
              label="Email Address"
              placeholder="Email"
              variant="bordered"
              value={user?.email}
              isDisabled
            />

            <MagneticButton strength={0.25} className="block w-full">
              <Button
                className="w-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-500 text-white font-semibold shadow-lg shadow-rose-500/30"
                color="danger"
                type="button"
                startContent={!loading && <Icon icon="solar:card-recive-bold" fontSize={19} />}
                onPress={handleUnsubscribe}
                isLoading={loading}
                isDisabled={loading}
              >
                Unsubscribe
              </Button>
            </MagneticButton>
          </div>
        </GlassCard>
      </m.div>
    </div>
  );
};

export default Unsubscribe;
