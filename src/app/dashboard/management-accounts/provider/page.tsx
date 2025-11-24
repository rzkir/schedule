import type { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "My Schedule - Management Accounts Provider",
  description: "Management Accounts Provider",
};

import ManagementAccountsProviderLayout from "@/components/dashboard/management-accounts/provider/ManagementAccountsProviderLayout";

export default function page() {
  return <ManagementAccountsProviderLayout />;
}
