"use client";
import { Badge } from "@/components/ui/badge";

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

export default function Transactions() {
  const [escrowAccounts, setEscrowAccounts] = useState<any[]>([]);
  const fetchEscrowAccounts = useFetchEscrowAccounts();

  useEffect(() => {
    const loadEscrowAccounts = async () => {
      const accounts = await fetchEscrowAccounts();
      setEscrowAccounts(accounts);
      console.log("accounts", accounts);
    };

    loadEscrowAccounts();
  }, [fetchEscrowAccounts]);

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Escrow Transactions</CardTitle>
        <CardDescription>
          Recent transactions in SOL on your escrow platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {escrowAccounts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Transaction Type
                </TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Amount (SOL)</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableData />
            </TableBody>
          </Table>
        ) : (
          <p>No escrow accounts found.</p>
        )}
      </CardContent>
    </Card>
  );
}

interface TableDatProps {
  seed: string;
  maker: string;
  mintA: string;
  mintB: string;
  receive: string;
  bump: string;
}

function TableData() {
  return (
    <>
      <TableRow>
        <TableCell>
          <div className="hidden text-sm text-muted-foreground md:inline">
            Wallet: 0xM3N4...O5P6
          </div>
        </TableCell>
        <TableCell className="hidden sm:table-cell">Escrow Payment</TableCell>
        <TableCell className="hidden sm:table-cell">
          <Badge className="text-xs" variant="secondary">
            Pending
          </Badge>
        </TableCell>
        <TableCell className="text-right">15.00</TableCell>
        <TableCell className="text-right">
          <TakeButton />
        </TableCell>
      </TableRow>
    </>
  );
}
