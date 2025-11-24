import React from "react";

import { ManagementAccounts } from "@/types/ManagementAccounts";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { X } from "lucide-react";

interface ViewModalProps {
  open: boolean;
  onClose: () => void;
  account: ManagementAccounts | null;
}

export default function ViewModal({ open, onClose, account }: ViewModalProps) {
  if (!account) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-4xl max-h-[95vh] overflow-hidden bg-background flex flex-col p-0 border-0 shadow-none"
      >
        <DialogTitle className="sr-only">Detail Account</DialogTitle>
        {/* Header Section */}
        <div className="relative p-4 sm:p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
                {account.name}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {account.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-circle btn-sm bg-background/80 backdrop-blur-md border border-border hover:bg-background text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto flex-grow bg-background">
          {/* Account Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <span className="h-5 w-5 text-primary">👤</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-primary">
                  Provider
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {account.provider}
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <span className="h-5 w-5 text-accent-foreground">🏷️</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-accent-foreground">
                  Type
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {account.type}
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center gap-2">
              <span className="h-5 w-5 text-primary">📄</span>
              Account Information
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs sm:text-base">
                  Email:
                </span>
                <span className="px-3 sm:px-4 py-2 bg-muted rounded-lg text-foreground text-sm sm:text-base font-medium">
                  {account.email}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs sm:text-base">
                  Password:
                </span>
                <span className="px-3 sm:px-4 py-2 bg-muted rounded-lg text-foreground text-sm sm:text-base font-mono">
                  {account.password}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center gap-2">
              <span className="h-5 w-5 text-accent-foreground">🕒</span>
              Timeline
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-chart-2/20 rounded-lg">
                  <span className="h-5 w-5 text-chart-2">🟢</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-card-foreground">
                    Created
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {account.createdAt &&
                    typeof account.createdAt.toDate === "function"
                      ? account.createdAt.toDate().toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
              {account.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <span className="h-5 w-5 text-primary">🔄</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-card-foreground">
                      Last Updated
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {typeof account.updatedAt.toDate === "function"
                        ? account.updatedAt.toDate().toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
