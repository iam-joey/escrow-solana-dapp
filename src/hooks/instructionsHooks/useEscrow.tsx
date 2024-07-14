import { BN } from "@coral-xyz/anchor";
import { randomBytes } from "crypto";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useAnchorProgram } from "@/providers/AnchorProvider";
import { useCallback } from "react";
import { toast } from "sonner";

export const useMakeEscrow = () => {
  const { program, connection } = useAnchorProgram();
  const { publicKey } = useWallet();

  const makeEscrow = async (
    mintA: string,
    mintB: string,
    tradeAmount: number,
    receiveAmount: number
  ) => {
    if (!publicKey || !program || !connection) {
      toast.warning("connect your wallet first");
      return;
    }

    try {
      const seed = new BN(randomBytes(8));
      const makerAtaa = getAssociatedTokenAddressSync(
        new PublicKey(mintA),
        publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      const [escrowAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("escrow"),
          publicKey.toBuffer(),
          seed.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(mintA),
        escrowAccount,
        true,
        TOKEN_PROGRAM_ID
      );

      const mintAinfo = await getMint(connection, new PublicKey(mintA));
      const mintBinfo = await getMint(connection, new PublicKey(mintB));

      const deposit = new BN(tradeAmount * 10 ** mintAinfo.decimals);
      const receive = new BN(receiveAmount * 10 ** mintBinfo.decimals);

      const transactionSign = await program.methods
        .make(seed, deposit, receive)
        .accounts({
          maker: publicKey,
          mintA: new PublicKey(mintA),
          mintB: new PublicKey(mintB),
          makerAtaA: makerAtaa,
          tokenProgram: TOKEN_PROGRAM_ID,
          vault,
        })
        .rpc();
      toast.success("Transaction Succeded");
      return transactionSign;
    } catch (error) {
      console.error("Error in makeEscrow:", error);
      toast.warning("something went wrong while making escrow");
    }
  };

  return makeEscrow;
};
export const useRefundEscrow = () => {
  const { program, connection } = useAnchorProgram();
  const { publicKey } = useWallet();

  const refundEscrow = async (escrow: string) => {
    try {
      if (!publicKey || !program || !connection) {
        toast.warning("Connect your wallet first");
        return;
      }

      const escrowAccount = await program.account.escrow.fetch(
        new PublicKey(escrow)
      );

      const makerAtaa = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        new PublicKey(escrow),
        true,
        TOKEN_PROGRAM_ID
      );

      const transactionSign = await program.methods
        .refund()
        .accountsPartial({
          makerAtaA: makerAtaa,
          tokenProgram: TOKEN_PROGRAM_ID,
          vault,
          escrow: new PublicKey(escrow),
          maker: new PublicKey(escrowAccount.maker),
          mintA: new PublicKey(escrowAccount.mintA),
        })
        .rpc();
      toast.success("Transaction Succeded");
      return transactionSign;
    } catch (error) {
      console.error("Error in refundEscrow:", error);
      toast.warning("Something went wrong while doing refund");
    }
  };

  return refundEscrow;
};

export const useTakeEscrow = () => {
  const { program, connection, publicKey, wallet } = useAnchorProgram();

  const takeEscrow = async (escrow: string) => {
    try {
      if (!publicKey || !program || !connection || !wallet) {
        toast.warning("Connect your wallet first");
        return;
      }

      const escrowAccount = await program.account.escrow.fetch(
        new PublicKey(escrow)
      );

      const takerAtaA = getAssociatedTokenAddressSync(
        escrowAccount.mintA,
        new PublicKey(publicKey),
        false,
        TOKEN_PROGRAM_ID
      );
      const takerAtaB = getAssociatedTokenAddressSync(
        escrowAccount.mintB,
        new PublicKey(publicKey),
        false,
        TOKEN_PROGRAM_ID
      );
      console.log("asdasdsad", takerAtaB.toString());
      console.log("asdasdsad", takerAtaA.toString());
      const makerAtaB = getAssociatedTokenAddressSync(
        escrowAccount.mintB,
        escrowAccount.maker,
        false,
        TOKEN_PROGRAM_ID
      );
      const vault = getAssociatedTokenAddressSync(
        escrowAccount.mintA,
        new PublicKey(escrow),
        true,
        TOKEN_PROGRAM_ID
      );

      const transactionSign = await program.methods
        .take()
        .accountsPartial({
          escrow: new PublicKey(escrow),
          maker: escrowAccount.maker,
          makerAtaB,
          taker: new PublicKey(publicKey),
          takerAtaA,
          takerAtaB,
          vault,
          tokenProgram: TOKEN_PROGRAM_ID,
          mintA: escrowAccount.mintA,
          mintB: escrowAccount.mintB,
        })
        .rpc();

      toast.success("Transaction completed");
      return transactionSign;
    } catch (error) {
      console.error("Error in takeEscrow:", error);
      toast.warning("Something went wrong while taking escrow deal");
    }
  };

  return takeEscrow;
};

export const useFetchEscrowAccounts = () => {
  const { program } = useAnchorProgram();

  const fetchEscrowAccounts = useCallback(async () => {
    if (!program) return [];
    try {
      const res = await program.account.escrow.all();
      return res;
    } catch (error) {
      console.error("Error fetching escrow accounts:", error);
      return [];
    }
  }, [program]);

  return fetchEscrowAccounts;
};
