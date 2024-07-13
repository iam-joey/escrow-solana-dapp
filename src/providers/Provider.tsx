"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { WalletProviders } from "./wallet-provider";
import { AnchorProgramProvider } from "./AnchorProvider";
import { Toaster, toast } from "sonner";
export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Toaster richColors closeButton position="top-center" />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <WalletProviders>
          <AnchorProgramProvider>{children}</AnchorProgramProvider>
        </WalletProviders>
      </ThemeProvider>
    </>
  );
};
