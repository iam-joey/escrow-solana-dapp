import CreateEscrowButton from "./CreateEscrowButton";
import EscrowCounts from "./EscrowCounts";
import Transactions from "./Transactions";

export default function HomePage() {
  return (
    <div className=" p-3 items-center gap-3">
      <EscrowCounts />
      <CreateEscrowButton />
      <Transactions />
    </div>
  );
}
