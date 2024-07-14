import React, { createContext, useState, useEffect, useContext } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorEscrow } from "../../anchor/type";
import idl from "../../anchor/idl.json";
import { AnchorProvider, Program } from "@coral-xyz/anchor";

interface AnchorProgramContextType {
  program: Program<AnchorEscrow> | null;
  connection: any;
  wallet: any;
  publicKey: any;
}

const AnchorProgramContext = createContext<
  AnchorProgramContextType | undefined
>(undefined);

export const AnchorProgramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [program, setProgram] = useState<Program<AnchorEscrow> | null>(null);

  useEffect(() => {
    if (wallet && connection) {
      const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
      });
      const newProgram = new Program(idl as AnchorEscrow, provider);
      setProgram(newProgram);
    } else {
      setProgram(null);
    }
  }, [wallet, connection]);

  const publicKey = wallet?.publicKey?.toString() || null;

  return (
    <AnchorProgramContext.Provider
      value={{ program, connection, wallet, publicKey }}
    >
      {children}
    </AnchorProgramContext.Provider>
  );
};

export const useAnchorProgram = () => {
  const context = useContext(AnchorProgramContext);
  if (context === undefined) {
    throw new Error(
      "useAnchorProgram must be used within an AnchorProgramProvider"
    );
  }
  return context;
};
