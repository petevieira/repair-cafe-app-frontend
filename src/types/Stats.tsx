export type OutcomeScope = "fixed" | "fixedPlusRepairable";

export interface StatsCounts {
  fixed: number;
  repairable: number;
  endOfLife: number;
  unknown: number;
  inQueue: number;
  inProgress: number;
}

export interface ScopedTotals {
  fixed: number;
  fixedPlusRepairable: number;
}

export interface TopCategory {
  category: string;
  count: number;
}

export interface StatsBucket {
  // null for the all-time bucket, otherwise the calendar year
  year: number | null;
  totalIntake: number;
  counts: StatsCounts;
  moneySaved: ScopedTotals;
  weightDiverted: ScopedTotals;
  topCategories: TopCategory[];
  // Event & volunteer metrics
  events: number;
  volunteers: number;
  avgVolunteersPerEvent: number;
  maxItemsAtEvent: number;
  avgItemsPerEvent: number;
}

export interface RepairStats {
  allTime: StatsBucket;
  byYear: StatsBucket[];
}
