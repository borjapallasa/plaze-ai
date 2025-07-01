
import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";

export default function AffiliatesPage() {
  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 pt-16">
        <AffiliateDashboard />
      </div>
    </>
  );
}
