import React from "react";
import { Button } from "../ui/button";

function CreateEscrowButton() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-[300px] my-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Secure Your Transactions with Escrow
        </h3>
        <p className="text-sm text-muted-foreground">
          Ensure safety and trust in your transactions. Create an escrow account
          to protect both parties and manage funds securely.
        </p>
        <Button className="mt-4">Create Escrow</Button>
      </div>
    </div>
  );
}

export default CreateEscrowButton;
