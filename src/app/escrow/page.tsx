"use client";
import { Badge } from "@/components/ui/badge";
import { BN, Wallet } from "@coral-xyz/anchor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { useFetchEscrowAccounts } from "@/hooks/instructionsHooks/useEscrow";
import { ProgramAccount } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { useAnchorProgram } from "@/providers/AnchorProvider";
import RefundButton from "@/components/Homepage/RefundButton";
import TakeButton from "@/components/Homepage/TakeButton";

export default function Transactions() {
  const [escrowAccounts, setEscrowAccounts] = useState<
    ProgramAccount<{
      seed: BN;
      maker: PublicKey;
      mintA: PublicKey;
      mintB: PublicKey;
      receive: BN;
      bump: number;
    }>[]
  >([]);
  const fetchEscrowAccounts = useFetchEscrowAccounts();
  const { publicKey } = useAnchorProgram();
  useEffect(() => {
    const loadEscrowAccounts = async () => {
      const accounts = await fetchEscrowAccounts();
      const updatedAccounts = accounts.filter(
        (data) => data.account.maker.toString() === publicKey
      );
      setEscrowAccounts(updatedAccounts);
    };
    loadEscrowAccounts();
  }, [fetchEscrowAccounts]);

  return escrowAccounts.length > 0 ? (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Your Escrow Transactions</CardTitle>
        <CardDescription>
          Recent transactions in SOL on your escrow platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Maker</TableHead>
              <TableHead className=" sm:table-cell">Mint A</TableHead>
              <TableHead className=" md:table-cell">Mint B</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {escrowAccounts &&
              escrowAccounts.map((data, index) => (
                <TableData
                  maker={data.account.maker.toString()}
                  mintA={data.account.mintA.toString()}
                  mintB={data.account.mintB.toString()}
                  amount={data.account.receive.toString()}
                  key={index}
                  owner={publicKey}
                  escrow={data.publicKey.toString()}
                />
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  ) : (
    <div className="h-[500px] flex justify-center items-center">
      <Zero />
    </div>
  );
}

function Zero() {
  return (
    <Card className="bg-background rounded-md p-6">
      <CardContent className="text-center">
        <h3 className="text-2xl font-semibold">
          You made zero escrows till now
        </h3>
      </CardContent>
    </Card>
  );
}

function TableData({
  amount,
  maker,
  mintA,
  mintB,
  owner,
  escrow,
}: {
  maker: string;
  mintA: string;
  mintB: string;
  amount: string;
  owner?: string;
  escrow: string;
}) {
  return (
    <>
      <TableRow>
        <TableCell>
          <div className=" text-sm font-bold text-muted-foreground md:inline">
            {maker || "asdad"}
          </div>
        </TableCell>
        <TableCell className=" sm:table-cell truncate max-w-[150px]">
          {mintA || "asdasdad"}
        </TableCell>
        <TableCell className=" sm:table-cell truncate max-w-[150px]">
          {mintB || "asdasdasdsadasd"}
        </TableCell>
        <TableCell className="text-right">{amount ?? 0}</TableCell>
        <TableCell className="text-right">
          {owner === maker ? (
            <RefundButton escrow={escrow} />
          ) : (
            <TakeButton escrow={escrow} />
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
