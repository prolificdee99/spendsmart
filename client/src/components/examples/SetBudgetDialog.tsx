import { SetBudgetDialog } from "../SetBudgetDialog";

export default function SetBudgetDialogExample() {
  return (
    <div className="p-4">
      <SetBudgetDialog
        category="Food"
        currentLimit={200}
        currentPeriod="weekly"
      />
    </div>
  );
}
