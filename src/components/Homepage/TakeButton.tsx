"use client";
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
import { useState } from "react";
import { useTakeEscrow } from "@/hooks/instructionsHooks/useEscrow";

export default function TakeButton({ escrow }: { escrow: string }) {
  const [open, setOpen] = useState(false);
  const takeEscrow = useTakeEscrow();
  return (
    <Dialog open={open} onOpenChange={setOpen} defaultOpen>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="default">
          Take
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed with this action? This cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            No
          </Button>
          <Button
            onClick={async () => {
              setOpen(false);
              await takeEscrow(escrow);
            }}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
