import { CategoryChart } from "../CategoryChart";

export default function CategoryChartExample() {
  const data = [
    { category: "Food", amount: 120, color: "hsl(25 90% 60%)" },
    { category: "Transport", amount: 85, color: "hsl(270 70% 60%)" },
    { category: "Airtime", amount: 45, color: "hsl(340 85% 55%)" },
    { category: "Other", amount: 30, color: "hsl(200 70% 50%)" },
  ];

  return (
    <div className="p-4 max-w-md">
      <CategoryChart data={data} />
    </div>
  );
}
