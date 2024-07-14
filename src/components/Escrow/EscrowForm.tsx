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
import { toast } from "sonner";
import { useMakeEscrow } from "@/hooks/instructionsHooks/useEscrow";
import { makerMintAddress, reciverMintAddress } from "../../../anchor/setup";
import { useRouter } from "next/navigation";

export default function EscrowForm() {
  const [open, setOpen] = useState(false);
  const makeEscrow = useMakeEscrow();
  const [mintA, setMintA] = useState("");
  const [mintB, setMintB] = useState("");
  const [amount, setAmount] = useState(100);
  const [receive, setRecive] = useState(200);
  const router = useRouter();
  const createEscrow = async () => {
    try {
      if (mintA === "" || mintB === "") {
        toast.warning("Fill the token mint address");
      }
      if (amount < 0 || receive < 0) {
        toast.warning("Amount should be greater than 0");
      }
      await makeEscrow(mintA, mintB, amount, receive);
      router.push("/escrow");
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
                placeholder={`EX:${makerMintAddress.toString()}`}
                onChange={(e) => {
                  setMintA(e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receivingTokenMint">
                Receiving Token Mint Address
              </Label>
              <Input
                id="receivingTokenMint"
                placeholder={`EX:${reciverMintAddress.toString()}`}
                onChange={(e) => {
                  setMintB(e.target.value);
                }}
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
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receivingAmount">Amount of Tokens Expected</Label>
              <Input
                id="receivingAmount"
                type="number"
                placeholder="Enter the number of tokens you expect to receive"
                onChange={(e) => {
                  setRecive(Number(e.target.value));
                }}
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
