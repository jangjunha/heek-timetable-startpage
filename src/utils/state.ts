import { Lecture } from "../types/lecture";

export interface State {
  version: "1";
  lectures: Lecture[];
}

export const INITIAL_STATE: State = {
  version: "1",
  lectures: [],
};

export const EXAMPLE_STATE: State = {
  version: "1",
  lectures: [
    {
      id: "00000000-0000-0000-0000-000000000001",
      title: "Cloud Computing",
      times: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          weekday: "MON",
          beginTime: "10:30",
          endTime: "11:45",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          weekday: "WED",
          beginTime: "10:30",
          endTime: "11:45",
        },
      ],
      links: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          label: "📺 Zoom",
          url: "https://www.zoom.us",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          label: "📃 Material",
          url: "https://www.kubernetes.io",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      title: "Introduction to Economics",
      times: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          weekday: "MON",
          beginTime: "12:00",
          endTime: "13:15",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          weekday: "WED",
          beginTime: "12:00",
          endTime: "13:15",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      title: "Crime and Society",
      times: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          weekday: "MON",
          beginTime: "14:00",
          endTime: "15:15",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          weekday: "WED",
          beginTime: "14:00",
          endTime: "15:15",
        },
      ],
      links: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          label: "📺 Zoom",
          url: "https://www.zoom.us",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000004",
      title: "Authentic Record of Chosun Dynasty",
      times: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          weekday: "MON",
          beginTime: "15:30",
          endTime: "16:45",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          weekday: "WED",
          beginTime: "15:30",
          endTime: "16:45",
        },
      ],
      links: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          label: "📽 Google Meet",
          url: "https://apps.google.com/meet/",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          label: "📘 Textbook",
          url: "http://sillok.history.go.kr",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000005",
      title: "French (Beginner)",
      times: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          weekday: "TUE",
          beginTime: "12:00",
          endTime: "13:15",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          weekday: "THU",
          beginTime: "12:00",
          endTime: "13:15",
        },
      ],
      links: [
        {
          id: "00000000-0000-0000-0000-000000000002",
          label: "🧑‍🏫 Blackboard",
          url: "https://kulms.korea.ac.kr",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          label: "📃 Material",
          url: "https://en.wikipedia.org/wiki/French_language",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000006",
      title: "Advanced Logic",
      times: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          weekday: "TUE",
          beginTime: "14:00",
          endTime: "15:15",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          weekday: "THU",
          beginTime: "14:00",
          endTime: "15:15",
        },
      ],
      links: [
        {
          id: "00000000-0000-0000-0000-000000000002",
          label: "🧑‍🏫 Blackboard",
          url: "https://kulms.korea.ac.kr",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000007",
      title: "Freshman Seminar I",
      times: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          weekday: "FRI",
          beginTime: "12:00",
          endTime: "15:15",
        },
      ],
    },
  ],
};

const prefixed = (key: string) => `state/${key}`;

export const load = (key: string): State | undefined => {
  const raw = window.localStorage.getItem(prefixed(key));
  if (raw == null) {
    return;
  }
  return JSON.parse(raw);
};

export const save = (key: string, state: State): void => {
  const raw = JSON.stringify(state);
  window.localStorage.setItem(prefixed(key), raw);
};

export const remove = (key: string): void => {
  window.localStorage.removeItem(prefixed(key));
};

export function getPageKeys(): string[] {
  return Object.keys(window.localStorage)
    .filter((k) => k.startsWith("state/"))
    .map((k) => k.slice(6));
}
