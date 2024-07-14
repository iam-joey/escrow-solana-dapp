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
import TakeButton from "./TakeButton";
import { useEffect, useState } from "react";
import { useFetchEscrowAccounts } from "@/hooks/instructionsHooks/useEscrow";
import { ProgramAccount } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { useAnchorProgram } from "@/providers/AnchorProvider";
import RefundButton from "./RefundButton";

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
        (data) => data.account.maker.toString() !== publicKey
      );
      setEscrowAccounts(updatedAccounts);
    };
    loadEscrowAccounts();
  }, [fetchEscrowAccounts]);

  return (
    escrowAccounts.length > 0 && (
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Escrow Transactions</CardTitle>
          <CardDescription>
            Recent transactions in SOL on your escrow platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Maker</TableHead>
                <TableHead className="hidden sm:table-cell">Mint A</TableHead>
                <TableHead className="hidden md:table-cell">Mint B</TableHead>
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
    )
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
        <LinkToMint mint={mintA} />
        <LinkToMint mint={mintB} />
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

function LinkToMint({ mint }: { mint: string }) {
  function generateSolanaExplorerLink(mintAddress: string): string {
    const baseURL = "https://explorer.solana.com/address/";
    const network = "devnet"; // You can change this to 'mainnet-beta' for mainnet

    return `${baseURL}${mintAddress}?cluster=${network}`;
  }
  const explorerLink = generateSolanaExplorerLink(mint);
  const handleClick = (event: any) => {
    event.preventDefault();
    window.open(explorerLink, "_blank");
  };

  const truncateMintString = (str: any, maxLength: any) => {
    if (str.length <= maxLength) return str;
    const firstPart = str.substring(0, maxLength / 2);
    const lastPart = str.substring(str.length - maxLength / 2);
    return `${firstPart}....${lastPart}`;
  };
  return (
    <TableCell className="sm:table-cell truncate max-w-[150px] hover:text-green-600 hover:border-b border-green-700">
      <a
        href={explorerLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <h1>{truncateMintString(mint, 10)}</h1>
      </a>
    </TableCell>
  );
}
