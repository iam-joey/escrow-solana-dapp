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
      throw new Error("Wallet not connected or program not initialized");
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

      return transactionSign;
    } catch (error) {
      console.error("Error in makeEscrow:", error);
      throw error;
    }
  };

  return makeEscrow;
};
export const useRefundEscrow = async (escrow: string) => {
  try {
    const value = useAnchorProgram();
    const { program, connection } = value;
    const { publicKey } = useWallet();
    if (!publicKey || !program || !connection) return;

    const escrowAccount = await program.account.escrow.fetch(
      new PublicKey(escrow)
    );

    const makerAtaa = getAssociatedTokenAddressSync(
      new PublicKey((await escrowAccount).mintA),
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

    const transactionSign = await program.methods.refund().accountsPartial({
      makerAtaA: makerAtaa,
      tokenProgram: TOKEN_PROGRAM_ID,
      vault,
      escrow: new PublicKey(escrow),
      maker: new PublicKey(escrowAccount.maker),
      mintA: new PublicKey(escrowAccount.mintA),
    });

    return transactionSign;
  } catch (error) {
    console.log(error);
  }
};

export const useTakeEscrow = async (escrow: string) => {
  try {
    const value = useAnchorProgram();
    const { program, connection } = value;
    const { publicKey } = useWallet();
    if (!publicKey || !program || !connection) return;

    const escrowAccount = await program.account.escrow.fetch(
      new PublicKey(escrow)
    );

    const takerAtaA = getAssociatedTokenAddressSync(
      new PublicKey(escrowAccount.mintA),
      publicKey,
      false,
      TOKEN_PROGRAM_ID
    );

    const takerAtaB = getAssociatedTokenAddressSync(
      new PublicKey(escrowAccount.mintB),
      publicKey,
      false,
      TOKEN_PROGRAM_ID
    );

    const makerAtab = getAssociatedTokenAddressSync(
      new PublicKey(escrowAccount.mintB),
      escrowAccount.maker,
      false,
      TOKEN_PROGRAM_ID
    );

    const vault = getAssociatedTokenAddressSync(
      new PublicKey(escrowAccount.mintA),
      new PublicKey(escrow),
      true,
      TOKEN_PROGRAM_ID
    );

    const transactionSign = await program.methods.take().accountsPartial({
      maker: escrowAccount.maker,
      escrow: new PublicKey(escrow),
      mintA: new PublicKey(escrowAccount.mintA),
      mintB: new PublicKey(escrowAccount.mintB),
      makerAtaB: makerAtab,
      takerAtaA,
      takerAtaB,
      taker: publicKey,
      vault,
    });

    return transactionSign;
  } catch (error) {
    console.log(error);
  }
};

export const useFetchEscrowAccounts = () => {
  const { program } = useAnchorProgram();

  const fetchEscrowAccounts = useCallback(async () => {
    if (!program) return [];
    try {
      const res = await program.account.escrow.all();
      console.log("data fetched", res);
      return res;
    } catch (error) {
      console.error("Error fetching escrow accounts:", error);
      return [];
    }
  }, [program]);

  return fetchEscrowAccounts;
};
