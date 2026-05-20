export interface DoorContent {
  id: string;
  label: string;
  title: string;
  body: string;
  photos: string[];
  glyph: string; // single character / emoji used in the dock
  voiceNote?: string;
}

export const doors: DoorContent[] = [
  {
    id: "cant-sleep",
    label: "open when you can't sleep",
    title: "insomniac protocol",
    body: "play our song. stare at the ceiling. lose every imaginary argument with me in real time. close your eyes when you've won at least one.",
    photos: ["0-new", "12"],
    glyph: "☽",
  },
  {
    id: "snowing",
    label: "open when it's snowing",
    title: "city in soft focus",
    body: "if it's quiet outside, remember how loud we used to be in winter streets that didn't deserve us.",
    photos: ["2", "3"],
    glyph: "❄",
  },
  {
    id: "proud",
    label: "open when you're proud of yourself",
    title: "look at you go",
    body: "you did a Thing. take the win. spiritually i am the loudest person in your room right now.",
    photos: ["14", "11"],
    glyph: "★",
  },
  {
    id: "long-day",
    label: "open when you've had a long day",
    title: "soft landing",
    body: "permission to be unwell about it for one (1) evening. you can be terrifying again on monday.",
    photos: ["5", "6"],
    glyph: "☀",
  },
  {
    id: "homesick-2am",
    label: "open when you're drunk and homesick at 2am",
    title: "2am protocol",
    body: "step 1: water. step 2: text me one (1) unhinged thought. step 3: blame the weather. step 4: survive the night, repeat.",
    photos: ["8", "18"],
    glyph: "🍾",
  },
  {
    id: "best-dish",
    label: "open when you've made the best dish of the week",
    title: "michelin delusion",
    body: "PRESENTATION: structurally compromised but emotionally devastating. FLAVOR: defies known categories. INSPECTOR'S NOTE: send a photo immediately or we will revoke this star and i will be forced to write a strongly worded review of your texts back.",
    photos: ["10", "15"],
    glyph: "🧑‍🍳",
  },
];
