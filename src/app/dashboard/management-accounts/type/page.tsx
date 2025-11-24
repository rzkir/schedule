import type { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "My Schedule - Management Accounts Type",
  description: "Management Accounts Type",
};

import ManagementAccountsTypeLayout from "@/components/dashboard/management-accounts/type/ManagementAccountsTypeLayout";

export default function page() {
  return <ManagementAccountsTypeLayout />;
}
