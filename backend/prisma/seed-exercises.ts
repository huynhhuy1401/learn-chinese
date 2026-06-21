import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.exercise.deleteMany();

  const provinces = await prisma.province.findMany({ orderBy: { unlockOrder: 'asc' } });

  const exercises: Record<string, { type: string; question: string; questionLabel: string; options: string; correctAnswer: string }[]> = {
    Beijing: [
      { type: 'CULTURAL', question: 'What does "你好" (nǐ hǎo) mean?', questionLabel: 'Greetings', options: JSON.stringify(['Hello', 'Goodbye', 'Thank you', 'Sorry']), correctAnswer: 'Hello' },
      { type: 'CULTURAL', question: 'Which famous dish is Beijing known for?', questionLabel: 'Beijing Food Culture', options: JSON.stringify(['Hotpot (火锅)', 'Peking Duck (北京烤鸭)', 'Dim Sum (点心)', 'Xiaolongbao (小笼包)']), correctAnswer: 'Peking Duck (北京烤鸭)' },
      { type: 'CULTURAL', question: 'What landmark was home to 24 emperors?', questionLabel: 'Beijing History', options: JSON.stringify(['Great Wall', 'Forbidden City (故宫)', 'Summer Palace', 'Temple of Heaven']), correctAnswer: 'Forbidden City (故宫)' },
      { type: 'CULTURAL', question: '"我是中国人" (Wǒ shì Zhōngguó rén) means:', questionLabel: 'Self-Introduction', options: JSON.stringify(['I am Chinese', 'I love China', 'China is big', 'I go to China']), correctAnswer: 'I am Chinese' },
      { type: 'CULTURAL', question: 'The Great Wall was used for:', questionLabel: 'Beijing Landmarks', options: JSON.stringify(['Farming', 'Defense and signaling', 'Religious ceremonies', 'Trading only']), correctAnswer: 'Defense and signaling' },
      { type: 'CULTURAL', question: 'How do Beijing locals greet each other?', questionLabel: 'Local Customs', options: JSON.stringify(['吃了吗? (Have you eaten?)', '你去哪儿? (Where are you going?)', '你好吗? (How are you?)', '再见! (Goodbye!)']), correctAnswer: '吃了吗? (Have you eaten?)' },
    ],
    Shaanxi: [
      { type: 'CULTURAL', question: '"今天我们去兵马俑" means:', questionLabel: 'Travel Plans', options: JSON.stringify(['Today we go to the Terracotta Warriors', 'Tomorrow we leave Xi\'an', 'Yesterday was fun', 'I like history']), correctAnswer: 'Today we go to the Terracotta Warriors' },
      { type: 'CULTURAL', question: 'How many Terracotta Warriors were buried?', questionLabel: 'Xi\'an History', options: JSON.stringify(['500', '2,000', '8,000+', '50,000']), correctAnswer: '8,000+' },
      { type: 'CULTURAL', question: 'What is Biangbiang noodles famous for?', questionLabel: 'Shaanxi Food', options: JSON.stringify(['Being the spiciest', 'Having the most complex Chinese character', 'Being the oldest noodle dish', 'Using no wheat']), correctAnswer: 'Having the most complex Chinese character' },
      { type: 'CULTURAL', question: '"现在几点？" (Xiànzài jǐ diǎn?) means:', questionLabel: 'Telling Time', options: JSON.stringify(['What time is it now?', 'Where are you?', 'How are you?', 'How much is it?']), correctAnswer: 'What time is it now?' },
      { type: 'CULTURAL', question: 'Xi\'an was the starting point of which trade route?', questionLabel: 'Xi\'an Culture', options: JSON.stringify(['The Spice Route', 'The Silk Road', 'The Tea Trail', 'The Incense Path']), correctAnswer: 'The Silk Road' },
      { type: 'CULTURAL', question: '"我看了兵马俑" (Wǒ kàn le Bīngmǎyǒng) means:', questionLabel: 'Completed Actions', options: JSON.stringify(['I will see the warriors', 'I saw the warriors (done!)', 'I want to see warriors', 'Where are the warriors?']), correctAnswer: 'I saw the warriors (done!)' },
    ],
    Sichuan: [
      { type: 'CULTURAL', question: '"这个菜太辣了！" means:', questionLabel: 'Restaurant Situations', options: JSON.stringify(['This dish is too spicy!', 'This food is cold!', 'I want more!', 'The bill please!']), correctAnswer: 'This dish is too spicy!' },
      { type: 'CULTURAL', question: 'What makes Sichuan hotpot unique?', questionLabel: 'Sichuan Food', options: JSON.stringify(['It\'s sweet', 'It numbs your tongue (málà 麻辣)', 'It\'s frozen', 'It has no spices']), correctAnswer: 'It numbs your tongue (málà 麻辣)' },
      { type: 'CULTURAL', question: 'What is "face-changing" (变脸) in Sichuan opera?', questionLabel: 'Sichuan Culture', options: JSON.stringify(['A makeup technique', 'Performers instantly switch masks', 'A cooking method', 'A panda behavior']), correctAnswer: 'Performers instantly switch masks' },
      { type: 'CULTURAL', question: '"熊猫太可爱了！" (Xióngmāo tài kě\'ài le!) means:', questionLabel: 'Expressing Feelings', options: JSON.stringify(['Pandas are too cute!', 'I don\'t like pandas', 'Pandas are dangerous', 'Where are the pandas?']), correctAnswer: 'Pandas are too cute!' },
      { type: 'CULTURAL', question: 'What does "巴适" (bāshì) mean in Sichuan dialect?', questionLabel: 'Local Slang', options: JSON.stringify(['Spicy', 'Comfortable, relaxed', 'Delicious', 'Beautiful']), correctAnswer: 'Comfortable, relaxed' },
      { type: 'CULTURAL', question: '"我喜欢吃火锅" (Wǒ xǐhuān chī huǒguō) means:', questionLabel: 'Expressing Preferences', options: JSON.stringify(['I like eating hotpot', 'I hate hotpot', 'Hotpot is expensive', 'Where is the hotpot?']), correctAnswer: 'I like eating hotpot' },
    ],
    Shanghai: [
      { type: 'CULTURAL', question: '"这个多少钱？" (Zhège duōshao qián?) means:', questionLabel: 'Shopping', options: JSON.stringify(['Where is this?', 'How much is this?', 'What is this?', 'Can I try this?']), correctAnswer: 'How much is this?' },
      { type: 'CULTURAL', question: 'What are xiaolongbao (小笼包)?', questionLabel: 'Shanghai Food', options: JSON.stringify(['Fried rice', 'Soup dumplings', 'Noodle soup', 'Roast duck']), correctAnswer: 'Soup dumplings' },
      { type: 'CULTURAL', question: 'The Bund (外滩) is famous for its:', questionLabel: 'Shanghai Landmarks', options: JSON.stringify(['Mountains', 'Colonial-era architecture and skyline view', 'Ancient temples', 'Shopping malls']), correctAnswer: 'Colonial-era architecture and skyline view' },
      { type: 'CULTURAL', question: '"我们去吧！" (Wǒmen qù ba!) means:', questionLabel: 'Making Suggestions', options: JSON.stringify(['Let\'s go!', 'Go away!', 'I went already', 'Don\'t go']), correctAnswer: 'Let\'s go!' },
      { type: 'CULTURAL', question: 'Shanghai was historically called:', questionLabel: 'Shanghai History', options: JSON.stringify(['The Northern Capital', 'Paris of the East', 'City of Angels', 'Pearl of the South']), correctAnswer: 'Paris of the East' },
      { type: 'CULTURAL', question: '"我没有去过外滩" (Wǒ méi qù guo Wàitān) means:', questionLabel: 'Past Experience', options: JSON.stringify(['I am at the Bund now', 'I haven\'t been to the Bund', 'I go to the Bund often', 'I love the Bund']), correctAnswer: 'I haven\'t been to the Bund' },
    ],
    Yunnan: [
      { type: 'CULTURAL', question: '"天气很好" (Tiānqì hěn hǎo) means:', questionLabel: 'Weather', options: JSON.stringify(['The food is good', 'The weather is good', 'The view is good', 'The price is good']), correctAnswer: 'The weather is good' },
      { type: 'CULTURAL', question: 'What does "Yunnan" (云南) mean?', questionLabel: 'Yunnan Geography', options: JSON.stringify(['North of the River', 'South of the Clouds', 'East of the Mountain', 'Land of Flowers']), correctAnswer: 'South of the Clouds' },
      { type: 'CULTURAL', question: 'Crossing-the-Bridge Noodles (过桥米线) got its name from:', questionLabel: 'Yunnan Food', options: JSON.stringify(['A bridge-shaped noodle', 'A legend about a wife crossing a bridge', 'The chef\'s name', 'A type of bridge herb']), correctAnswer: 'A legend about a wife crossing a bridge' },
      { type: 'CULTURAL', question: '"我在大理" (Wǒ zài Dàlǐ) means:', questionLabel: 'Location', options: JSON.stringify(['I am in Dali', 'I like Dali', 'Dali is beautiful', 'Go to Dali']), correctAnswer: 'I am in Dali' },
      { type: 'CULTURAL', question: 'How many ethnic minority groups live in Yunnan?', questionLabel: 'Yunnan Culture', options: JSON.stringify(['5', '10', '25', '56']), correctAnswer: '25' },
      { type: 'CULTURAL', question: '"山上" (shān shàng) means:', questionLabel: 'Direction Words', options: JSON.stringify(['Inside the mountain', 'On the mountain', 'Under the mountain', 'Behind the mountain']), correctAnswer: 'On the mountain' },
    ],
    Guangdong: [
      { type: 'CULTURAL', question: '"我会用筷子" (Wǒ huì yòng kuàizi) means:', questionLabel: 'Abilities', options: JSON.stringify(['I can use chopsticks', 'I don\'t like chopsticks', 'Chopsticks are hard', 'Where are chopsticks?']), correctAnswer: 'I can use chopsticks' },
      { type: 'CULTURAL', question: 'What is dim sum (点心) literally mean?', questionLabel: 'Guangdong Food', options: JSON.stringify(['Small plates', 'Touch the heart', 'Morning tea', 'Bamboo steamer']), correctAnswer: 'Touch the heart' },
      { type: 'CULTURAL', question: 'Tapping two fingers on the table means:', questionLabel: 'Guangdong Customs', options: JSON.stringify(['I\'m hungry', 'Thank you (for pouring tea)', 'Check please', 'More tea please']), correctAnswer: 'Thank you (for pouring tea)' },
      { type: 'CULTURAL', question: '"你吃了吗?" (Nǐ chī le ma?) in Cantonese culture is:', questionLabel: 'Greeting Customs', options: JSON.stringify(['A dinner invitation', 'A warm greeting (not literal)', 'An order to eat', 'A complaint about hunger']), correctAnswer: 'A warm greeting (not literal)' },
      { type: 'CULTURAL', question: '"我妈妈是医生" (Wǒ māma shì yīshēng) means:', questionLabel: 'Family', options: JSON.stringify(['My mother is a doctor', 'My father is a teacher', 'I am a student', 'My friend is a doctor']), correctAnswer: 'My mother is a doctor' },
      { type: 'CULTURAL', question: 'Guangzhou (Canton) was historically:', questionLabel: 'Guangdong History', options: JSON.stringify(['The northern capital', 'China\'s main trading port with the West', 'A small fishing village', 'The Great Wall\'s endpoint']), correctAnswer: 'China\'s main trading port with the West' },
    ],
    Henan: [
      { type: 'CULTURAL', question: '"你会功夫吗？" (Nǐ huì gōngfu ma?) means:', questionLabel: 'Asking About Skills', options: JSON.stringify(['Can you do kung fu?', 'Do you like kung fu?', 'Where is kung fu?', 'Kung fu is hard']), correctAnswer: 'Can you do kung fu?' },
      { type: 'CULTURAL', question: 'Shaolin Temple is the birthplace of:', questionLabel: 'Henan Culture', options: JSON.stringify(['Tea ceremony', 'Zen Buddhism and kung fu', 'Chinese opera', 'Paper making']), correctAnswer: 'Zen Buddhism and kung fu' },
      { type: 'CULTURAL', question: '"我会说汉语，你呢？" (Wǒ huì shuō Hànyǔ, nǐ ne?) means:', questionLabel: 'Follow-up Questions', options: JSON.stringify(['I can speak Chinese, and you?', 'Chinese is hard', 'Do you speak Chinese?', 'I can\'t speak Chinese']), correctAnswer: 'I can speak Chinese, and you?' },
      { type: 'CULTURAL', question: 'The Shaolin greeting (抱拳礼) symbolizes:', questionLabel: 'Shaolin Customs', options: JSON.stringify(['Balance of strength and wisdom', 'Hello and goodbye', 'Victory in battle', 'Peace with enemies']), correctAnswer: 'Balance of strength and wisdom' },
      { type: 'CULTURAL', question: 'Henan is called the cradle of Chinese civilization because:', questionLabel: 'Henan History', options: JSON.stringify(['It\'s the newest province', 'The first dynasties began here 4000+ years ago', 'It has the most pandas', 'It borders the ocean']), correctAnswer: 'The first dynasties began here 4000+ years ago' },
      { type: 'CULTURAL', question: '"请问，少林寺怎么走？" (Qǐngwèn, Shàolín Sì zěnme zǒu?) means:', questionLabel: 'Asking Directions', options: JSON.stringify(['Excuse me, how do I get to Shaolin Temple?', 'I love Shaolin Temple', 'Shaolin Temple is beautiful', 'I want to learn kung fu']), correctAnswer: 'Excuse me, how do I get to Shaolin Temple?' },
    ],
    Xinjiang: [
      { type: 'CULTURAL', question: '"我坐飞机去乌鲁木齐" means:', questionLabel: 'Transportation', options: JSON.stringify(['I take a plane to Urumqi', 'I drive to Beijing', 'I walk to the market', 'I take a bus home']), correctAnswer: 'I take a plane to Urumqi' },
      { type: 'CULTURAL', question: 'Kashgar\'s Sunday bazaar has been running for:', questionLabel: 'Xinjiang Culture', options: JSON.stringify(['50 years', '200 years', '2,000+ years', '10,000 years']), correctAnswer: '2,000+ years' },
      { type: 'CULTURAL', question: '"大巴扎" (Dà Bāzhā) is:', questionLabel: 'Xinjiang Places', options: JSON.stringify(['A mountain', 'A giant market (Grand Bazaar)', 'A type of kebab', 'A train station']), correctAnswer: 'A giant market (Grand Bazaar)' },
      { type: 'CULTURAL', question: '"对不起，我迷路了" (Duìbuqǐ, wǒ mílù le) means:', questionLabel: 'Travel Problems', options: JSON.stringify(['Sorry, I\'m lost', 'Hello, where am I?', 'Thank you for helping', 'Goodbye, I\'m leaving']), correctAnswer: 'Sorry, I\'m lost' },
      { type: 'CULTURAL', question: 'What seasoning makes Xinjiang lamb skewers distinctive?', questionLabel: 'Xinjiang Food', options: JSON.stringify(['Soy sauce', 'Cumin and chili', 'Sugar and cinnamon', 'Vinegar and salt']), correctAnswer: 'Cumin and chili' },
      { type: 'CULTURAL', question: '"没关系" (Méi guānxi) is a polite response meaning:', questionLabel: 'Politeness', options: JSON.stringify(['It doesn\'t matter / No problem', 'Go away', 'I\'m angry', 'Thank you very much']), correctAnswer: 'It doesn\'t matter / No problem' },
    ],
    'Hong Kong': [
      { type: 'CULTURAL', question: '"香港的奶茶很好喝" means:', questionLabel: 'Food & Drink', options: JSON.stringify(['Hong Kong milk tea is delicious', 'Hong Kong is beautiful', 'I don\'t like tea', 'Milk is expensive']), correctAnswer: 'Hong Kong milk tea is delicious' },
      { type: 'CULTURAL', question: 'The Peak Tram has been running since:', questionLabel: 'Hong Kong History', options: JSON.stringify(['1997', '1950', '1888', '2005']), correctAnswer: '1888' },
      { type: 'CULTURAL', question: '"我买了三本书" (Wǒ mǎi le sān běn shū) means:', questionLabel: 'Shopping & Measure Words', options: JSON.stringify(['I read three books', 'I bought three books', 'I wrote three books', 'I want three books']), correctAnswer: 'I bought three books' },
      { type: 'CULTURAL', question: 'What is "mm goi" (唔該) in Cantonese?', questionLabel: 'Cantonese Basics', options: JSON.stringify(['Goodbye', 'An all-purpose word for please/thank you/excuse me', 'I\'m hungry', 'How are you?']), correctAnswer: 'An all-purpose word for please/thank you/excuse me' },
      { type: 'CULTURAL', question: '"我的手机没电了" (Wǒ de shǒujī méi diàn le) means:', questionLabel: 'Everyday Situations', options: JSON.stringify(['My phone is out of battery', 'I lost my phone', 'My phone is new', 'I need a new phone']), correctAnswer: 'My phone is out of battery' },
      { type: 'CULTURAL', question: 'Hong Kong returned to China in:', questionLabel: 'Hong Kong History', options: JSON.stringify(['1949', '1984', '1997', '2010']), correctAnswer: '1997' },
    ],
  };

  for (const province of provinces) {
    const exs = exercises[province.name];
    if (exs) {
      for (const ex of exs) {
        await prisma.exercise.create({
          data: { ...ex, provinceId: province.id },
        });
      }
      console.log(`  ${province.name}: ${exs.length} exercises`);
    }
  }

  let total = await prisma.exercise.count();
  console.log(`✅ ${total} cultural exercises created`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
