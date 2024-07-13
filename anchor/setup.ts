import { PublicKey } from "@solana/web3.js";
import { IdlAccounts } from "@coral-xyz/anchor";
import type { AnchorEscrow } from "./type";

export const makerMintAddress = new PublicKey(
  "13KK1nUnyR9XHt3Fit6saS8CqRWxrYW4QSxyvC7ojvdN"
);

export const reciverMintAddress = new PublicKey(
  "BZ7gtjG2MDoqhhEr3mLTkHr3gaessuc9g1WPJap9pkYv"
);

export type escrow = IdlAccounts<AnchorEscrow>["escrow"];
