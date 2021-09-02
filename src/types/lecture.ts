export type Weekday = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface Lecture {
  id: string;
  title: string;
  times: LectureTime[];
  links?: LectureLink[];
}

export interface LectureTime {
  id: string;
  weekday: Weekday;
  beginTime: string;
  endTime: string;
}

export interface LectureLink {
  id: string;
  label: string;
  url: string;
}
