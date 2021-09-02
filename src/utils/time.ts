import { Weekday } from "../types/lecture";

export const WEEKDAYS: Weekday[] = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

export function parseTime(s: string): number {
  const parts = s.split(":").map((p) => parseInt(p, 10));
  if (parts.length !== 2) {
    throw Error(`Invalid time string: ${s}`);
  }
  return parts[0] * 60 + parts[1];
}
