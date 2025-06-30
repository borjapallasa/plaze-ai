
import React from "react";
import { MainHeader } from "@/components/MainHeader";

export default function AffiliatesPage() {
  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Program</h1>
            <p className="text-muted-foreground mt-2">
              Manage your affiliate partnerships and track commissions
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
