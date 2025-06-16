"use client";

import { lazyClient } from "@/lib/lazy-client";
import React from "react";

const SignwellHeroAnimation = lazyClient(() => import("./SignwellHeroAnimation"));

const SignwellHeroAnimationClient: React.FC = () => {
  return <SignwellHeroAnimation />;
};

export default SignwellHeroAnimationClient;