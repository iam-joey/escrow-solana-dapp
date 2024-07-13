"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { WalletProviders } from "./wallet-provider";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WalletProviders>{children}</WalletProviders>
    </ThemeProvider>
  );
};
