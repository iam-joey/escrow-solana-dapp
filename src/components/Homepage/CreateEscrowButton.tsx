"use client";
import React from "react";
import EscrowForm from "../Escrow/EscrowForm";
import { useAnchorProgram } from "@/providers/AnchorProvider";
import { WalletMultiButtonFix } from "../Navbar/NavBar";

function CreateEscrowButton() {
  const { program } = useAnchorProgram();
  return program ? (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-[300px] my-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Secure Your Transactions with Escrow
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Ensure safety and trust in your transactions. Create an escrow account
          to protect both parties and manage funds securely.
        </p>
        <EscrowForm />
      </div>
    </div>
  ) : (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-[300px] my-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight mb-5">
          Connect Your Wallet
        </h3>
        <WalletMultiButtonFix />
      </div>
    </div>
  );
}

export default CreateEscrowButton;
