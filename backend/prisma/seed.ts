import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.userWordProgress.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.grammarPoint.deleteMany();
  await prisma.vocabularyWord.deleteMany();
  await prisma.province.deleteMany();

  // ============================================================
  // STOP 1: BEIJING (北京) - The Capital
  // ============================================================
  const beijing = await prisma.province.create({
    data: {
      name: 'Beijing',
      capital: '北京 (Běijīng)',
      culturalDescription:
        'Welcome to Beijing, the heart of China! As the capital for over 800 years, Beijing blends imperial grandeur with modern energy. The city is laid out in concentric rings radiating from the Forbidden City — once home to 24 emperors and off-limits to commoners for 500 years. Today, hutongs (narrow alleys) wind through the old city where neighbors still greet each other with "吃了吗?" (Have you eaten?).',
      landmark: 'The Great Wall (长城 Chángchéng)',
      landmarkFact:
        'The Great Wall stretches over 21,000 km — long enough to wrap halfway around the Earth. The most famous section, Badaling, is just a 1-hour drive from Beijing. Soldiers used smoke signals by day and fire beacons by night to warn of invasions.',
      food: 'Peking Duck (北京烤鸭 Běijīng kǎoyā)',
      foodDescription:
        'Crispy, glossy skin with tender meat, sliced tableside and wrapped in thin pancakes with hoisin sauce, cucumber, and scallions. A dish once reserved for the imperial court.',
      custom:
        'When greeting someone, a slight nod or handshake is common. Address people by title + surname (Teacher Wang, not just Wang). Accept business cards with both hands.',
      mapCoordinates: JSON.stringify({ x: 650, y: 200 }),
      unlockOrder: 1,
      color: '#dc2626',
    },
  });

  // Beijing vocabulary (greetings, introductions, numbers)
  const bjVocab = [
    { character: '你好', pinyin: 'nǐ hǎo', english: 'Hello', category: 'Greetings', travelSentence: '你好！欢迎来北京！(Hello! Welcome to Beijing!)' },
    { character: '我', pinyin: 'wǒ', english: 'I, me', category: 'Pronouns', travelSentence: '我是游客，第一次来北京。(I am a tourist, visiting Beijing for the first time.)' },
    { character: '你', pinyin: 'nǐ', english: 'You', category: 'Pronouns', travelSentence: '你是北京人吗？(Are you from Beijing?)' },
    { character: '他', pinyin: 'tā', english: 'He', category: 'Pronouns', travelSentence: '他是我的导游。(He is my tour guide.)' },
    { character: '她', pinyin: 'tā', english: 'She', category: 'Pronouns', travelSentence: '她很喜欢故宫。(She really likes the Forbidden City.)' },
    { character: '是', pinyin: 'shì', english: 'To be', category: 'Verbs', travelSentence: '北京是中国的首都。(Beijing is the capital of China.)' },
    { character: '中国', pinyin: 'Zhōngguó', english: 'China', category: 'Places', travelSentence: '中国很大，北京在北方。(China is big, Beijing is in the north.)' },
    { character: '人', pinyin: 'rén', english: 'Person', category: 'People', travelSentence: '北京有两千多万人。(Beijing has over 20 million people.)' },
    { character: '名字', pinyin: 'míngzi', english: 'Name', category: 'Greetings', travelSentence: '我的中文名字很美。(My Chinese name is beautiful.)' },
    { character: '什么', pinyin: 'shénme', english: 'What', category: 'Question Words', travelSentence: '这是什么地方？(What place is this?)' },
    { character: '叫', pinyin: 'jiào', english: 'To be called', category: 'Verbs', travelSentence: '这个叫天安门广场。(This is called Tiananmen Square.)' },
    { character: '好', pinyin: 'hǎo', english: 'Good', category: 'Adjectives', travelSentence: '北京烤鸭很好吃！(Peking duck is very delicious!)' },
    { character: '不', pinyin: 'bù', english: 'Not', category: 'Adverbs', travelSentence: '我不是第一次来长城。(This is not my first time at the Great Wall.)' },
    { character: '很', pinyin: 'hěn', english: 'Very', category: 'Adverbs', travelSentence: '故宫很大。(The Forbidden City is very big.)' },
    { character: '的', pinyin: 'de', english: 'Possessive particle', category: 'Particles', travelSentence: '这是北京的胡同。(This is Beijing\'s hutong.)' },
    { character: '谢谢', pinyin: 'xièxie', english: 'Thank you', category: 'Greetings', travelSentence: '谢谢你的帮助！(Thank you for your help!)' },
    { character: '再见', pinyin: 'zàijiàn', english: 'Goodbye', category: 'Greetings', travelSentence: '北京，再见！(Goodbye, Beijing!)' },
    { character: '请', pinyin: 'qǐng', english: 'Please', category: 'Greetings', travelSentence: '请给我一张地图。(Please give me a map.)' },
    { character: '一', pinyin: 'yī', english: 'One', category: 'Numbers', travelSentence: '我在北京待一个星期。(I am staying in Beijing for one week.)' },
    { character: '二', pinyin: 'èr', english: 'Two', category: 'Numbers', travelSentence: '我要两张门票。(I want two tickets.)' },
    { character: '三', pinyin: 'sān', english: 'Three', category: 'Numbers', travelSentence: '故宫有三个大殿。(The Forbidden City has three main halls.)' },
    { character: '四', pinyin: 'sì', english: 'Four', category: 'Numbers', travelSentence: '北京有四个季节。(Beijing has four seasons.)' },
    { character: '五', pinyin: 'wǔ', english: 'Five', category: 'Numbers', travelSentence: '五个人一起去长城。(Five people go to the Great Wall together.)' },
    { character: '六', pinyin: 'liù', english: 'Six', category: 'Numbers', travelSentence: null },
    { character: '七', pinyin: 'qī', english: 'Seven', category: 'Numbers', travelSentence: null },
    { character: '八', pinyin: 'bā', english: 'Eight', category: 'Numbers', travelSentence: null },
    { character: '九', pinyin: 'jiǔ', english: 'Nine', category: 'Numbers', travelSentence: null },
    { character: '十', pinyin: 'shí', english: 'Ten', category: 'Numbers', travelSentence: null },
  ];
  for (const w of bjVocab) {
    await prisma.vocabularyWord.create({ data: { ...w, provinceId: beijing.id } });
  }

  await prisma.grammarPoint.createMany({
    data: [
      {
        title: 'Basic Sentence Structure (SVO)',
        explanation: 'Chinese follows Subject-Verb-Object order, just like English. Start here and you can already make thousands of sentences.',
        examples: JSON.stringify([
          { chinese: '我去故宫。', pinyin: 'Wǒ qù Gùgōng.', english: 'I go to the Forbidden City.' },
          { chinese: '她是北京人。', pinyin: 'Tā shì Běijīng rén.', english: 'She is from Beijing.' },
        ]),
        provinceId: beijing.id,
      },
      {
        title: 'Questions with 吗 (ma)',
        explanation: 'Add 吗 at the end of any statement to turn it into a yes/no question. No word order change needed!',
        examples: JSON.stringify([
          { chinese: '你是北京人吗？', pinyin: 'Nǐ shì Běijīng rén ma?', english: 'Are you from Beijing?' },
          { chinese: '长城远吗？', pinyin: 'Chángchéng yuǎn ma?', english: 'Is the Great Wall far?' },
        ]),
        provinceId: beijing.id,
      },
    ],
  });

  await prisma.exercise.createMany({
    data: [
      { type: 'MULTIPLE_CHOICE', question: '"你好" (nǐ hǎo)', questionLabel: 'How do you greet someone in Beijing?', options: JSON.stringify(['Hello', 'Goodbye', 'Thank you', 'Sorry']), correctAnswer: 'Hello', provinceId: beijing.id },
      { type: 'CULTURAL', question: 'What dish is Beijing famous for?', questionLabel: 'Beijing Food Culture', options: JSON.stringify(['Hotpot', 'Peking Duck', 'Dim Sum', 'Xiaolongbao']), correctAnswer: 'Peking Duck', provinceId: beijing.id },
      { type: 'FILL_BLANK', question: '北京___中国的首都。', questionLabel: 'Fill in: Beijing ___ the capital of China.', options: JSON.stringify([]), correctAnswer: '是', provinceId: beijing.id },
    ],
  });

  // ============================================================
  // STOP 2: SHAANXI (陕西) - Ancient Heartland
  // ============================================================
  const shaanxi = await prisma.province.create({
    data: {
      name: 'Shaanxi',
      capital: "西安 (Xī'ān)",
      culturalDescription:
        'Welcome to Xi\'an, the ancient capital of 13 dynasties and the eastern starting point of the Silk Road. This is where Chinese civilization took root — the Terracotta Army guards the tomb of China\'s first emperor, and the city walls (the most complete in China) still encircle the old quarter. The Muslim Quarter buzzes with the smell of cumin-spiced lamb and freshly pulled noodles.',
      landmark: 'Terracotta Warriors (兵马俑 Bīngmǎyǒng)',
      landmarkFact:
        'Over 8,000 life-sized soldiers, each with unique facial features, were buried to protect Emperor Qin Shi Huang in the afterlife. They were discovered in 1974 by farmers digging a well — and excavation is still ongoing.',
      food: 'Biangbiang Noodles (油泼面 yóupōmiàn)',
      foodDescription:
        'Wide, hand-pulled belt noodles drenched in sizzling chili oil, garlic, and vinegar. The character "biáng" is one of the most complex in Chinese with 58 strokes!',
      custom:
        'Xi\'an locals love to ask "你吃了吗?" (Have you eaten?) as a greeting. The correct answer is "吃了" even if you haven\'t — it\'s not an invitation, just a warm hello.',
      mapCoordinates: JSON.stringify({ x: 570, y: 280 }),
      unlockOrder: 2,
      color: '#ea580c',
    },
  });

  const sxVocab = [
    { character: '今天', pinyin: 'jīntiān', english: 'Today', category: 'Time', travelSentence: '今天我们去兵马俑。(Today we go to the Terracotta Warriors.)' },
    { character: '明天', pinyin: 'míngtiān', english: 'Tomorrow', category: 'Time', travelSentence: '明天我想去回民街。(Tomorrow I want to go to the Muslim Quarter.)' },
    { character: '昨天', pinyin: 'zuótiān', english: 'Yesterday', category: 'Time', travelSentence: '昨天我看了城墙。(Yesterday I saw the city wall.)' },
    { character: '现在', pinyin: 'xiànzài', english: 'Now', category: 'Time', travelSentence: '现在几点？我们要赶火车！(What time is it now? We need to catch the train!)' },
    { character: '点', pinyin: 'diǎn', english: "O'clock", category: 'Time', travelSentence: '兵马俑九点开门。(The Terracotta Warriors open at 9 o\'clock.)' },
    { character: '分钟', pinyin: 'fēnzhōng', english: 'Minute', category: 'Time', travelSentence: '再等五分钟。(Wait five more minutes.)' },
    { character: '星期', pinyin: 'xīngqī', english: 'Week', category: 'Time', travelSentence: '下个星期我去西安。(Next week I go to Xi\'an.)' },
    { character: '月', pinyin: 'yuè', english: 'Month', category: 'Time', travelSentence: '三月去西安很好。(Going to Xi\'an in March is great.)' },
    { character: '年', pinyin: 'nián', english: 'Year', category: 'Time', travelSentence: '兵马俑有两千多年的历史。(The Terracotta Warriors have over 2000 years of history.)' },
    { character: '号', pinyin: 'hào', english: 'Day of month', category: 'Time', travelSentence: '我三月十五号到西安。(I arrive in Xi\'an on March 15.)' },
    { character: '时候', pinyin: 'shíhou', english: 'Time, moment', category: 'Time', travelSentence: '你什么时候去西安？(When are you going to Xi\'an?)' },
    { character: '去', pinyin: 'qù', english: 'To go', category: 'Verbs', travelSentence: '我们坐高铁去西安。(We go to Xi\'an by high-speed train.)' },
    { character: '来', pinyin: 'lái', english: 'To come', category: 'Verbs', travelSentence: '你来过兵马俑吗？(Have you come to the Terracotta Warriors before?)' },
    { character: '回', pinyin: 'huí', english: 'To return', category: 'Verbs', travelSentence: '晚上我们回酒店。(We return to the hotel in the evening.)' },
    { character: '大', pinyin: 'dà', english: 'Big', category: 'Adjectives', travelSentence: '兵马俑坑非常大！(The Terracotta Warrior pits are huge!)' },
    { character: '小', pinyin: 'xiǎo', english: 'Small', category: 'Adjectives', travelSentence: '回民街的小吃很好吃。(The snacks in the Muslim Quarter are delicious.)' },
    { character: '多少', pinyin: 'duōshao', english: 'How many/much', category: 'Question Words', travelSentence: '门票多少钱？(How much is the ticket?)' },
    { character: '几', pinyin: 'jǐ', english: 'How many (≤10)', category: 'Question Words', travelSentence: '还有几个小时到西安？(How many more hours until we reach Xi\'an?)' },
    { character: '个', pinyin: 'gè', english: 'General measure word', category: 'Measure Words', travelSentence: '我要买两个肉夹馍。(I want to buy two meat-stuffed buns.)' },
    { character: '了', pinyin: 'le', english: 'Completion particle', category: 'Particles', travelSentence: '我拍了五百张兵马俑的照片！(I took 500 photos of the Terracotta Warriors!)' },
  ];
  for (const w of sxVocab) {
    await prisma.vocabularyWord.create({ data: { ...w, provinceId: shaanxi.id } });
  }

  await prisma.grammarPoint.createMany({
    data: [
      {
        title: 'Telling Time: Time + Verb',
        explanation: 'In Chinese, the time phrase goes BEFORE the verb, not at the end like English.',
        examples: JSON.stringify([
          { chinese: '我们九点去兵马俑。', pinyin: 'Wǒmen jiǔ diǎn qù Bīngmǎyǒng.', english: 'We go to the Terracotta Warriors at 9 o\'clock.' },
          { chinese: '明天早上七点起床。', pinyin: 'Míngtiān zǎoshang qī diǎn qǐchuáng.', english: 'Tomorrow morning I get up at 7 o\'clock.' },
        ]),
        provinceId: shaanxi.id,
      },
      {
        title: 'The 了 (le) Particle - Completed Actions',
        explanation: '了 after a verb marks that an action is completed. Think of it as checking something off your travel list.',
        examples: JSON.stringify([
          { chinese: '我看了兵马俑。', pinyin: 'Wǒ kàn le Bīngmǎyǒng.', english: 'I saw the Terracotta Warriors (✓ done!).' },
          { chinese: '我吃了biangbiang面。', pinyin: 'Wǒ chī le biangbiang miàn.', english: 'I ate biangbiang noodles (✓ done!).' },
        ]),
        provinceId: shaanxi.id,
      },
    ],
  });

  await prisma.exercise.createMany({
    data: [
      { type: 'MULTIPLE_CHOICE', question: '"现在几点？"', questionLabel: 'How do you ask for the time?', options: JSON.stringify(['What time is it now?', 'Where are you?', 'How are you?', 'How much?']), correctAnswer: 'What time is it now?', provinceId: shaanxi.id },
      { type: 'CULTURAL', question: 'How many Terracotta Warriors were buried?', questionLabel: "Xi'an History", options: JSON.stringify(['500', '2,000', '8,000+', '50,000']), correctAnswer: '8,000+', provinceId: shaanxi.id },
    ],
  });

  // ============================================================
  // STOP 3: SICHUAN (四川) - Land of Spice & Pandas
  // ============================================================
  const sichuan = await prisma.province.create({
    data: {
      name: 'Sichuan',
      capital: '成都 (Chéngdū)',
      culturalDescription:
        'Welcome to Chengdu, the land of abundance! Sichuan is famous for two things: pandas and spice. The Sichuan Basin\'s muggy climate gave birth to fiery cuisine — locals say the chili heat drives out the dampness. Life here moves slower than in Beijing or Shanghai; the local motto is "巴适" (bāshì) — comfortable, relaxed. Teahouses line every street, and you can spend an entire afternoon sipping jasmine tea while getting your ears cleaned (a local tradition!).',
      landmark: 'Chengdu Panda Base (大熊猫基地 Dàxióngmāo Jīdì)',
      landmarkFact:
        'Pandas eat 12-38 kg of bamboo daily and spend 10-16 hours eating. Despite having a carnivore\'s digestive system, they evolved to live almost entirely on bamboo.',
      food: 'Hotpot (火锅 huǒguō)',
      foodDescription:
        'A bubbling cauldron of chili oil and Sichuan peppercorns that numbs your tongue (málà 麻辣). You cook raw meats, vegetables, and tofu right at your table. The numbing sensation from Sichuan peppercorns is called "má" — a unique feeling you won\'t find anywhere else.',
      custom:
        'Sichuan opera features "face-changing" (变脸 biànliǎn) where performers instantly switch colorful masks with a sweep of the hand — the technique is a closely guarded secret.',
      mapCoordinates: JSON.stringify({ x: 460, y: 360 }),
      unlockOrder: 3,
      color: '#16a34a',
    },
  });

  const scVocab = [
    { character: '吃', pinyin: 'chī', english: 'To eat', category: 'Verbs', travelSentence: '在成都，我们每天都吃火锅！(In Chengdu, we eat hotpot every day!)' },
    { character: '喝', pinyin: 'hē', english: 'To drink', category: 'Verbs', travelSentence: '在茶馆喝茶很舒服。(Drinking tea in a teahouse is very comfortable.)' },
    { character: '水', pinyin: 'shuǐ', english: 'Water', category: 'Food', travelSentence: '吃完火锅喝很多水。(After eating hotpot, I drink lots of water.)' },
    { character: '茶', pinyin: 'chá', english: 'Tea', category: 'Food', travelSentence: '成都的茶馆很有名。(Chengdu\'s teahouses are very famous.)' },
    { character: '米饭', pinyin: 'mǐfàn', english: 'Cooked rice', category: 'Food', travelSentence: '吃火锅的时候要米饭吗？(Do you want rice when eating hotpot?)' },
    { character: '菜', pinyin: 'cài', english: 'Dish, vegetable', category: 'Food', travelSentence: '这个菜太辣了！(This dish is too spicy!)' },
    { character: '水果', pinyin: 'shuǐguǒ', english: 'Fruit', category: 'Food', travelSentence: '吃完辣的吃水果。(After eating spicy food, eat fruit.)' },
    { character: '苹果', pinyin: 'píngguǒ', english: 'Apple', category: 'Food', travelSentence: null },
    { character: '太', pinyin: 'tài', english: 'Too, extremely', category: 'Adverbs', travelSentence: '四川菜太辣了，但是太好吃了！(Sichuan food is too spicy, but too delicious!)' },
    { character: '辣', pinyin: 'là', english: 'Spicy', category: 'Adjectives', travelSentence: '你怕辣吗？(Are you afraid of spicy food?)' },
    { character: '热', pinyin: 'rè', english: 'Hot', category: 'Adjectives', travelSentence: '夏天成都非常热。(In summer, Chengdu is very hot.)' },
    { character: '高兴', pinyin: 'gāoxìng', english: 'Happy', category: 'Adjectives', travelSentence: '看到熊猫我很高兴！(I am so happy to see the pandas!)' },
    { character: '爱', pinyin: 'ài', english: 'To love', category: 'Verbs', travelSentence: '我爱四川菜！(I love Sichuan food!)' },
    { character: '想', pinyin: 'xiǎng', english: 'To want, think', category: 'Verbs', travelSentence: '我想看熊猫宝宝。(I want to see baby pandas.)' },
    { character: '多', pinyin: 'duō', english: 'Many, much', category: 'Adjectives', travelSentence: '成都有很多茶馆。(Chengdu has many teahouses.)' },
    { character: '少', pinyin: 'shǎo', english: 'Few, little', category: 'Adjectives', travelSentence: '少放辣椒！(Put less chili!)' },
    { character: '都', pinyin: 'dōu', english: 'All, both', category: 'Adverbs', travelSentence: '我们都喜欢熊猫。(We all like pandas.)' },
    { character: '也', pinyin: 'yě', english: 'Also, too', category: 'Adverbs', travelSentence: '我也想吃火锅。(I also want to eat hotpot.)' },
    { character: '和', pinyin: 'hé', english: 'And, with', category: 'Conjunctions', travelSentence: '火锅和熊猫是成都最出名的。(Hotpot and pandas are Chengdu\'s most famous things.)' },
    { character: '喜欢', pinyin: 'xǐhuān', english: 'To like', category: 'Verbs', travelSentence: '你喜欢吃辣的吗？(Do you like spicy food?)' },
  ];
  for (const w of scVocab) {
    await prisma.vocabularyWord.create({ data: { ...w, provinceId: sichuan.id } });
  }

  await prisma.grammarPoint.createMany({
    data: [
      {
        title: '太 + Adjective + 了 — "Too..."',
        explanation: 'Wrap太 (tài) and 了 (le) around an adjective to say something is "too X". Very useful at Sichuan restaurants!',
        examples: JSON.stringify([
          { chinese: '火锅太辣了！', pinyin: 'Huǒguō tài là le!', english: 'The hotpot is too spicy!' },
          { chinese: '熊猫太可爱了！', pinyin: 'Xióngmāo tài kě\'ài le!', english: 'Pandas are too cute!' },
        ]),
        provinceId: sichuan.id,
      },
      {
        title: 'Adjectives as Predicates with 很 (hěn)',
        explanation: 'Chinese adjectives behave like verbs. Use 很 before the adjective (even when you don\'t mean "very").',
        examples: JSON.stringify([
          { chinese: '四川菜很辣。', pinyin: 'Sìchuān cài hěn là.', english: 'Sichuan food is spicy.' },
          { chinese: '成都的茶馆很舒服。', pinyin: 'Chéngdū de cháguǎn hěn shūfu.', english: 'Chengdu\'s teahouses are comfortable.' },
        ]),
        provinceId: sichuan.id,
      },
    ],
  });

  await prisma.exercise.createMany({
    data: [
      { type: 'MULTIPLE_CHOICE', question: '"太辣了！" (tài là le!)', questionLabel: 'What does this mean at a Sichuan restaurant?', options: JSON.stringify(['Too delicious!', 'Too spicy!', 'Too cold!', 'Too expensive!']), correctAnswer: 'Too spicy!', provinceId: sichuan.id },
      { type: 'CULTURAL', question: 'What is "face-changing" (变脸) in Sichuan opera?', questionLabel: 'Sichuan Culture', options: JSON.stringify(['A makeup technique', 'Performers instantly switch masks', 'A type of hotpot', 'A panda behavior']), correctAnswer: 'Performers instantly switch masks', provinceId: sichuan.id },
    ],
  });

  // ============================================================
  // STOP 4: SHANGHAI (上海) - Where East Meets West
  // ============================================================
  const shanghai = await prisma.province.create({
    data: {
      name: 'Shanghai',
      capital: '上海 (Shànghǎi)',
      culturalDescription:
        'Shanghai is China\'s dazzling future. The Bund\'s colonial-era buildings face Pudong\'s neon skyline across the Huangpu River — two centuries staring at each other. Once a fishing village, Shanghai exploded into Asia\'s most cosmopolitan city in the 1920s, earning the nickname "Paris of the East." Today, it\'s where China\'s best chefs, artists, and entrepreneurs come to make their mark.',
      landmark: 'The Bund (外滩 Wàitān)',
      landmarkFact:
        'The Bund has 52 buildings of various architectural styles — Gothic, Baroque, Romanesque, and Art Deco — built by British, French, American, and Russian traders during the concession era.',
      food: 'Xiaolongbao (小笼包 xiǎolóngbāo)',
      foodDescription:
        'Delicate soup dumplings with paper-thin skin, filled with pork and a burst of hot broth. The proper way to eat: nibble a small hole, slurp the soup, then eat the dumpling. Biting directly = burnt tongue.',
      custom:
        'Shanghainese are famous for their business savvy and style. "Shanghai speed" (上海速度) refers to how fast things move here — construction, deals, fashion trends.',
      mapCoordinates: JSON.stringify({ x: 700, y: 370 }),
      unlockOrder: 4,
      color: '#2563eb',
    },
  });

  const shVocab = [
    { character: '买', pinyin: 'mǎi', english: 'To buy', category: 'Verbs', travelSentence: '在南京路买了很多东西！(I bought many things on Nanjing Road!)' },
    { character: '钱', pinyin: 'qián', english: 'Money', category: 'Objects', travelSentence: '这个东西多少钱？(How much does this cost?)' },
    { character: '块', pinyin: 'kuài', english: 'Yuan (currency)', category: 'Measure Words', travelSentence: '小笼包一笼二十块。(A steamer of xiaolongbao is 20 yuan.)' },
    { character: '商店', pinyin: 'shāngdiàn', english: 'Shop', category: 'Places', travelSentence: '上海的商店开到很晚。(Shanghai\'s shops are open very late.)' },
    { character: '东西', pinyin: 'dōngxi', english: 'Thing, stuff', category: 'Objects', travelSentence: '在上海可以买很多东西。(You can buy many things in Shanghai.)' },
    { character: '衣服', pinyin: 'yīfu', english: 'Clothes', category: 'Objects', travelSentence: '上海的衣服很时尚。(Shanghai\'s clothes are very fashionable.)' },
    { character: '漂亮', pinyin: 'piàoliang', english: 'Pretty', category: 'Adjectives', travelSentence: '外滩的夜景很漂亮！(The Bund\'s night view is beautiful!)' },
    { character: '大', pinyin: 'dà', english: 'Big', category: 'Adjectives', travelSentence: '上海是一个大城市。(Shanghai is a big city.)' },
    { character: '没', pinyin: 'méi', english: 'Not (past/possession)', category: 'Adverbs', travelSentence: '我没有去过东方明珠。(I haven\'t been to the Oriental Pearl Tower.)' },
    { character: '有', pinyin: 'yǒu', english: 'To have', category: 'Verbs', travelSentence: '南京路有很多人。(Nanjing Road has many people.)' },
    { character: '些', pinyin: 'xiē', english: 'Some, a few', category: 'Measure Words', travelSentence: '我想买一些上海特产。(I want to buy some Shanghai specialties.)' },
    { character: '能', pinyin: 'néng', english: 'Can, be able to', category: 'Particles', travelSentence: '你能帮我拍照吗？(Can you help me take a photo?)' },
    { character: '个', pinyin: 'gè', english: 'General measure word', category: 'Measure Words', travelSentence: null },
    { character: '这', pinyin: 'zhè', english: 'This', category: 'Pronouns', travelSentence: '这个多少钱？(How much is this?)' },
    { character: '那', pinyin: 'nà', english: 'That', category: 'Pronouns', travelSentence: '那栋楼是上海中心大厦。(That building is the Shanghai Tower.)' },
    { character: '吧', pinyin: 'ba', english: 'Suggestion particle', category: 'Particles', travelSentence: '我们去外滩吧！(Let\'s go to the Bund!)' },
    { character: '了', pinyin: 'le', english: 'Change of state', category: 'Particles', travelSentence: '我饿了，去吃小笼包吧。(I\'m hungry, let\'s go eat xiaolongbao.)' },
  ];
  for (const w of shVocab) {
    await prisma.vocabularyWord.create({ data: { ...w, provinceId: shanghai.id } });
  }

  await prisma.grammarPoint.createMany({
    data: [
      {
        title: 'Negation with 没 (méi) — Past & Possession',
        explanation: '没 negates 有 (to not have) or past actions. Different from 不 which is for present/future.',
        examples: JSON.stringify([
          { chinese: '我没去过外滩。', pinyin: 'Wǒ méi qù guo Wàitān.', english: 'I haven\'t been to the Bund.' },
          { chinese: '我没有时间逛街。', pinyin: 'Wǒ méi yǒu shíjiān guàngjiē.', english: 'I don\'t have time to go shopping.' },
        ]),
        provinceId: shanghai.id,
      },
      {
        title: '吧 (ba) — Making Suggestions',
        explanation: 'Add 吧 at the end of a sentence to turn it into a friendly suggestion or soften a command.',
        examples: JSON.stringify([
          { chinese: '我们走吧！', pinyin: 'Wǒmen zǒu ba!', english: 'Let\'s go!' },
          { chinese: '去外滩拍照吧。', pinyin: 'Qù Wàitān pāizhào ba.', english: 'Let\'s go take photos at the Bund.' },
        ]),
        provinceId: shanghai.id,
      },
    ],
  });

  await prisma.exercise.createMany({
    data: [
      { type: 'MULTIPLE_CHOICE', question: '"多少钱？" (duōshao qián)', questionLabel: 'What are you asking at a Shanghai market?', options: JSON.stringify(['Where is it?', 'How much?', 'What is this?', 'Can I try it?']), correctAnswer: 'How much?', provinceId: shanghai.id },
      { type: 'CULTURAL', question: 'What is xiaolongbao?', questionLabel: 'Shanghai Food Culture', options: JSON.stringify(['Fried rice', 'Soup dumplings', 'Noodles', 'Roast duck']), correctAnswer: 'Soup dumplings', provinceId: shanghai.id },
    ],
  });

  // ============================================================
  // STOP 5: YUNNAN (云南) - Eternal Spring
  // ============================================================
  const yunnan = await prisma.province.create({
    data: {
      name: 'Yunnan',
      capital: '昆明 (Kūnmíng)',
      culturalDescription:
        'Yunnan means "South of the Clouds." With 25 of China\'s 56 ethnic minority groups, this is China\'s most culturally diverse province. The weather is spring-like year-round in Kunming. Ancient tea horse trails wind through mountains, and the Stone Forest looks like a petrified ocean. Locals say Yunnan has four seasons in one mountain — you can experience tropical, temperate, and alpine climates in a single day.',
      landmark: 'Stone Forest (石林 Shílín)',
      landmarkFact:
        'The Stone Forest is a UNESCO site of limestone pillars formed over 270 million years. Local legend says it was created by immortals who turned a mountain into a labyrinth to help a young couple escape.',
      food: 'Crossing-the-Bridge Noodles (过桥米线 guòqiáo mǐxiàn)',
      foodDescription:
        'A bowl of boiling broth served with raw meats, vegetables, and rice noodles on the side. You "cross the bridge" by adding ingredients yourself — they cook instantly in the hot broth. Legend says a wife invented this to keep noodles hot while crossing a bridge to bring lunch to her scholar husband.',
      custom:
        'Some ethnic minority groups practice "courtship through song" — young people sing to potential partners across valleys. If you can\'t sing well, you might stay single!',
      mapCoordinates: JSON.stringify({ x: 400, y: 460 }),
      unlockOrder: 5,
      color: '#7c3aed',
    },
  });

  const ynVocab = [
    { character: '天气', pinyin: 'tiānqì', english: 'Weather', category: 'Weather', travelSentence: '昆明的天气很好，不冷也不热。(Kunming\'s weather is great — not cold, not hot.)' },
    { character: '冷', pinyin: 'lěng', english: 'Cold', category: 'Adjectives', travelSentence: '山上有点冷。(It\'s a bit cold on the mountain.)' },
    { character: '热', pinyin: 'rè', english: 'Hot', category: 'Adjectives', travelSentence: '版纳很热。(Xishuangbanna is very hot.)' },
    { character: '下雨', pinyin: 'xià yǔ', english: 'To rain', category: 'Weather', travelSentence: '今天下雨了，不能去爬山。(It rained today, can\'t go hiking.)' },
    { character: '在', pinyin: 'zài', english: 'At, in, on', category: 'Prepositions', travelSentence: '我在大理古城。(I am in Dali Old Town.)' },
    { character: '上', pinyin: 'shàng', english: 'Up, above', category: 'Direction', travelSentence: '山上的风景很美。(The view on the mountain is beautiful.)' },
    { character: '下', pinyin: 'xià', english: 'Down, next', category: 'Direction', travelSentence: '下山的路很好走。(The way down the mountain is easy.)' },
    { character: '里', pinyin: 'lǐ', english: 'Inside', category: 'Direction', travelSentence: '石林里面像迷宫一样。(Inside the Stone Forest is like a maze.)' },
    { character: '前面', pinyin: 'qiánmiàn', english: 'In front', category: 'Direction', travelSentence: '前面就是洱海！(In front is Erhai Lake!)' },
    { character: '后面', pinyin: 'hòumiàn', english: 'Behind', category: 'Direction', travelSentence: '山后面有一个小镇。(Behind the mountain there is a small town.)' },
    { character: '这儿', pinyin: 'zhèr', english: 'Here', category: 'Direction', travelSentence: '这儿真美！(It\'s so beautiful here!)' },
    { character: '那儿', pinyin: 'nàr', english: 'There', category: 'Direction', travelSentence: '那儿是玉龙雪山。(Over there is Jade Dragon Snow Mountain.)' },
    { character: '哪儿', pinyin: 'nǎr', english: 'Where', category: 'Question Words', travelSentence: '厕所在哪儿？(Where is the bathroom?)' },
    { character: '睡觉', pinyin: 'shuìjiào', english: 'To sleep', category: 'Verbs', travelSentence: '在大理睡觉很安静。(Sleeping in Dali is very peaceful.)' },
    { character: '住', pinyin: 'zhù', english: 'To live, to stay', category: 'Verbs', travelSentence: '我住在一家民宿。(I am staying at a guesthouse.)' },
    { character: '做', pinyin: 'zuò', english: 'To do, make', category: 'Verbs', travelSentence: '我想学做云南菜。(I want to learn to make Yunnan food.)' },
  ];
  for (const w of ynVocab) {
    await prisma.vocabularyWord.create({ data: { ...w, provinceId: yunnan.id } });
  }

  await prisma.grammarPoint.createMany({
    data: [
      {
        title: '在 (zài) — Location & Progressive Action',
        explanation: '在 means "at/in/on" for location. Placed before a verb, it marks ongoing action (like "-ing").',
        examples: JSON.stringify([
          { chinese: '我在大理。', pinyin: 'Wǒ zài Dàlǐ.', english: 'I am in Dali.' },
          { chinese: '我在喝普洱茶。', pinyin: 'Wǒ zài hē Pǔ\'ěr chá.', english: 'I am drinking Pu\'er tea.' },
        ]),
        provinceId: yunnan.id,
      },
      {
        title: 'Location Words (上 下 里 前 后)',
        explanation: 'Direction words go AFTER the noun in Chinese — the opposite of English prepositions.',
        examples: JSON.stringify([
          { chinese: '山上', pinyin: 'shān shàng', english: 'on the mountain (literally: mountain-on)' },
          { chinese: '石林里面', pinyin: 'Shílín lǐmiàn', english: 'inside the Stone Forest' },
        ]),
        provinceId: yunnan.id,
      },
    ],
  });

  await prisma.exercise.createMany({
    data: [
      { type: 'MULTIPLE_CHOICE', question: '"天气很好" (tiānqì hěn hǎo)', questionLabel: 'What does this describe?', options: JSON.stringify(['The food is good', 'The weather is good', 'The view is good', 'The price is good']), correctAnswer: 'The weather is good', provinceId: yunnan.id },
      { type: 'CULTURAL', question: 'What does "Yunnan" mean?', questionLabel: 'Yunnan Geography', options: JSON.stringify(['North of the River', 'South of the Clouds', 'East of the Mountain', 'Land of Flowers']), correctAnswer: 'South of the Clouds', provinceId: yunnan.id },
    ],
  });

  // ============================================================
  // STOP 6: GUANGDONG (广东) - Southern Gateway
  // ============================================================
  const guangdong = await prisma.province.create({
    data: {
      name: 'Guangdong',
      capital: '广州 (Guǎngzhōu)',
      culturalDescription:
        'Guangzhou (Canton) has been China\'s southern gateway for over 2,000 years. When the West first traded with China, it all happened here. Cantonese culture prizes family, food, and entrepreneurship — the famous phrase "吃在广州" means "to eat, go to Guangzhou." Dim sum is not just a meal but a weekend ritual where families gather for hours of tea and small plates.',
      landmark: 'Canton Tower (广州塔 Guǎngzhōu Tǎ)',
      landmarkFact:
        'At 600 meters, Canton Tower was the world\'s tallest tower when completed in 2010. Its "twisted hourglass" shape is designed to withstand typhoons — it can sway up to 1.5 meters in strong winds.',
      food: 'Dim Sum (点心 diǎnxīn)',
      foodDescription:
        'A parade of bite-sized dishes served in bamboo steamers: har gow (shrimp dumplings), siu mai (pork dumplings), char siu bao (BBQ pork buns), egg tarts, and more. Dim sum means "touch the heart" — each dish is meant to be just a taste.',
      custom:
        'Cantonese people tap two fingers on the table when someone pours them tea — a silent "thank you." Legend says an emperor once disguised himself as a commoner and poured tea for his servant, who couldn\'t bow (it would blow his cover), so the servant tapped fingers instead — a bow in miniature.',
      mapCoordinates: JSON.stringify({ x: 580, y: 520 }),
      unlockOrder: 6,
      color: '#d946ef',
    },
  });

  const gdVocab = [
    { character: '爸爸', pinyin: 'bàba', english: 'Father', category: 'Family', travelSentence: '我爸爸喜欢喝早茶。(My father likes drinking morning tea.)' },
    { character: '妈妈', pinyin: 'māma', english: 'Mother', category: 'Family', travelSentence: '妈妈喜欢吃点心。(Mom likes eating dim sum.)' },
    { character: '儿子', pinyin: 'érzi', english: 'Son', category: 'Family', travelSentence: null },
    { character: '女儿', pinyin: "nǚ'ér", english: 'Daughter', category: 'Family', travelSentence: null },
    { character: '朋友', pinyin: 'péngyou', english: 'Friend', category: 'Family', travelSentence: '和朋友一起吃点心很开心。(Eating dim sum with friends is fun.)' },
    { character: '先生', pinyin: 'xiānsheng', english: 'Mr., husband', category: 'Family', travelSentence: '李先生是广州人。(Mr. Li is from Guangzhou.)' },
    { character: '小姐', pinyin: 'xiǎojiě', english: 'Miss', category: 'Family', travelSentence: null },
    { character: '工作', pinyin: 'gōngzuò', english: 'Work, job', category: 'Work', travelSentence: '我在广州工作。(I work in Guangzhou.)' },
    { character: '医生', pinyin: 'yīshēng', english: 'Doctor', category: 'People', travelSentence: '我妈妈是医生。(My mother is a doctor.)' },
    { character: '老师', pinyin: 'lǎoshī', english: 'Teacher', category: 'People', travelSentence: '张老师教广东话。(Teacher Zhang teaches Cantonese.)' },
    { character: '学生', pinyin: 'xuésheng', english: 'Student', category: 'People', travelSentence: '我是中文学生。(I am a Chinese student.)' },
    { character: '会', pinyin: 'huì', english: 'Can (learned skill)', category: 'Particles', travelSentence: '我会用筷子吃点心。(I can use chopsticks for dim sum.)' },
    { character: '说', pinyin: 'shuō', english: 'To speak', category: 'Verbs', travelSentence: '你能说广东话吗？(Can you speak Cantonese?)' },
    { character: '学', pinyin: 'xué', english: 'To learn', category: 'Verbs', travelSentence: '我在学中文。(I am learning Chinese.)' },
    { character: '看', pinyin: 'kàn', english: 'To watch, look', category: 'Verbs', travelSentence: '我们去看珠江夜景。(Let\'s go see the Pearl River night view.)' },
    { character: '听', pinyin: 'tīng', english: 'To listen', category: 'Verbs', travelSentence: '你听广东音乐吗？(Do you listen to Cantonese music?)' },
    { character: '家', pinyin: 'jiā', english: 'Home, family', category: 'Places', travelSentence: '广州是我的家。(Guangzhou is my home.)' },
  ];
  for (const w of gdVocab) {
    await prisma.vocabularyWord.create({ data: { ...w, provinceId: guangdong.id } });
  }

  await prisma.grammarPoint.createMany({
    data: [
      {
        title: '会 (huì) — Learned Ability vs 能 (néng) — Possibility',
        explanation: '会 = learned skill (I can because I studied). 能 = possibility/permission (I can because the situation allows).',
        examples: JSON.stringify([
          { chinese: '我会用筷子。', pinyin: 'Wǒ huì yòng kuàizi.', english: 'I can use chopsticks (I learned how).' },
          { chinese: '我不能吃花生。', pinyin: 'Wǒ bù néng chī huāshēng.', english: 'I cannot eat peanuts (allergy/restriction).' },
        ]),
        provinceId: guangdong.id,
      },
    ],
  });

  // ============================================================
  // STOP 7: HENAN (河南) — Cradle of Civilization
  // ============================================================
  const henan = await prisma.province.create({
    data: {
      name: 'Henan',
      capital: '郑州 (Zhèngzhōu)',
      culturalDescription:
        'Henan is where Chinese civilization was born. The Yellow River gave life to the first dynasties here over 4,000 years ago. Shaolin Temple — the birthplace of Zen Buddhism and kung fu — sits on Song Mountain. Shaolin monks train from childhood, mastering incredible physical feats through discipline and meditation. The Longmen Grottoes hold over 100,000 Buddhist statues carved into limestone cliffs.',
      landmark: 'Shaolin Temple (少林寺 Shàolín Sì)',
      landmarkFact:
        'Shaolin kung fu includes over 700 fighting styles. Monks train by carrying water buckets up mountain paths, punching iron plates, and standing in horse stance for hours. The temple was featured in countless martial arts films and inspired the Wu-Tang Clan.',
      food: 'Huìmiàn (烩面 Braised Noodles)',
      foodDescription:
        'A rich lamb bone broth with hand-pulled noodles, wood ear mushrooms, and tofu skin. This is the soul food of Henan — warming, nourishing, and deeply satisfying.',
      custom:
        'The "Shaolin greeting" is a right fist pressed against an open left palm (抱拳礼). The fist represents martial power, the open palm represents wisdom — together they symbolize balance between strength and knowledge.',
      mapCoordinates: JSON.stringify({ x: 610, y: 310 }),
      unlockOrder: 7,
      color: '#f59e0b',
    },
  });

  const hnVocab = [
    { character: '能', pinyin: 'néng', english: 'Can (ability/permission)', category: 'Particles', travelSentence: '你能学功夫吗？(Can you learn kung fu?)' },
    { character: '写', pinyin: 'xiě', english: 'To write', category: 'Verbs', travelSentence: '你能写汉字吗？(Can you write Chinese characters?)' },
    { character: '读', pinyin: 'dú', english: 'To read', category: 'Verbs', travelSentence: '我在读少林寺的历史。(I am reading about Shaolin Temple\'s history.)' },
    { character: '字', pinyin: 'zì', english: 'Chinese character', category: 'Objects', travelSentence: '这个字很难写。(This character is hard to write.)' },
    { character: '学习', pinyin: 'xuéxí', english: 'To study', category: 'Verbs', travelSentence: '我每天都在学习中文。(I study Chinese every day.)' },
    { character: '问', pinyin: 'wèn', english: 'To ask', category: 'Verbs', travelSentence: '请问，少林寺怎么走？(Excuse me, how do I get to Shaolin Temple?)' },
    { character: '认识', pinyin: 'rènshi', english: 'To know (a person)', category: 'Verbs', travelSentence: '你认识少林寺的和尚吗？(Do you know the monks of Shaolin?)' },
    { character: '谁', pinyin: 'shuí', english: 'Who', category: 'Question Words', travelSentence: '谁教功夫？(Who teaches kung fu?)' },
    { character: '哪', pinyin: 'nǎ', english: 'Which', category: 'Question Words', travelSentence: '哪个寺庙最有名？(Which temple is the most famous?)' },
    { character: '呢', pinyin: 'ne', english: 'Question particle', category: 'Particles', travelSentence: '你会功夫，他呢？(You can do kung fu, what about him?)' },
    { character: '我们', pinyin: 'wǒmen', english: 'We, us', category: 'Pronouns', travelSentence: '我们去看武术表演！(Let\'s go see the martial arts performance!)' },
    { character: '你们', pinyin: 'nǐmen', english: 'You (plural)', category: 'Pronouns', travelSentence: '你们想学功夫吗？(Do you all want to learn kung fu?)' },
    { character: '他们', pinyin: 'tāmen', english: 'They', category: 'Pronouns', travelSentence: '他们都是功夫大师。(They are all kung fu masters.)' },
  ];
  for (const w of hnVocab) {
    await prisma.vocabularyWord.create({ data: { ...w, provinceId: henan.id } });
  }

  await prisma.grammarPoint.createMany({
    data: [
      {
        title: '呢 (ne) — Follow-up Questions & "What about...?"',
        explanation: 'Use 呢 to bounce a question back: "and you?" or "what about X?" You don\'t need to repeat the full question.',
        examples: JSON.stringify([
          { chinese: '我会功夫，你呢？', pinyin: 'Wǒ huì gōngfu, nǐ ne?', english: 'I can do kung fu — and you?' },
          { chinese: '我的书包呢？', pinyin: 'Wǒ de shūbāo ne?', english: 'What about my backpack? (Where is it?)' },
        ]),
        provinceId: henan.id,
      },
    ],
  });

  // ============================================================
  // STOP 8: XINJIANG (新疆) — Silk Road Crossroads
  // ============================================================
  const xinjiang = await prisma.province.create({
    data: {
      name: 'Xinjiang',
      capital: '乌鲁木齐 (Wūlǔmùqí)',
      culturalDescription:
        'Xinjiang — the "New Frontier" — is China\'s largest province, spanning deserts, mountains, and grasslands where the Silk Road once connected East and West. Uyghur culture blends Central Asian and Chinese influences. The Sunday bazaar in Kashgar has been held for over 2,000 years — you can still buy carpets, spices, and livestock the way Marco Polo described. The Tianshan Mountains ("Celestial Mountains") feed crystal-blue alpine lakes.',
      landmark: 'Kashgar Old City (喀什古城 Kāshí Gǔchéng)',
      landmarkFact:
        'Kashgar\'s maze-like old city is made of mud-brick houses connected by winding alleys so narrow that cars can\'t enter. Historically at the crossroads of the Silk Road, traders from Persia, India, and China all passed through here.',
      food: 'Lamb Skewers (羊肉串 yángròu chuàn)',
      foodDescription:
        'Chunks of lamb seasoned with cumin and chili, grilled over charcoal until smoky and crisp on the outside, tender inside. Vendors fan the flames and the smell drifts through entire streets.',
      custom:
        'Uyghur hospitality is legendary — if invited to a home, you\'ll be served tea, naan, and dried fruits. Refusing is impolite. The traditional greeting involves placing your right hand over your heart with a slight bow.',
      mapCoordinates: JSON.stringify({ x: 280, y: 160 }),
      unlockOrder: 8,
      color: '#0891b2',
    },
  });

  const xjVocab = [
    { character: '飞机', pinyin: 'fēijī', english: 'Airplane', category: 'Transport', travelSentence: '我坐飞机去乌鲁木齐。(I take a plane to Urumqi.)' },
    { character: '火车', pinyin: 'huǒchē', english: 'Train', category: 'Transport', travelSentence: '火车经过天山山脉。(The train passes through the Tianshan Mountains.)' },
    { character: '火车站', pinyin: 'huǒchēzhàn', english: 'Train station', category: 'Places', travelSentence: '火车站在哪里？(Where is the train station?)' },
    { character: '出租车', pinyin: 'chūzūchē', english: 'Taxi', category: 'Transport', travelSentence: '出租车带我们去大巴扎。(The taxi takes us to the Grand Bazaar.)' },
    { character: '汽车', pinyin: 'qìchē', english: 'Car', category: 'Transport', travelSentence: '租一辆汽车去天池。(Rent a car to go to Heavenly Lake.)' },
    { character: '开', pinyin: 'kāi', english: 'To drive, open', category: 'Verbs', travelSentence: '你会开车吗？(Can you drive?)' },
    { character: '医院', pinyin: 'yīyuàn', english: 'Hospital', category: 'Places', travelSentence: null },
    { character: '饭馆', pinyin: 'fànguǎn', english: 'Restaurant', category: 'Places', travelSentence: '大巴扎旁边有很多好饭馆。(Next to the Grand Bazaar there are many good restaurants.)' },
    { character: '学校', pinyin: 'xuéxiào', english: 'School', category: 'Places', travelSentence: null },
    { character: '北京', pinyin: 'Běijīng', english: 'Beijing', category: 'Places', travelSentence: '从北京到乌鲁木齐要飞四个小时。(From Beijing to Urumqi takes 4 hours by plane.)' },
    { character: '里面', pinyin: 'lǐmiàn', english: 'Inside', category: 'Direction', travelSentence: '大巴扎里面很热闹！(Inside the Grand Bazaar is very lively!)' },
    { character: '对不起', pinyin: 'duìbuqǐ', english: 'Sorry', category: 'Greetings', travelSentence: '对不起，我迷路了。(Sorry, I\'m lost.)' },
    { character: '没关系', pinyin: 'méi guānxi', english: "It doesn't matter", category: 'Greetings', travelSentence: '没关系，我帮你。(It\'s okay, I\'ll help you.)' },
    { character: '您', pinyin: 'nín', english: 'You (polite)', category: 'Pronouns', travelSentence: '您好！请问大巴扎怎么走？(Hello! May I ask how to get to the Grand Bazaar?)' },
    { character: '零', pinyin: 'líng', english: 'Zero', category: 'Numbers', travelSentence: null },
  ];
  for (const w of xjVocab) {
    await prisma.vocabularyWord.create({ data: { ...w, provinceId: xinjiang.id } });
  }

  await prisma.grammarPoint.createMany({
    data: [
      {
        title: 'Direction Complements — Where Are You Going?',
        explanation: 'Chinese uses direction words after verbs to show where the action is headed. 去 (go) + place is the simplest form.',
        examples: JSON.stringify([
          { chinese: '我去大巴扎。', pinyin: 'Wǒ qù Dà Bāzhā.', english: 'I\'m going to the Grand Bazaar.' },
          { chinese: '飞机飞到乌鲁木齐。', pinyin: 'Fēijī fēi dào Wūlǔmùqí.', english: 'The plane flies to Urumqi.' },
          { chinese: '出租车开到天山脚下。', pinyin: 'Chūzūchē kāi dào Tiānshān jiǎoxià.', english: 'The taxi drives to the foot of the Tianshan Mountains.' },
        ]),
        provinceId: xinjiang.id,
      },
    ],
  });

  await prisma.exercise.createMany({
    data: [
      { type: 'MULTIPLE_CHOICE', question: '"大巴扎" (Dà Bāzhā)', questionLabel: 'What is the Grand Bazaar?', options: JSON.stringify(['A mountain', 'A giant market', 'A type of food', 'A train station']), correctAnswer: 'A giant market', provinceId: xinjiang.id },
      { type: 'MULTIPLE_CHOICE', question: '"对不起" (duìbuqǐ)', questionLabel: 'What do you say when you\'re lost?', options: JSON.stringify(['Hello', 'Thank you', 'Sorry', 'Goodbye']), correctAnswer: 'Sorry', provinceId: xinjiang.id },
    ],
  });

  // ============================================================
  // FINAL: HONG KONG (Bonus Stop!)
  // ============================================================
  const hongkong = await prisma.province.create({
    data: {
      name: 'Hong Kong',
      capital: '香港 (Xiānggǎng)',
      culturalDescription:
        'Your journey ends in Hong Kong — where East truly meets West. A former British colony returned to China in 1997, Hong Kong pulses with unique energy: gleaming skyscrapers, ancient temples, the world\'s best dim sum, and a skyline that lights up every night in the Symphony of Lights.',
      landmark: 'Victoria Peak (太平山 Tàipíng Shān)',
      landmarkFact:
        'The Peak Tram has been climbing Victoria Peak since 1888. The view from the top — skyscrapers, harbor, and mountains all in one frame — is one of the most iconic cityscapes on Earth.',
      food: 'Egg Waffles (鸡蛋仔 jīdàn zǎi)',
      foodDescription:
        'Crispy on the outside, soft and eggy inside — these bubble-shaped waffles are Hong Kong\'s favorite street snack.',
      custom:
        'Hong Kong people walk fast — one of the fastest pedestrian speeds in the world! "Mm goi" (唔該) is the all-purpose Cantonese phrase for please, thank you, and excuse me.',
      mapCoordinates: JSON.stringify({ x: 600, y: 560 }),
      unlockOrder: 9,
      color: '#e11d48',
    },
  });

  const hkVocab = [
    { character: '牛奶', pinyin: 'niúnǎi', english: 'Milk', category: 'Food', travelSentence: '香港的奶茶很好喝。(Hong Kong milk tea is delicious.)' },
    { character: '鱼', pinyin: 'yú', english: 'Fish', category: 'Food', travelSentence: '香港的海鲜很新鲜。(Hong Kong seafood is very fresh.)' },
    { character: '电视', pinyin: 'diànshì', english: 'Television', category: 'Objects', travelSentence: null },
    { character: '电影', pinyin: 'diànyǐng', english: 'Movie', category: 'Objects', travelSentence: '香港电影很有名。(Hong Kong movies are very famous.)' },
    { character: '电脑', pinyin: 'diànnǎo', english: 'Computer', category: 'Objects', travelSentence: null },
    { character: '电话', pinyin: 'diànhuà', english: 'Telephone', category: 'Objects', travelSentence: '我的电话号码是……(My phone number is...)' },
    { character: '手机', pinyin: 'shǒujī', english: 'Mobile phone', category: 'Objects', travelSentence: '我的手机没电了。(My phone is out of battery.)' },
    { character: '桌子', pinyin: 'zhuōzi', english: 'Table', category: 'Objects', travelSentence: null },
    { character: '椅子', pinyin: 'yǐzi', english: 'Chair', category: 'Objects', travelSentence: null },
    { character: '书', pinyin: 'shū', english: 'Book', category: 'Objects', travelSentence: '我在书店买了一本关于香港历史的书。(I bought a book about Hong Kong history at the bookstore.)' },
    { character: '日', pinyin: 'rì', english: 'Day (formal)', category: 'Time', travelSentence: null },
    { character: '岁', pinyin: 'suì', english: 'Years of age', category: 'Measure Words', travelSentence: '香港回归中国多少岁了？(How many years since Hong Kong returned to China?)' },
    { character: '本', pinyin: 'běn', english: 'Measure word (books)', category: 'Measure Words', travelSentence: '我买了三本书。(I bought three books.)' },
  ];
  for (const w of hkVocab) {
    await prisma.vocabularyWord.create({ data: { ...w, provinceId: hongkong.id } });
  }

  console.log('🗺️  Seed complete! 8 provinces + Hong Kong bonus created.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
