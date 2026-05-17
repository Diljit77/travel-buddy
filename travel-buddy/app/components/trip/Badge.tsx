import { T } from "./Theme";

export function Badge({ children, color, t }: { children: React.ReactNode; color: string; t: typeof T.dark }) {
  const styles: any = {
    blue: { bg: "rgba(59,130,246,0.12)", text: t.accent },
    orange: { bg: "rgba(249,115,22,0.12)", text: t.accentOrange },
    green: { bg: "rgba(16,185,129,0.12)", text: t.accentGreen },
    gray: { bg: "rgba(138,138,152,0.12)", text: t.muted },
  };
  const s = styles[color] || styles.blue;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700,
      background: s.bg, color: s.text, letterSpacing: "0.02em", textTransform: "uppercase"
    }}>
      {children}
    </span>
  );
}
