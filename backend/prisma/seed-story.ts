import { PrismaClient } from '@prisma/client';
import { createPrismaClient } from './seed-client';
const prisma = createPrismaClient();

const story = [
  {
    type: 'intro',
    title: 'Touchdown in Beijing',
    narrative: "Lily Chen steps off the plane at Beijing Daxing Airport. The terminal is enormous — glass, steel, and signs everywhere. Signs she cannot read. She clutches her backpack tighter. Her grandma's old travel journal is inside. 'Day 1,' she whispers to herself. 'I'm really here.'",
    speaker: 'narrator',
    mood: 'nervous',
    dialogue: "Lily: 'I can't read a single sign. What did I get myself into?'",
  },
  {
    type: 'learn',
    title: 'Your First Words',
    narrative: 'Lily walks through the terminal, overwhelmed. A young woman notices her confused expression and approaches with a warm smile.',
    speaker: 'narrator',
    mood: 'helpful',
    dialogue: "Stranger: 你好！(Hello!)\nLily freezes. She knows this one! Her grandma used to say it. She takes a breath...",
    words: [
      { character: '你好', pinyin: 'nǐ hǎo', english: 'Hello', context: 'The most important greeting. Say it to anyone, anytime.' },
      { character: '谢谢', pinyin: 'xiè xie', english: 'Thank you', context: 'Lily wants to thank the stranger for helping her.' },
      { character: '再见', pinyin: 'zài jiàn', english: 'Goodbye', context: 'How Lily will say goodbye when she leaves the airport.' },
      { character: '是', pinyin: 'shì', english: 'To be (is/am/are)', context: "Lily thinks: 'This IS Beijing. I AM here.'" },
      { character: '我叫', pinyin: 'wǒ jiào', english: 'My name is...', context: 'How Lily will introduce herself. Point to yourself and say it!' },
    ],
  },
  {
    type: 'quiz',
    title: 'A Friendly Face',
    narrative: 'The stranger smiles and points to herself.',
    dialogue: "Stranger: 我叫王芳。你叫什么名字？ (I'm Wang Fang. What's your name?)",
    question: "Wang Fang just introduced herself and asked Lily's name. What should Lily say?",
    options: ['再见 (Goodbye)', '你好，我叫Lily (Hello, I am Lily)', '谢谢 (Thank you)', '是 (Yes)'],
    answer: '你好，我叫Lily',
    feedback: "Lily takes a breath. '你好，我叫Lily!' she says. Wang Fang beams. 'Lily! 很好听的名字！' (What a beautiful name!) Lily's first self-introduction — and it worked! The words feel clumsy in her mouth, but Wang Fang understands perfectly. Lily feels a tiny spark of confidence.",
  },
  {
    type: 'scene',
    title: 'The Address',
    narrative: "Wang Fang walks Lily to the subway station. Lily pulls out a crumpled piece of paper — her grandma's old hutong address. She shows it to Wang Fang, who nods enthusiastically.",
    speaker: 'narrator',
    mood: 'hopeful',
    dialogue: "Wang Fang: 哦！胡同！很漂亮！(Oh! Hutong! Very beautiful!)\nLily: (thinking) 'I need to remember the house number... what are the Chinese numbers?'",
  },
  {
    type: 'learn',
    title: 'Numbers 1-10',
    narrative: 'Lily counts on her fingers, remembering the numbers her grandma taught her when she was little. She needs them for the address.',
    speaker: 'lily',
    mood: 'focused',
    dialogue: "Lily: 'My grandma's house is number 8. What is 8 in Chinese?'",
    words: [
      { character: '一', pinyin: 'yī', english: 'One', context: 'One suitcase. Lily packed light.' },
      { character: '二', pinyin: 'èr', english: 'Two', context: 'Two hands to carry her dreams.' },
      { character: '三', pinyin: 'sān', english: 'Three', context: 'Three flights to get here: SF to Tokyo to Beijing.' },
      { character: '八', pinyin: 'bā', english: 'Eight', context: "Grandma's house number. The luckiest number!" },
    ],
  },
  {
    type: 'quiz',
    title: 'Finding Home',
    narrative: "Lily stands in front of a traditional courtyard gate. This is it — her grandma's hutong. An elderly neighbor peers at her curiously.",
    dialogue: "Neighbor: 你是...？(You are...?)",
    question: "Lily wants to say: 'Hello, my name is Lily.' What should she say?",
    options: ['谢谢，再见！', '你好，我叫Lily！', '八，是八！', '我叫王芳。'],
    answer: '你好，我叫Lily！',
    feedback: "The neighbor's face breaks into a huge grin. '小莉！你奶奶的孙女！' (Xiao Li! Your grandmother's granddaughter!) She remembers Lily's grandma. Lily feels tears prick her eyes.",
  },
  {
    type: 'scene',
    title: 'Tea with a Stranger',
    narrative: "The neighbor — Auntie Zhang — insists Lily come in for tea. Lily's tired, hungry, and overwhelmed, but Auntie Zhang's warmth feels familiar. She motions Lily to sit.",
    speaker: 'narrator',
    mood: 'warm',
    dialogue: "Auntie Zhang: 请坐！请喝茶！(Please sit! Please drink tea!)\nLily: (thinking) 'I know 请 means please... I think she's offering me something?'",
  },
  {
    type: 'learn',
    title: 'Being Polite',
    narrative: 'Lily remembers: Chinese culture values politeness deeply. Auntie Zhang is being incredibly generous. Lily wants to be respectful.',
    speaker: 'lily',
    mood: 'grateful',
    dialogue: "Lily: 'I need to know how to say please, thank you, and sorry. Grandma would want me to be polite.'",
    words: [
      { character: '请', pinyin: 'qǐng', english: 'Please', context: "Auntie Zhang says '请坐' (please sit). It shows care and respect." },
      { character: '对不起', pinyin: 'duì bu qǐ', english: 'Sorry', context: "Lily accidentally knocks over her teacup. She needs this word!" },
      { character: '不客气', pinyin: 'bú kè qì', english: "You're welcome", context: 'What Auntie Zhang will say when Lily thanks her.' },
      { character: '好', pinyin: 'hǎo', english: 'Good', context: "The tea is 很好 (very good). Lily's first adjective!" },
    ],
  },
  {
    type: 'quiz',
    title: 'An Accident',
    narrative: 'Lily reaches for a photo on the table and accidentally knocks over her teacup. Tea spills across the table. She feels her face burn with embarrassment.',
    dialogue: "Auntie Zhang: (laughing gently) 没关系，没关系！(It doesn't matter!)",
    question: 'What should Lily say after spilling the tea?',
    options: ['你好！', '对不起！', '再见！', '谢谢！'],
    answer: '对不起！',
    feedback: "Auntie Zhang pats Lily's hand. '没关系！' she says warmly. Lily learns that mistakes are okay here. No one expects her to be perfect. She's trying — and that's what matters.",
  },
  {
    type: 'end',
    title: 'Day 1 — Complete',
    narrative: "That evening, Lily sits on the kang bed in her grandma's old room. The courtyard is quiet. She opens the travel journal to a fresh page and writes:",
    speaker: 'lily',
    mood: 'reflective',
    dialogue: "Day 1. I said my first Chinese words today. 你好. 谢谢. 对不起. Eight words total. A stranger helped me. A neighbor remembered Grandma. I spilled tea and survived. Grandma, I think you'd be proud. Tomorrow I explore Beijing. I'll need more words.\n\nShe closes the journal. Outside, Beijing hums softly. She's really here.",
  },
];

async function main() {
  await prisma.province.updateMany({
    where: { name: 'Beijing' },
    data: { storyContent: JSON.stringify(story) },
  });
  console.log('✅ Beijing story seeded — 10 scenes!');
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
