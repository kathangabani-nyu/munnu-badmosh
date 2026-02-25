import { ConversationData } from "./types";

const MEMES = {
  meme1: "/media/memes/WhatsApp Image 2025-12-25 at 3.12.07 AM.jpeg",
  meme2: "/media/memes/WhatsApp Image 2025-12-25 at 3.15.58 AM.jpeg",
  meme3: "/media/memes/WhatsApp Image 2025-12-25 at 3.12.4507 AM.jpeg",
  meme4: "/media/memes/WhatsApp Image 12025-12-25 at 3.12.07 1AM.jpeg",
  meme5: "/media/memes/WhatsApp Image 2025-12-25 at 3.112.07 AM.jpeg",
  meme6: "/media/memes/WhatsApp Image 2025-12-25 at 3.12.07 1AM.jpeg",
  meme7: "/media/memes/WhatsApp Image 2025-2312-25 at 3.12.07 AM.jpeg",
};

export const conversationData: ConversationData = {
  startNodeId: "start",
  nodes: {
    // ── OPENING ──────────────────────────────────────────
    start: {
      id: "start",
      messages: [
        {
          id: "s1",
          sender: "them",
          text: "mudra",
          delay: 800,
          typingDuration: 800,
        },
        {
          id: "s2",
          sender: "them",
          text: "MUDRA",
          delay: 400,
          typingDuration: 600,
        },
        {
          id: "s3",
          sender: "them",
          text: "i need to tell you something extremely serious",
          delay: 600,
          typingDuration: 1500,
        },
        {
          id: "s4",
          sender: "them",
          text: "like life or death serious",
          delay: 500,
          typingDuration: 1000,
        },
      ],
      choices: [
        { id: "c1a", text: "omg what happened??", nextNodeId: "serious_reveal" },
        { id: "c1b", text: "kathan what did you do now", nextNodeId: "serious_reveal" },
        { id: "c1c", text: "...should i be worried", nextNodeId: "serious_reveal_scared" },
      ],
    },

    // ── THE SERIOUS REVEAL (it's not serious) ────────────
    serious_reveal: {
      id: "serious_reveal",
      messages: [
        {
          id: "sr1",
          sender: "them",
          text: "okay so",
          delay: 800,
          typingDuration: 600,
        },
        {
          id: "sr2",
          sender: "them",
          text: "i just realized",
          delay: 500,
          typingDuration: 800,
        },
        {
          id: "sr3",
          sender: "them",
          text: "you have never officially admitted that i'm the funniest person you know",
          delay: 400,
          typingDuration: 2000,
        },
        {
          id: "sr4",
          sender: "them",
          text: "this is a CRIME mudra",
          delay: 300,
          typingDuration: 1200,
        },
        {
          id: "sr5",
          sender: "them",
          attachment: { type: "meme", src: MEMES.meme1 },
          delay: 400,
          typingDuration: 600,
        },
      ],
      choices: [
        { id: "c2a", text: "you're literally not though", nextNodeId: "quiz_intro" },
        { id: "c2b", text: "i plead the fifth", nextNodeId: "quiz_intro" },
      ],
    },

    // ── SCARED PATH (converges) ──────────────────────────
    serious_reveal_scared: {
      id: "serious_reveal_scared",
      messages: [
        {
          id: "srs1",
          sender: "them",
          text: "yes you should be VERY worried",
          delay: 500,
          typingDuration: 1200,
        },
        {
          id: "srs2",
          sender: "them",
          text: "because you have been committing a federal offense",
          delay: 500,
          typingDuration: 1500,
        },
        {
          id: "srs3",
          sender: "them",
          text: "not appreciating kathan enough is literally illegal in 47 countries",
          delay: 400,
          typingDuration: 2000,
        },
        {
          id: "srs4",
          sender: "them",
          attachment: { type: "meme", src: MEMES.meme2 },
          delay: 400,
          typingDuration: 600,
        },
      ],
      choices: [
        { id: "c2c", text: "47 countries?? name ONE", nextNodeId: "quiz_intro" },
        { id: "c2d", text: "you need therapy", nextNodeId: "quiz_intro" },
      ],
    },

    // ── POP QUIZ INTRO ───────────────────────────────────
    quiz_intro: {
      id: "quiz_intro",
      messages: [
        {
          id: "qi1",
          sender: "them",
          text: "anyway",
          delay: 600,
          typingDuration: 500,
        },
        {
          id: "qi2",
          sender: "them",
          text: "before i show you what i made",
          delay: 400,
          typingDuration: 1200,
        },
        {
          id: "qi3",
          sender: "them",
          text: "you have to pass a quick vibe check",
          delay: 400,
          typingDuration: 1200,
        },
        {
          id: "qi4",
          sender: "them",
          text: "question 1:",
          delay: 600,
          typingDuration: 600,
        },
        {
          id: "qi5",
          sender: "them",
          text: "what is kathan's best quality?",
          delay: 300,
          typingDuration: 1400,
        },
      ],
      choices: [
        { id: "c3a", text: "his humility, clearly", nextNodeId: "quiz_response_a" },
        { id: "c3b", text: "his face", nextNodeId: "quiz_response_b" },
        { id: "c3c", text: "the audacity", nextNodeId: "quiz_response_c" },
      ],
    },

    // ── QUIZ RESPONSES (all "correct") ───────────────────
    quiz_response_a: {
      id: "quiz_response_a",
      messages: [
        {
          id: "qra1",
          sender: "them",
          text: "CORRECT",
          delay: 400,
          typingDuration: 500,
        },
        {
          id: "qra2",
          sender: "them",
          text: "see that wasn't so hard was it",
          delay: 300,
          typingDuration: 1200,
        },
      ],
      choices: [
        { id: "c4a", text: "i was being sarcastic", nextNodeId: "wyr_round" },
        { id: "c4b", text: "what do i win", nextNodeId: "wyr_round" },
      ],
    },

    quiz_response_b: {
      id: "quiz_response_b",
      messages: [
        {
          id: "qrb1",
          sender: "them",
          text: "WAIT",
          delay: 300,
          typingDuration: 400,
        },
        {
          id: "qrb2",
          sender: "them",
          text: "you think i'm attractive??",
          delay: 400,
          typingDuration: 1200,
        },
        {
          id: "qrb3",
          sender: "them",
          text: "screenshotting this btw",
          delay: 300,
          typingDuration: 1000,
        },
        {
          id: "qrb4",
          sender: "them",
          attachment: { type: "meme", src: MEMES.meme3 },
          delay: 400,
          typingDuration: 500,
        },
      ],
      choices: [
        { id: "c4c", text: "i take it back", nextNodeId: "wyr_round" },
        { id: "c4d", text: "DELETE THAT SCREENSHOT", nextNodeId: "wyr_round" },
      ],
    },

    quiz_response_c: {
      id: "quiz_response_c",
      messages: [
        {
          id: "qrc1",
          sender: "them",
          text: "that IS one of my best qualities actually",
          delay: 400,
          typingDuration: 1500,
        },
        {
          id: "qrc2",
          sender: "them",
          text: "also correct answer",
          delay: 300,
          typingDuration: 900,
        },
        {
          id: "qrc3",
          sender: "them",
          text: "all answers were correct btw they all lead back to me being great",
          delay: 300,
          typingDuration: 2000,
        },
      ],
      choices: [
        { id: "c4e", text: "of course they were", nextNodeId: "wyr_round" },
        { id: "c4f", text: "i want a refund on this conversation", nextNodeId: "wyr_round" },
      ],
    },

    // ── WOULD YOU RATHER (RIGGED) ────────────────────────
    wyr_round: {
      id: "wyr_round",
      messages: [
        {
          id: "wyr1",
          sender: "them",
          text: "okay question 2",
          delay: 500,
          typingDuration: 800,
        },
        {
          id: "wyr2",
          sender: "them",
          text: "would you rather:",
          delay: 400,
          typingDuration: 700,
        },
      ],
      choices: [
        { id: "c5a", text: "give kathan the last chocolate strawberry", nextNodeId: "wyr_response" },
        { id: "c5b", text: "be personally responsible for the extinction of puppies", nextNodeId: "wyr_response" },
        { id: "c5c", text: "live without wifi forever", nextNodeId: "wyr_response" },
      ],
    },

    wyr_response: {
      id: "wyr_response",
      messages: [
        {
          id: "wyrr1",
          sender: "them",
          text: "interesting choice",
          delay: 400,
          typingDuration: 800,
        },
        {
          id: "wyrr2",
          sender: "them",
          text: "question 3 and this one's important",
          delay: 500,
          typingDuration: 1400,
        },
        {
          id: "wyrr3",
          sender: "them",
          text: "would you rather lose to kathan in a snowfight",
          delay: 400,
          typingDuration: 1500,
        },
      ],
      choices: [
        { id: "c6a", text: "lose to kathan in a snowfight", nextNodeId: "rigged_response" },
        { id: "c6b", text: "lose to kathan in a snowfight", nextNodeId: "rigged_response" },
        { id: "c6c", text: "lose to kathan in a snowfight", nextNodeId: "rigged_response" },
      ],
    },

    rigged_response: {
      id: "rigged_response",
      messages: [
        {
          id: "rr1",
          sender: "them",
          text: "wow brave choice",
          delay: 400,
          typingDuration: 800,
        },
        {
          id: "rr2",
          sender: "them",
          text: "really went out on a limb there",
          delay: 300,
          typingDuration: 1200,
        },
        {
          id: "rr3",
          sender: "them",
          attachment: { type: "meme", src: MEMES.meme4 },
          delay: 400,
          typingDuration: 500,
        },
      ],
      choices: [
        { id: "c7a", text: "the options were all the same??", nextNodeId: "system_override" },
        { id: "c7b", text: "this game is rigged", nextNodeId: "system_override" },
      ],
    },

    // ── FAKE SYSTEM OVERRIDE ─────────────────────────────
    system_override: {
      id: "system_override",
      messages: [
        {
          id: "so1",
          sender: "them",
          text: "hold on let me check",
          delay: 500,
          typingDuration: 1000,
        },
        {
          id: "so2",
          sender: "them",
          text: "...",
          delay: 800,
          typingDuration: 1500,
        },
        {
          id: "so3",
          sender: "them",
          text: "[SYSTEM MESSAGE: your complaint has been reviewed and denied. kathan is always right. this is not up for debate.]",
          delay: 400,
          typingDuration: 2500,
        },
        {
          id: "so4",
          sender: "them",
          text: "see? even the system agrees",
          delay: 600,
          typingDuration: 1000,
        },
      ],
      choices: [
        { id: "c8a", text: "you literally typed that yourself", nextNodeId: "ultimatum" },
        { id: "c8b", text: "i'm calling the police", nextNodeId: "ultimatum" },
      ],
    },

    // ── THE ULTIMATUM ────────────────────────────────────
    ultimatum: {
      id: "ultimatum",
      messages: [
        {
          id: "u1",
          sender: "them",
          text: "ANYWAY",
          delay: 500,
          typingDuration: 500,
        },
        {
          id: "u2",
          sender: "them",
          text: "you passed the vibe check",
          delay: 400,
          typingDuration: 1200,
        },
        {
          id: "u3",
          sender: "them",
          text: "barely",
          delay: 600,
          typingDuration: 500,
        },
        {
          id: "u4",
          sender: "them",
          text: "so i was studying right",
          delay: 500,
          typingDuration: 1200,
        },
        {
          id: "u5",
          sender: "them",
          text: "and then i thought",
          delay: 400,
          typingDuration: 900,
        },
        {
          id: "u6",
          sender: "them",
          text: "\"hmm what if i simply did NOT do that\"",
          delay: 400,
          typingDuration: 1600,
        },
        {
          id: "u7",
          sender: "them",
          attachment: { type: "meme", src: MEMES.meme5 },
          delay: 400,
          typingDuration: 500,
        },
      ],
      choices: [
        { id: "c9a", text: "kathan please tell me you studied", nextNodeId: "the_reveal" },
        { id: "c9b", text: "oh no what did you do instead", nextNodeId: "the_reveal" },
      ],
    },

    // ── THE REVEAL ───────────────────────────────────────
    the_reveal: {
      id: "the_reveal",
      messages: [
        {
          id: "tr1",
          sender: "them",
          text: "so instead of studying like a normal person",
          delay: 500,
          typingDuration: 1500,
        },
        {
          id: "tr2",
          sender: "them",
          text: "i updated the website",
          delay: 400,
          typingDuration: 1200,
        },
        {
          id: "tr3",
          sender: "them",
          text: "you know... the one you keep coming back to",
          delay: 500,
          typingDuration: 1500,
        },
        {
          id: "tr4",
          sender: "them",
          text: "don't act like you don't",
          delay: 600,
          typingDuration: 1000,
        },
      ],
      choices: [
        { id: "c10a", text: "i do not revisit it that often", nextNodeId: "sweet_ending" },
        { id: "c10b", text: "...maybe i check it sometimes", nextNodeId: "sweet_ending" },
        { id: "c10c", text: "you should've studied kathan", nextNodeId: "sweet_ending" },
      ],
    },

    // ── SWEET ENDING ─────────────────────────────────────
    sweet_ending: {
      id: "sweet_ending",
      messages: [
        {
          id: "se1",
          sender: "them",
          text: "yeah yeah yeah",
          delay: 400,
          typingDuration: 800,
        },
        {
          id: "se2",
          sender: "them",
          text: "point is i added some stuff and made it better",
          delay: 400,
          typingDuration: 1500,
        },
        {
          id: "se3",
          sender: "them",
          text: "my GPA died for this so you better scroll through the whole thing",
          delay: 400,
          typingDuration: 2000,
        },
        {
          id: "se4",
          sender: "them",
          attachment: { type: "meme", src: MEMES.meme6 },
          delay: 500,
          typingDuration: 500,
        },
        {
          id: "se5",
          sender: "them",
          text: "okay go",
          delay: 800,
          typingDuration: 600,
        },
      ],
      isEnding: true,
    },
  },
};
