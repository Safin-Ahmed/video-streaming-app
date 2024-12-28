"use client";

import ConfirmAccount from "@/components/ConfirmAccount";
import dynamic from "next/dynamic";

const ConfirmPage: React.FC = () => {
  const DynamicComponentWithNoSSR = dynamic(
    () => import("@/components/ConfirmAccount"),
    { ssr: false }
  );
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <DynamicComponentWithNoSSR />
    </div>
  );
};

export default ConfirmPage;
