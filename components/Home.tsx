"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { m } from "framer-motion";
import LandingPageStats from "./layout/landing-page-stats/LandingPageStats";
import Testimonials from "./layout/testimonials/Testimonials";
import Pricing from "./layout/pricing/Pricing";
import InterviewProcessCards from "./layout/interview-process/InterviewProcessCards";
import FloatingOrbs from "./visual/FloatingOrbs";
import ParticleField from "./visual/ParticleField";
import SmoothScroll from "./visual/SmoothScroll";
import MagneticButton from "./ui/MagneticButton";

const Home = () => {
  return (
    <SmoothScroll>
      <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {/* Hero 3D backdrop */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-[640px] -z-10">
          <FloatingOrbs />
          <ParticleField density="medium" />
        </div>

        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            className="h-9 overflow-hidden border-1 border-default-200/60 bg-default-50/40 backdrop-blur-md px-4.5 py-2 text-small font-normal leading-5 text-default-500"
            radius="full"
            variant="bordered"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse-glow" />
            New onboarding experience
            <Icon
              className="flex-none outline-none [&>path]:stroke-2"
              icon="solar:arrow-right-linear"
              width={20}
            />
          </Button>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block max-w-2xl text-center justify-center"
        >
          <span className="tracking-tight inline font-semibold text-gradient-fusion text-[2.3rem] lg:text-6xl leading-[1.05]">
            Your Shortcut
          </span>
          <br />
          <span className="tracking-tight inline font-semibold text-[2.3rem] lg:text-6xl leading-[1.05]">
            to Interview Success
          </span>
          <div className="w-full my-2 text-lg lg:text-xl text-default-600 block mt-5">
            AI-powered interview preparation made simple and effective. Fast,
            intuitive, and built for your career goals.
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <MagneticButton strength={0.35}>
            <Button
              className="h-11 bg-foreground px-7.5 py-2.5 text-small font-medium leading-5 text-background shadow-lg shadow-fuchsia-500/20"
              radius="full"
              as={Link}
              href="/subscribe"
            >
              Try Prep AI Now
              <Icon icon="solar:arrow-right-linear" width={16} />
            </Button>
          </MagneticButton>

          <MagneticButton strength={0.3}>
            <Button
              className="h-11 border-1 border-default-200/60 bg-default-50/30 backdrop-blur-md px-5 py-2 text-small font-medium leading-5"
              radius="full"
              variant="bordered"
              as="a"
              href="#pricing"
            >
              See our plans
              <Icon
                className="text-default-500 [&>path]:stroke-[1.5]"
                icon="solar:arrow-right-linear"
                width={16}
              />
            </Button>
          </MagneticButton>
        </m.div>

        <div className="w-full mt-12">
          <LandingPageStats />
        </div>

        <Testimonials />

        <Pricing />

        <InterviewProcessCards />
      </section>
    </SmoothScroll>
  );
};

export default Home;
