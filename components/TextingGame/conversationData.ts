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
        { id: "s1", sender: "them", text: "mudra", delay: 800, typingDuration: 800 },
        { id: "s2", sender: "them", text: "MUDRA", delay: 400, typingDuration: 600 },
        { id: "s3", sender: "them", text: "i need to tell you something extremely serious", delay: 600, typingDuration: 1500 },
        { id: "s4", sender: "them", text: "like life or death serious", delay: 500, typingDuration: 1000 },
      ],
      choices: [
        { id: "c1a", text: "omg what happened??", nextNodeId: "serious_reveal" },
        { id: "c1b", text: "kathan what did you do now", nextNodeId: "serious_reveal" },
        { id: "c1c", text: "...should i be worried", nextNodeId: "serious_reveal_scared" },
      ],
    },

    // ── THE SERIOUS REVEAL ───────────────────────────────
    serious_reveal: {
      id: "serious_reveal",
      messages: [
        { id: "sr1", sender: "them", text: "okay so", delay: 800, typingDuration: 600 },
        { id: "sr2", sender: "them", text: "i just realized", delay: 500, typingDuration: 800 },
        { id: "sr3", sender: "them", text: "you have never officially admitted that i'm the funniest person you know", delay: 400, typingDuration: 2000 },
        { id: "sr4", sender: "them", text: "this is a CRIME mudra", delay: 300, typingDuration: 1200 },
        { id: "sr5", sender: "them", attachment: { type: "meme", src: MEMES.meme1 }, delay: 400, typingDuration: 600 },
      ],
      choices: [
        { id: "c2a", text: "you're literally not though", nextNodeId: "sr_resp_not" },
        { id: "c2b", text: "i plead the fifth", nextNodeId: "sr_resp_fifth" },
      ],
    },

    sr_resp_not: {
      id: "sr_resp_not",
      messages: [
        { id: "srn1", sender: "them", text: "wow", delay: 300, typingDuration: 400 },
        { id: "srn2", sender: "them", text: "the DISRESPECT", delay: 400, typingDuration: 800 },
        { id: "srn3", sender: "them", text: "i will remember this mudra", delay: 300, typingDuration: 1200 },
      ],
      choices: [
        { id: "srna", text: "good", nextNodeId: "quiz_intro" },
        { id: "srnb", text: "you'll forget in 5 minutes", nextNodeId: "quiz_intro" },
      ],
    },

    sr_resp_fifth: {
      id: "sr_resp_fifth",
      messages: [
        { id: "srf1", sender: "them", text: "PLEADING THE FIFTH???", delay: 300, typingDuration: 800 },
        { id: "srf2", sender: "them", text: "this isn't a courtroom mudra this is a VIBE CHECK", delay: 400, typingDuration: 1600 },
        { id: "srf3", sender: "them", text: "your silence has been noted as guilt", delay: 300, typingDuration: 1400 },
      ],
      choices: [
        { id: "srfa", text: "objection", nextNodeId: "quiz_intro" },
        { id: "srfb", text: "sustained", nextNodeId: "quiz_intro" },
      ],
    },

    // ── SCARED PATH ──────────────────────────────────────
    serious_reveal_scared: {
      id: "serious_reveal_scared",
      messages: [
        { id: "srs1", sender: "them", text: "yes you should be VERY worried", delay: 500, typingDuration: 1200 },
        { id: "srs2", sender: "them", text: "because you have been committing a federal offense", delay: 500, typingDuration: 1500 },
        { id: "srs3", sender: "them", text: "not appreciating kathan enough is literally illegal in 47 countries", delay: 400, typingDuration: 2000 },
        { id: "srs4", sender: "them", attachment: { type: "meme", src: MEMES.meme2 }, delay: 400, typingDuration: 600 },
      ],
      choices: [
        { id: "c2c", text: "47 countries?? name ONE", nextNodeId: "srs_resp_name" },
        { id: "c2d", text: "you need therapy", nextNodeId: "srs_resp_therapy" },
      ],
    },

    srs_resp_name: {
      id: "srs_resp_name",
      messages: [
        { id: "srsn1", sender: "them", text: "uh", delay: 300, typingDuration: 400 },
        { id: "srsn2", sender: "them", text: "...kathania", delay: 800, typingDuration: 1000 },
        { id: "srsn3", sender: "them", text: "it's a real place look it up", delay: 300, typingDuration: 1200 },
      ],
      choices: [
        { id: "srsna", text: "i'm not looking that up", nextNodeId: "quiz_intro" },
        { id: "srsnb", text: "that's definitely not a country", nextNodeId: "quiz_intro" },
      ],
    },

    srs_resp_therapy: {
      id: "srs_resp_therapy",
      messages: [
        { id: "srst1", sender: "them", text: "therapy??? i AM the therapy", delay: 300, typingDuration: 1200 },
        { id: "srst2", sender: "them", text: "being around me is a healing experience", delay: 400, typingDuration: 1500 },
        { id: "srst3", sender: "them", text: "you're welcome btw", delay: 300, typingDuration: 800 },
      ],
      choices: [
        { id: "srsta", text: "i feel worse actually", nextNodeId: "quiz_intro" },
        { id: "srstb", text: "the delusion is astronomical", nextNodeId: "quiz_intro" },
      ],
    },

    // ── POP QUIZ INTRO ───────────────────────────────────
    quiz_intro: {
      id: "quiz_intro",
      messages: [
        { id: "qi1", sender: "them", text: "anyway", delay: 600, typingDuration: 500 },
        { id: "qi2", sender: "them", text: "before i tell you what i did", delay: 400, typingDuration: 1200 },
        { id: "qi3", sender: "them", text: "you have to pass a quick vibe check", delay: 400, typingDuration: 1200 },
        { id: "qi4", sender: "them", text: "question 1:", delay: 600, typingDuration: 600 },
        { id: "qi5", sender: "them", text: "what is kathan's best quality?", delay: 300, typingDuration: 1400 },
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
        { id: "qra1", sender: "them", text: "CORRECT", delay: 400, typingDuration: 500 },
        { id: "qra2", sender: "them", text: "see that wasn't so hard was it", delay: 300, typingDuration: 1200 },
      ],
      choices: [
        { id: "c4a", text: "i was being sarcastic", nextNodeId: "qra_resp_sarcastic" },
        { id: "c4b", text: "what do i win", nextNodeId: "qra_resp_win" },
      ],
    },

    qra_resp_sarcastic: {
      id: "qra_resp_sarcastic",
      messages: [
        { id: "qras1", sender: "them", text: "too late it's been recorded", delay: 300, typingDuration: 1000 },
        { id: "qras2", sender: "them", text: "no takebacks in the vibe check", delay: 300, typingDuration: 1200 },
      ],
      choices: [
        { id: "qrasa", text: "this is tyranny", nextNodeId: "wyr_round" },
        { id: "qrasb", text: "i want a lawyer", nextNodeId: "wyr_round" },
      ],
    },

    qra_resp_win: {
      id: "qra_resp_win",
      messages: [
        { id: "qraw1", sender: "them", text: "you win the privilege of continuing this conversation", delay: 300, typingDuration: 1800 },
        { id: "qraw2", sender: "them", text: "you're welcome", delay: 400, typingDuration: 700 },
      ],
      choices: [
        { id: "qrawa", text: "i want a different prize", nextNodeId: "wyr_round" },
        { id: "qrawb", text: "wow what a prize", nextNodeId: "wyr_round" },
      ],
    },

    quiz_response_b: {
      id: "quiz_response_b",
      messages: [
        { id: "qrb1", sender: "them", text: "WAIT", delay: 300, typingDuration: 400 },
        { id: "qrb2", sender: "them", text: "you think i'm attractive??", delay: 400, typingDuration: 1200 },
        { id: "qrb3", sender: "them", text: "screenshotting this btw", delay: 300, typingDuration: 1000 },
        { id: "qrb4", sender: "them", attachment: { type: "meme", src: MEMES.meme3 }, delay: 400, typingDuration: 500 },
      ],
      choices: [
        { id: "c4c", text: "i take it back", nextNodeId: "qrb_resp_takeback" },
        { id: "c4d", text: "DELETE THAT SCREENSHOT", nextNodeId: "qrb_resp_delete" },
      ],
    },

    qrb_resp_takeback: {
      id: "qrb_resp_takeback",
      messages: [
        { id: "qrbt1", sender: "them", text: "NOPE", delay: 200, typingDuration: 400 },
        { id: "qrbt2", sender: "them", text: "it's in the archives now", delay: 300, typingDuration: 1000 },
        { id: "qrbt3", sender: "them", text: "mudra thinks kathan is attractive - February 2026", delay: 300, typingDuration: 1800 },
      ],
      choices: [
        { id: "qrbta", text: "i'm going to scream", nextNodeId: "wyr_round" },
        { id: "qrbtb", text: "you're making things up", nextNodeId: "wyr_round" },
      ],
    },

    qrb_resp_delete: {
      id: "qrb_resp_delete",
      messages: [
        { id: "qrbd1", sender: "them", text: "deleting...", delay: 300, typingDuration: 800 },
        { id: "qrbd2", sender: "them", text: "...", delay: 600, typingDuration: 1000 },
        { id: "qrbd3", sender: "them", text: "jk i made 4 copies already", delay: 400, typingDuration: 1400 },
      ],
      choices: [
        { id: "qrbda", text: "YOU ARE THE WORST", nextNodeId: "wyr_round" },
        { id: "qrbdb", text: "i'm telling everyone about this", nextNodeId: "wyr_round" },
      ],
    },

    quiz_response_c: {
      id: "quiz_response_c",
      messages: [
        { id: "qrc1", sender: "them", text: "that IS one of my best qualities actually", delay: 400, typingDuration: 1500 },
        { id: "qrc2", sender: "them", text: "also correct answer", delay: 300, typingDuration: 900 },
        { id: "qrc3", sender: "them", text: "all answers were correct btw they all lead back to me being great", delay: 300, typingDuration: 2000 },
      ],
      choices: [
        { id: "c4e", text: "of course they were", nextNodeId: "qrc_resp_ofcourse" },
        { id: "c4f", text: "i want a refund on this conversation", nextNodeId: "qrc_resp_refund" },
      ],
    },

    qrc_resp_ofcourse: {
      id: "qrc_resp_ofcourse",
      messages: [
        { id: "qrco1", sender: "them", text: "she's learning", delay: 300, typingDuration: 800 },
        { id: "qrco2", sender: "them", text: "there may be hope for you yet mudra", delay: 400, typingDuration: 1400 },
      ],
      choices: [
        { id: "qrcoa", text: "don't push it", nextNodeId: "wyr_round" },
        { id: "qrcob", text: "yeah yeah next question", nextNodeId: "wyr_round" },
      ],
    },

    qrc_resp_refund: {
      id: "qrc_resp_refund",
      messages: [
        { id: "qrcr1", sender: "them", text: "refund policy:", delay: 300, typingDuration: 700 },
        { id: "qrcr2", sender: "them", text: "no", delay: 600, typingDuration: 300 },
        { id: "qrcr3", sender: "them", text: "terms and conditions: kathan is always right", delay: 300, typingDuration: 1600 },
      ],
      choices: [
        { id: "qrcra", text: "i didn't agree to any terms", nextNodeId: "wyr_round" },
        { id: "qrcrb", text: "i'm calling consumer protection", nextNodeId: "wyr_round" },
      ],
    },

    // ── WOULD YOU RATHER (RIGGED) ────────────────────────
    wyr_round: {
      id: "wyr_round",
      messages: [
        { id: "wyr1", sender: "them", text: "okay question 2", delay: 500, typingDuration: 800 },
        { id: "wyr2", sender: "them", text: "would you rather:", delay: 400, typingDuration: 700 },
      ],
      choices: [
        { id: "c5a", text: "give kathan the last chocolate strawberry", nextNodeId: "wyr_resp_strawberry" },
        { id: "c5b", text: "be personally responsible for the extinction of puppies", nextNodeId: "wyr_resp_puppies" },
        { id: "c5c", text: "live without wifi forever", nextNodeId: "wyr_resp_wifi" },
      ],
    },

    wyr_resp_strawberry: {
      id: "wyr_resp_strawberry",
      messages: [
        { id: "wyrs1", sender: "them", text: "CORRECT ANSWER", delay: 300, typingDuration: 600 },
        { id: "wyrs2", sender: "them", text: "see that's all i ever wanted", delay: 400, typingDuration: 1200 },
        { id: "wyrs3", sender: "them", text: "just one chocolate strawberry and your undying loyalty", delay: 300, typingDuration: 1800 },
      ],
      choices: [
        { id: "c5sa", text: "you're unhinged", nextNodeId: "wyr_s_resp_unhinged" },
        { id: "c5sb", text: "that escalated", nextNodeId: "wyr_s_resp_escalated" },
      ],
    },

    wyr_s_resp_unhinged: {
      id: "wyr_s_resp_unhinged",
      messages: [
        { id: "wsru1", sender: "them", text: "unhinged is just another word for passionate", delay: 300, typingDuration: 1400 },
        { id: "wsru2", sender: "them", text: "and passionate is just another word for kathan", delay: 300, typingDuration: 1500 },
      ],
      choices: [
        { id: "wsrua", text: "it really is not", nextNodeId: "wyr_converge" },
        { id: "wsrub", text: "you need a dictionary", nextNodeId: "wyr_converge" },
      ],
    },

    wyr_s_resp_escalated: {
      id: "wyr_s_resp_escalated",
      messages: [
        { id: "wsre1", sender: "them", text: "i don't escalate i ELEVATE", delay: 300, typingDuration: 1200 },
        { id: "wsre2", sender: "them", text: "there's a difference", delay: 400, typingDuration: 800 },
        { id: "wsre3", sender: "them", text: "the difference is that i'm always right", delay: 300, typingDuration: 1400 },
      ],
      choices: [
        { id: "wsrea", text: "the math is not mathing", nextNodeId: "wyr_converge" },
        { id: "wsreb", text: "the logic left the chat", nextNodeId: "wyr_converge" },
      ],
    },

    wyr_resp_puppies: {
      id: "wyr_resp_puppies",
      messages: [
        { id: "wyrp1", sender: "them", text: "MUDRA.", delay: 300, typingDuration: 500 },
        { id: "wyrp2", sender: "them", text: "the PUPPIES???", delay: 400, typingDuration: 800 },
        { id: "wyrp3", sender: "them", text: "over a CHOCOLATE STRAWBERRY???", delay: 300, typingDuration: 1200 },
        { id: "wyrp4", sender: "them", text: "i'm genuinely concerned about your moral compass", delay: 400, typingDuration: 1800 },
      ],
      choices: [
        { id: "c5pa", text: "you made the options!!", nextNodeId: "wyr_p_resp_options" },
        { id: "c5pb", text: "it was a trick question and you know it", nextNodeId: "wyr_p_resp_trick" },
      ],
    },

    wyr_p_resp_options: {
      id: "wyr_p_resp_options",
      messages: [
        { id: "wpro1", sender: "them", text: "yeah and there was a CLEARLY correct one", delay: 300, typingDuration: 1400 },
        { id: "wpro2", sender: "them", text: "hint: it involved giving me food", delay: 300, typingDuration: 1200 },
      ],
      choices: [
        { id: "wproa", text: "noted for next time", nextNodeId: "wyr_converge" },
        { id: "wprob", text: "the strawberry was never an option", nextNodeId: "wyr_converge" },
      ],
    },

    wyr_p_resp_trick: {
      id: "wyr_p_resp_trick",
      messages: [
        { id: "wprt1", sender: "them", text: "trick question??? it was OBVIOUS", delay: 300, typingDuration: 1200 },
        { id: "wprt2", sender: "them", text: "step 1: see chocolate strawberry", delay: 300, typingDuration: 1200 },
        { id: "wprt3", sender: "them", text: "step 2: give it to kathan", delay: 300, typingDuration: 1000 },
        { id: "wprt4", sender: "them", text: "there is no step 3", delay: 400, typingDuration: 800 },
      ],
      choices: [
        { id: "wprta", text: "this is insane", nextNodeId: "wyr_converge" },
        { id: "wprtb", text: "i want a recount", nextNodeId: "wyr_converge" },
      ],
    },

    wyr_resp_wifi: {
      id: "wyr_resp_wifi",
      messages: [
        { id: "wyrw1", sender: "them", text: "wifi??? WIFI????", delay: 300, typingDuration: 800 },
        { id: "wyrw2", sender: "them", text: "you would give up the entire internet", delay: 400, typingDuration: 1400 },
        { id: "wyrw3", sender: "them", text: "before giving me a single chocolate strawberry", delay: 300, typingDuration: 1600 },
        { id: "wyrw4", sender: "them", text: "noted. saved. screenshotted. backed up to the cloud.", delay: 400, typingDuration: 2000 },
      ],
      choices: [
        { id: "c5wa", text: "you can't screenshot a conversation you wrote", nextNodeId: "wyr_w_resp_screenshot" },
        { id: "c5wb", text: "i would have no cloud without wifi", nextNodeId: "wyr_w_resp_cloud" },
      ],
    },

    wyr_w_resp_screenshot: {
      id: "wyr_w_resp_screenshot",
      messages: [
        { id: "wwrs1", sender: "them", text: "watch me", delay: 300, typingDuration: 500 },
        { id: "wwrs2", sender: "them", text: "i'll screenshot my own messages AND your replies", delay: 300, typingDuration: 1600 },
        { id: "wwrs3", sender: "them", text: "evidence is evidence", delay: 400, typingDuration: 900 },
      ],
      choices: [
        { id: "wwrsa", text: "that's not how evidence works", nextNodeId: "wyr_converge" },
        { id: "wwrsb", text: "you're delusional", nextNodeId: "wyr_converge" },
      ],
    },

    wyr_w_resp_cloud: {
      id: "wyr_w_resp_cloud",
      messages: [
        { id: "wwrc1", sender: "them", text: "...", delay: 400, typingDuration: 800 },
        { id: "wwrc2", sender: "them", text: "okay that was actually kinda smart", delay: 300, typingDuration: 1200 },
        { id: "wwrc3", sender: "them", text: "BUT STILL", delay: 400, typingDuration: 600 },
      ],
      choices: [
        { id: "wwrca", text: "i win this round", nextNodeId: "wyr_converge" },
        { id: "wwrcb", text: "checkmate", nextNodeId: "wyr_converge" },
      ],
    },

    // ── WYR CONVERGENCE → QUESTION 3 ────────────────────
    wyr_converge: {
      id: "wyr_converge",
      messages: [
        { id: "wyrc1", sender: "them", text: "question 3 and this one's important", delay: 500, typingDuration: 1400 },
        { id: "wyrc2", sender: "them", text: "would you rather lose to kathan in a snowfight", delay: 400, typingDuration: 1500 },
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
        { id: "rr1", sender: "them", text: "wow brave choice", delay: 400, typingDuration: 800 },
        { id: "rr2", sender: "them", text: "really went out on a limb there", delay: 300, typingDuration: 1200 },
        { id: "rr3", sender: "them", attachment: { type: "meme", src: MEMES.meme4 }, delay: 400, typingDuration: 500 },
      ],
      choices: [
        { id: "c7a", text: "the options were all the same??", nextNodeId: "rigged_resp_same" },
        { id: "c7b", text: "this game is rigged", nextNodeId: "rigged_resp_rigged" },
      ],
    },

    rigged_resp_same: {
      id: "rigged_resp_same",
      messages: [
        { id: "rrs1", sender: "them", text: "what?? no they weren't", delay: 300, typingDuration: 1000 },
        { id: "rrs2", sender: "them", text: "one was in lowercase and the other two were also in lowercase", delay: 300, typingDuration: 2000 },
        { id: "rrs3", sender: "them", text: "totally different vibes", delay: 400, typingDuration: 1000 },
      ],
      choices: [
        { id: "rrsa", text: "i hate you", nextNodeId: "system_override" },
        { id: "rrsb", text: "i'm filing a complaint", nextNodeId: "system_override" },
      ],
    },

    rigged_resp_rigged: {
      id: "rigged_resp_rigged",
      messages: [
        { id: "rrr1", sender: "them", text: "rigged is a strong word", delay: 300, typingDuration: 1000 },
        { id: "rrr2", sender: "them", text: "i prefer \"strategically designed for the correct outcome\"", delay: 300, typingDuration: 2000 },
      ],
      choices: [
        { id: "rrra", text: "that's literally what rigged means", nextNodeId: "system_override" },
        { id: "rrrb", text: "i'm done with this quiz", nextNodeId: "system_override" },
      ],
    },

    // ── FAKE SYSTEM OVERRIDE ─────────────────────────────
    system_override: {
      id: "system_override",
      messages: [
        { id: "so1", sender: "them", text: "hold on let me check", delay: 500, typingDuration: 1000 },
        { id: "so2", sender: "them", text: "...", delay: 800, typingDuration: 1500 },
        { id: "so3", sender: "them", text: "[SYSTEM MESSAGE: your complaint has been reviewed and denied. kathan is always right. this is not up for debate.]", delay: 400, typingDuration: 2500 },
        { id: "so4", sender: "them", text: "see? even the system agrees", delay: 600, typingDuration: 1000 },
      ],
      choices: [
        { id: "c8a", text: "you literally typed that yourself", nextNodeId: "so_resp_typed" },
        { id: "c8b", text: "i'm calling the police", nextNodeId: "so_resp_police" },
      ],
    },

    so_resp_typed: {
      id: "so_resp_typed",
      messages: [
        { id: "sort1", sender: "them", text: "prove it", delay: 300, typingDuration: 600 },
        { id: "sort2", sender: "them", text: "oh wait you can't because the system said so", delay: 300, typingDuration: 1600 },
        { id: "sort3", sender: "them", text: "checkmate mudra", delay: 400, typingDuration: 800 },
      ],
      choices: [
        { id: "sorta", text: "that logic has more holes than swiss cheese", nextNodeId: "ultimatum" },
        { id: "sortb", text: "i give up arguing with you", nextNodeId: "ultimatum" },
      ],
    },

    so_resp_police: {
      id: "so_resp_police",
      messages: [
        { id: "sorp1", sender: "them", text: "go ahead call them", delay: 300, typingDuration: 800 },
        { id: "sorp2", sender: "them", text: "\"hello 911? yes this boy made me a website and it's too cute\"", delay: 300, typingDuration: 2200 },
        { id: "sorp3", sender: "them", text: "they'll arrest YOU for not appreciating it enough", delay: 400, typingDuration: 1800 },
      ],
      choices: [
        { id: "sorpa", text: "the CONFIDENCE", nextNodeId: "ultimatum" },
        { id: "sorpb", text: "you're insufferable", nextNodeId: "ultimatum" },
      ],
    },

    // ── THE ULTIMATUM ────────────────────────────────────
    ultimatum: {
      id: "ultimatum",
      messages: [
        { id: "u1", sender: "them", text: "ANYWAY", delay: 500, typingDuration: 500 },
        { id: "u2", sender: "them", text: "you passed the vibe check", delay: 400, typingDuration: 1200 },
        { id: "u3", sender: "them", text: "barely", delay: 600, typingDuration: 500 },
        { id: "u4", sender: "them", text: "so i was studying right", delay: 500, typingDuration: 1200 },
        { id: "u5", sender: "them", text: "and then i thought", delay: 400, typingDuration: 900 },
        { id: "u6", sender: "them", text: "\"hmm what if i simply did NOT do that\"", delay: 300, typingDuration: 1600 },
        { id: "u7", sender: "them", text: "and made you something instead", delay: 400, typingDuration: 1200 },
      ],
      choices: [
        { id: "c9a", text: "you made me something??", nextNodeId: "ult_resp_excited" },
        { id: "c9b", text: "kathan. your exams.", nextNodeId: "ult_resp_exams" },
      ],
    },

    ult_resp_excited: {
      id: "ult_resp_excited",
      messages: [
        { id: "ure1", sender: "them", text: "don't get too excited", delay: 300, typingDuration: 1000 },
        { id: "ure2", sender: "them", text: "it's probably cringe", delay: 400, typingDuration: 800 },
        { id: "ure3", sender: "them", text: "actually it's definitely cringe", delay: 300, typingDuration: 1200 },
        { id: "ure4", sender: "them", text: "but like... the good kind of cringe?", delay: 400, typingDuration: 1400 },
      ],
      choices: [
        { id: "urea", text: "just show me already", nextNodeId: "the_reveal" },
        { id: "ureb", text: "nothing you do is the good kind", nextNodeId: "the_reveal" },
      ],
    },

    ult_resp_exams: {
      id: "ult_resp_exams",
      messages: [
        { id: "urx1", sender: "them", text: "mudra", delay: 200, typingDuration: 500 },
        { id: "urx2", sender: "them", text: "listen", delay: 400, typingDuration: 500 },
        { id: "urx3", sender: "them", text: "exams are temporary", delay: 300, typingDuration: 1000 },
        { id: "urx4", sender: "them", text: "being extra is forever", delay: 300, typingDuration: 1200 },
        { id: "urx5", sender: "them", text: "i have my priorities straight", delay: 400, typingDuration: 1400 },
      ],
      choices: [
        { id: "urxa", text: "your priorities are BROKEN", nextNodeId: "the_reveal" },
        { id: "urxb", text: "...just show me", nextNodeId: "the_reveal" },
      ],
    },

    // ── THE REVEAL ───────────────────────────────────────
    the_reveal: {
      id: "the_reveal",
      messages: [
        { id: "tr1", sender: "them", text: "you already know what it is hehe :\"", delay: 500, typingDuration: 1400 },
      ],
      isEnding: true,
    },
  },
};
