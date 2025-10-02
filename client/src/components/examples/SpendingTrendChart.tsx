import { SpendingTrendChart } from "../SpendingTrendChart";

export default function SpendingTrendChartExample() {
  const data = [
    { date: "Jan 1", amount: 20 },
    { date: "Jan 2", amount: 35 },
    { date: "Jan 3", amount: 15 },
    { date: "Jan 4", amount: 45 },
    { date: "Jan 5", amount: 30 },
    { date: "Jan 6", amount: 50 },
    { date: "Jan 7", amount: 25 },
  ];

  return (
    <div className="p-4 max-w-md">
      <SpendingTrendChart data={data} />
    </div>
  );
}
