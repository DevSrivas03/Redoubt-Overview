import { DS } from "@/lib/dsTokens";
import type { RiskLevel } from "@/types/overview";

export const RISK_COLORS: Record<RiskLevel, string> = {
  extreme: DS.riskExtreme,
  high: DS.riskHigh,
  medium: DS.riskMedium,
  low: DS.statusSuccess,
};

export const RISK_LEVELS: { key: RiskLevel; label: string }[] = [
  { key: "extreme", label: "Extreme" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];
