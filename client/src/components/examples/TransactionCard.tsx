import { TransactionCard } from "../TransactionCard";

export default function TransactionCardExample() {
  return (
    <div className="space-y-3 p-4 max-w-md">
      <TransactionCard
        id="1"
        amount={25.50}
        category="Food"
        service="MTN"
        date={new Date()}
        notes="Lunch at campus cafeteria"
        onEdit={() => console.log("Edit transaction 1")}
      />
      <TransactionCard
        id="2"
        amount={10.00}
        category="Transport"
        service="AirtelTigo"
        date={new Date(Date.now() - 3600000)}
        onEdit={() => console.log("Edit transaction 2")}
      />
      <TransactionCard
        id="3"
        amount={5.00}
        category="Airtime"
        service="Telecel"
        date={new Date(Date.now() - 7200000)}
        notes="Data bundle"
        onEdit={() => console.log("Edit transaction 3")}
      />
    </div>
  );
}
