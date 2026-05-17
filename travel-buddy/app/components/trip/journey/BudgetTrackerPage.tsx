"use client";

import {
  ArrowUpRight,
  CreditCard,
  Wallet,
  PiggyBank,
  TrendingUp,
  Plus
} from "lucide-react";
import { useJourneyStore } from "@/store/journeyStore";
import { budgetStatus } from "@/lib/journey-engine";
import { useState } from "react";

export default function BudgetTrackerPage() {
  const { trip, expenses, addExpense } = useJourneyStore();
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Food");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalBudget = trip?.budget || 0;
  const status = budgetStatus(totalBudget, expenses);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !title || !trip?._id) return;
    setIsSubmitting(true);
    await addExpense(trip._id, {
       amount: Number(amount),
       title,
       category,
       date: new Date().toISOString()
    });
    setAmount("");
    setTitle("");
    setIsSubmitting(false);
  };

  const categoryTotals = expenses.reduce((acc: any, curr: any) => {
    const cat = curr.category || 'General';
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  const maxCategory = Object.keys(categoryTotals).length > 0 
    ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b) 
    : "None";

  const isOverspending = status.percentage >= 90;

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#070B16] p-4 lg:p-8 text-black dark:text-white transition-colors">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <div className={`rounded-3xl p-8 text-white overflow-hidden relative transition-colors ${isOverspending ? 'bg-gradient-to-br from-red-600 to-orange-500' : 'bg-gradient-to-br from-blue-600 to-cyan-500'}`}>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-sm text-white/80">Trip Budget Remaining</p>
                <h1 className="text-5xl font-bold mt-2">₹{status.remaining.toLocaleString()}</h1>
                <p className="mt-4 text-white/90 max-w-md">
                  {isOverspending 
                    ? `Warning: You have used ${status.percentage}% of your budget!` 
                    : `Budget performance is stable. You have spent ${status.percentage}% of your total budget.`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80">Total Planned</p>
                <h3 className="text-2xl font-semibold mt-1">₹{totalBudget.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BudgetCard title="Remaining" amount={`₹${status.remaining.toLocaleString()}`} icon={<Wallet />} />
            <BudgetCard title="Total Spent" amount={`₹${status.spent.toLocaleString()}`} icon={<CreditCard />} />
            <BudgetCard title="Top Category" amount={maxCategory} icon={<PiggyBank />} />
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Expense Activity</h2>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {expenses.length > 0 ? expenses.map((expense: any, idx: number) => (
                <ExpenseItem 
                  key={expense.id || idx} 
                  name={expense.title} 
                  amount={`₹${expense.amount.toLocaleString()}`} 
                  category={expense.category} 
                />
              )) : (
                <div className="text-black/50 dark:text-white/50 text-sm text-center py-8">No expenses logged yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
            <h3 className="font-semibold text-lg mb-5">Log New Expense</h3>
            
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-sm text-black/60 dark:text-white/60 mb-1 block">Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500" 
                  placeholder="e.g. 1200" 
                />
              </div>
              
              <div>
                <label className="text-sm text-black/60 dark:text-white/60 mb-1 block">Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500" 
                  placeholder="e.g. Sushi Dinner" 
                />
              </div>
              
              <div>
                <label className="text-sm text-black/60 dark:text-white/60 mb-1 block">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="Food">Food & Dining</option>
                  <option value="Transport">Transport</option>
                  <option value="Stay">Accommodation</option>
                  <option value="Activity">Activities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 text-black font-semibold py-3 hover:bg-cyan-400 transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                {isSubmitting ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
            <h3 className="font-semibold text-lg mb-5">Budget Health</h3>

            <div className="space-y-4">
              <Insight text={isOverspending ? "CRITICAL: You are over budget constraints." : `You have spent ${status.percentage}% of your planned budget.`} type={isOverspending ? 'alert' : 'info'} />
              {maxCategory !== "None" && <Insight text={`Highest spending category is ${maxCategory}.`} type="warning" />}
              {status.percentage < 50 && expenses.length > 0 && <Insight text="You are well under budget today!" type="success" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}   
function BudgetCard({ title, amount, icon }: any) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-black/50 dark:text-white/50 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{amount}</h3>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
function ExpenseItem({ name, amount, category }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/10 p-4">
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-black/50 dark:text-white/50">{category}</p>
      </div>

      <div className="flex items-center gap-2 text-red-500 font-semibold">
        <ArrowUpRight className="w-4 h-4" />
        {amount}
      </div>
    </div>
  );
}
function Insight({ text, type = 'info' }: any) {
  const bgColors: any = {
    warning: "bg-orange-500/10 text-orange-500",
    alert: "bg-red-500/10 text-red-500",
    success: "bg-green-500/10 text-green-500",
    info: "bg-cyan-500/10 text-cyan-500"
  };
  return (
    <div className={`rounded-2xl p-4 text-sm ${bgColors[type] || bgColors.info}`}>
      {text}
    </div>
  );
}