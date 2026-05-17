"use client";
import { T } from "./Theme";

export default function BudgetView({ t, budget }: { t: typeof T.dark; budget?: any }) {
  // Mapping the AI-provided budget fields (handling both 'budget' and 'budgetBreakdown' naming)
  const b = budget?.budgetBreakdown || budget;

  const categories = [
    { 
      label: "Flights & Travel", 
      planned: b?.travel || b?.flights || 0, 
      optimised: (b?.travel || b?.flights || 0) * 0.85, 
      icon: "✈️" 
    },
    { 
      label: "Accommodation", 
      planned: b?.stay || b?.hotels || 0, 
      optimised: (b?.stay || b?.hotels || 0) * 0.75, 
      icon: "🏨" 
    },
    { 
      label: "Dining", 
      planned: b?.food || b?.dining || 0, 
      optimised: (b?.food || b?.dining || 0) * 0.80, 
      icon: "🍽️" 
    },
    { 
      label: "Activities", 
      planned: b?.activities || b?.sightseeing || 0, 
      optimised: (b?.activities || b?.sightseeing || 0) * 0.90, 
      icon: "🎭" 
    },
    { 
      label: "Miscellaneous", 
      planned: b?.misc || 0, 
      optimised: (b?.misc || 0) * 0.95, 
      icon: "✨" 
    },
  ];

  // Calculate totals dynamically
  const plannedTotal = b?.total || categories.reduce((sum, cat) => sum + cat.planned, 0);
  const optimisedTotal = b?.optimisedTotal || categories.reduce((sum, cat) => sum + cat.optimised, 0);
  const savings = plannedTotal - optimisedTotal;

  if (!plannedTotal && !budget) {
     return <div style={{ padding: 40, color: t.muted }}>Generating budget insights...</div>;
  }

  return (
    <div style={{ padding: "24px 24px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: t.text, margin: 0 }}>Budget Overview</h2>
          <p style={{ color: t.muted, fontSize: 13, marginTop: 6 }}>Real-time breakdown of your AI-generated travel plan.</p>
        </div>
        <div style={{
          background: t.card, border: `1px solid ${t.border}`,
          borderRadius: 12, padding: "12px 20px", textAlign: "right",
        }}>
          <div style={{ fontSize: 10, color: t.muted }}>POTENTIAL SAVINGS</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: t.accentGreen }}>₹{Math.round(savings).toLocaleString()}</div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Planned Budget", value: `₹${Math.round(plannedTotal).toLocaleString()}`, color: t.text },
          { label: "Optimised Budget", value: `₹${Math.round(optimisedTotal).toLocaleString()}`, color: t.accent },
          { label: "AI Savings", value: `₹${Math.round(savings).toLocaleString()}`, color: t.accentGreen },
        ].map((card, i) => (
          <div key={i} style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: "16px 18px",
            boxShadow: t.shadow,
          }}>
            <div style={{ fontSize: 11, color: t.muted, marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${t.border}`, background: "rgba(255,255,255,0.02)" }}>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, color: t.muted, fontWeight: 600 }}>CATEGORY</th>
              <th style={{ textAlign: "right", padding: "14px 20px", fontSize: 11, color: t.muted, fontWeight: 600 }}>PLANNED</th>
              <th style={{ textAlign: "right", padding: "14px 20px", fontSize: 11, color: t.muted, fontWeight: 600 }}>OPTIMISED</th>
              <th style={{ textAlign: "right", padding: "14px 20px", fontSize: 11, color: t.muted, fontWeight: 600 }}>SAVING</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={i} style={{ borderBottom: i === categories.length - 1 ? "none" : `1px solid ${t.border}` }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{c.label}</span>
                  </div>
                </td>
                <td style={{ textAlign: "right", padding: "16px 20px", fontSize: 13, color: t.text }}>
                   {c.planned > 0 ? `₹${Math.round(c.planned).toLocaleString()}` : "Included"}
                </td>
                <td style={{ textAlign: "right", padding: "16px 20px", fontSize: 13, fontWeight: 700, color: t.text }}>
                   {c.optimised > 0 ? `₹${Math.round(c.optimised).toLocaleString()}` : "—"}
                </td>
                <td style={{ textAlign: "right", padding: "16px 20px", fontSize: 13, fontWeight: 700, color: t.accentGreen }}>
                  {c.planned > c.optimised && c.planned > 0 ? `₹${Math.round(c.planned - c.optimised).toLocaleString()}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}