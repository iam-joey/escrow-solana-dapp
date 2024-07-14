import { BN } from "@coral-xyz/anchor";
import { randomBytes } from "crypto";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  ComputeBudgetProgram,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useAnchorProgram } from "@/providers/AnchorProvider";
import { useCallback } from "react";
import { toast } from "sonner";

export const useMakeEscrow = () => {
  const { program, connection } = useAnchorProgram();
  const { publicKey } = useWallet();

  const isValidTokenMint = async (address: PublicKey): Promise<boolean> => {
    try {
      console.log("here 3");
      const mintInfo = await getMint(connection, address);
      return mintInfo !== null;
    } catch (error) {
      return false;
    }
  };

  const makeEscrow = async (
    minta: string,
    mintb: string,
    tradeAmount: number,
    receiveAmount: number
  ) => {
    if (!publicKey || !program || !connection) {
      toast.warning("connect your wallet first");
      return;
    }

    try {
      console.log("here 1");
      let mintA = new PublicKey(minta);
      let mintB = new PublicKey(mintb);
      console.log("here 2");
      const isMintAValid = await isValidTokenMint(mintA);
      const isMintBValid = await isValidTokenMint(mintB);

      if (!isMintAValid || !isMintBValid) {
        toast.warning("enter valid token mint addresses");
        return;
      }

      const seed = new BN(randomBytes(8));
      const makerAtaa = getAssociatedTokenAddressSync(
        new PublicKey(mintA),
        new PublicKey(publicKey),
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
      console.log("1");
      const mintAinfo = await getMint(connection, new PublicKey(mintA));
      const mintBinfo = await getMint(connection, new PublicKey(mintB));
      console.log("2");
      const deposit = new BN(tradeAmount * 10 ** mintAinfo.decimals);
      const receive = new BN(receiveAmount * 10 ** mintBinfo.decimals);

      const transactionSign = await program.methods
        .make(seed, deposit, receive)
        .accounts({
          maker: new PublicKey(publicKey),
          mintA: new PublicKey(mintA),
          mintB: new PublicKey(mintB),
          makerAtaA: makerAtaa,
          tokenProgram: TOKEN_PROGRAM_ID,
          vault,
        })
        .rpc();
      toast.success("escrow created successfully");

      return transactionSign;
    } catch (error) {
      console.error("Error in makeEscrow:", error);
      //@ts-ignore
      toast.warning(error.message);
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
        new PublicKey(publicKey),
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
      //@ts-ignore
      toast.warning(error.message);
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

      const sign = await program.methods
        .take()
        .accountsPartial({
          escrow: new PublicKey(escrow),
          takerAtaA,
          takerAtaB,
          makerAtaB,
          vault,
          maker: escrowAccount.maker,
          mintA: escrowAccount.mintA,
          mintB: escrowAccount.mintB,
          taker: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log(sign);
      toast.success(`Transaction completed`);
    } catch (error) {
      console.error("Error in takeEscrow:", error);
      //@ts-ignore
      toast.warning(error.message);
    }
  };

  return takeEscrow;
};

export const useFetchEscrowAccounts = () => {
  const { program, connection } = useAnchorProgram();

  const fetchEscrowAccounts = useCallback(async () => {
    if (!program) return [];
    try {
      const res = await program.account.escrow.all();

      const updatedArray = await Promise.all(
        res.map(async (data) => {
          const mintInfo = await getMint(connection, data.account.mintB);

          const newData = {
            ...data,
            account: {
              ...data.account,
              receive: new BN(data.account.receive).div(
                new BN(10 ** mintInfo.decimals)
              ),
            },
          };
          return newData;
        })
      );

      return updatedArray;
    } catch (error) {
      console.error("Error fetching escrow accounts:", error);
      return [];
    }
  }, [program]);

  return fetchEscrowAccounts;
};
