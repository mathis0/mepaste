// icon SVG paths copied verbatim from the design bundle
export const I = {
  eye:    "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z M12 9a3 3 0 100 6 3 3 0 000-6Z",
  eyeOff: "M3 3l18 18 M10.5 6.2A10.6 10.6 0 0112 6c6.5 0 10 6 10 6a16.7 16.7 0 01-3.3 4.2 M6.5 7.5A16.6 16.6 0 002 12s3.5 6 10 6c1.4 0 2.6-.2 3.7-.6",
  lock:   "M6 11h12v9H6z M9 11V7a3 3 0 016 0v4",
  clock:  "M12 7v5l3.5 2 M12 22a10 10 0 110-20 10 10 0 010 20Z",
  flame:  "M12 3s5 5 5 10a5 5 0 11-10 0c0-3 2-5 2-7s1.5-3 3-3Z",
  link:   "M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1 M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1",
  copy:   "M9 9h10v12H9z M5 15V5a2 2 0 012-2h8",
  share:  "M12 3v13 M7 8l5-5 5 5 M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16Z M21 21l-4.3-4.3",
  plus:   "M12 5v14 M5 12h14",
  chev:   "M9 6l6 6-6 6",
  globe:  "M12 22a10 10 0 110-20 10 10 0 010 20Z M2 12h20 M12 2a14 14 0 010 20 M12 2a14 14 0 000 20",
  sun:    "M12 4V2 M12 22v-2 M4 12H2 M22 12h-2 M5 5l-1-1 M20 20l-1-1 M5 19l-1 1 M20 4l-1 1 M12 18a6 6 0 100-12 6 6 0 000 12Z",
  flask:  "M9 3h6 M10 3v5L5 18a2 2 0 002 3h10a2 2 0 002-3l-5-10V3",
  raw:    "M4 7h16 M4 12h16 M4 17h10",
  user:   "M4 21a8 8 0 0116 0 M12 12a4 4 0 100-8 4 4 0 000 8Z",
  bell:   "M6 16V11a6 6 0 1112 0v5l2 2H4l2-2Z M10 21h4",
  info:   "M12 22a10 10 0 110-20 10 10 0 010 20Z M12 11v6 M12 7h.01",
  check:  "M5 12l5 5 9-10",
  back:   "M15 6l-6 6 6 6",
  more:   "M5 12h.01 M12 12h.01 M19 12h.01",
} as const;

export type IconKey = keyof typeof I;
