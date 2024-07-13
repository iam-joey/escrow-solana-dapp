"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { useMakeEscrow } from "@/hooks/instructionsHooks/useEscrow";
import { toast } from "sonner";
import { useMakeEscrow } from "@/hooks/instructionsHooks/useEscrow";

export default function EscrowForm() {
  const [open, setOpen] = useState(false);
  const makeEscrow = useMakeEscrow();
  const createEscrow = async () => {
    try {
      const sign = await makeEscrow(
        "13KK1nUnyR9XHt3Fit6saS8CqRWxrYW4QSxyvC7ojvdN",
        "BZ7gtjG2MDoqhhEr3mLTkHr3gaessuc9g1WPJap9pkYv",
        100,
        500
      );
      console.log("sign is", sign);
      toast.success(sign);
    } catch (error) {
      console.log("error is fetching", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} defaultOpen>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Escrow</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Escrow Agreement</DialogTitle>
          <DialogDescription>
            Please provide the details below to set up your escrow agreement.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 flex-1">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="offeringTokenMint">
                Offering Token Mint Address
              </Label>
              <Input
                id="offeringTokenMint"
                placeholder="Enter the token mint address you are offering"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receivingTokenMint">
                Receiving Token Mint Address
              </Label>
              <Input
                id="receivingTokenMint"
                placeholder="Enter the token mint address you wish to receive"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="offeringAmount">Amount of Tokens Offered</Label>
              <Input
                id="offeringAmount"
                type="number"
                placeholder="Enter the number of tokens you are offering"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receivingAmount">Amount of Tokens Expected</Label>
              <Input
                id="receivingAmount"
                type="number"
                placeholder="Enter the number of tokens you expect to receive"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              setOpen(false);
              createEscrow();
            }}
          >
            Create Escrow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
