import config from '../../config.cjs';

const fancyStyles = [
  ['𝕭𝖔𝖓𝖏𝖔𝖚𝖗', 'Style 1'],
  ['𝓑𝓸𝓷𝓳𝓸𝓾𝓻', 'Style 2'],
  ['𝐵𝑜𝓃𝒿𝑜𝓊𝓇', 'Style 3'],
  ['𝓑𝐨𝐧𝐣𝐨𝐮𝐫', 'Style 4'],
  ['𝕓σηʝσʊя', 'Style 5'],
  ['𝔅𝔬𝔫𝔧𝔬𝔲𝔯', 'Style 6'],
  ['🄱🄾🄽🄹🄾🅄🅁', 'Style 7'],
  ['🅱🅾🅽🅹🅾🆄🆁', 'Style 8'],
  ['🅑🅞🅝🅙🅞🅤🅡', 'Style 9'],
  ['ʙᴏɴᴊᴏᴜʀ', 'Style 10'],
  ['ᵇᵒⁿʲᵒᵘʳ', 'Style 11'],
  ['ＢＯＮＪＯＵＲ', 'Style 12'],
  ['𝙱𝙾𝙽𝙹𝙾𝚄𝚁', 'Style 13'],
  ['𝖇𝖔𝖓𝖏𝖔𝖚𝖗', 'Style 14'],
  ['𝒃𝒐𝒏𝒋𝒐𝒖𝒓', 'Style 15'],
  ['𝙱𝚘𝚗𝚓𝚘𝚞𝚛', 'Style 16'],
  ['𝑩𝒐𝒏𝒋𝒐𝒖𝒓', 'Style 17'],
  ['🅑︎🅞︎🅝︎🅙︎🅞︎🅤︎🅡︎', 'Style 18'],
  ['Ｂｏｎｊｏｕｒ', 'Style 19'],
  ['вσиנσυя', 'Style 20'],
  ['𝙗𝙤𝙣𝙟𝙤𝙪𝙧', 'Style 21'],
  ['Ɓσɲʝσʋɾ', 'Style 22'],
  ['🄱𝓸𝓷𝓳𝓸𝓾𝓻', 'Style 23'],
  ['𝓑𝓸𝓷𝓳𝓸𝓾𝓻 ☁️', 'Style 24'],
  ['✿ 𝒷ℴ𝓃𝒿ℴ𝓊𝓇 ✿', 'Style 25'],
  ['★彡𝓑𝓸𝓷𝓳𝓸𝓾𝓻彡★', 'Style 26'],
  ['🍓 𝓑𝓸𝓷𝓳𝓸𝓾𝓻 🍓', 'Style 27'],
  ['🦋 𝓑𝓸𝓷𝓳𝓸𝓾𝓻 🦋', 'Style 28'],
  ['🖤 𝒷ℴ𝓃𝒿ℴ𝓊𝓇 🖤', 'Style 29'],
  ['👑 𝔅𝔬𝔫𝔧𝔬𝔲𝔯 👑', 'Style 30'],
];

// Mot de base pour correspondance lettre par lettre
const baseWord = 'bonjour';

function stylizeText(text, style) {
  // tableau des lettres stylisées du style
  const styleLetters = [...style];
  const baseLetters = [...baseWord];

  return [...text].map(char => {
    const lower = char.toLowerCase();
    const pos = baseLetters.indexOf(lower);
    if (pos !== -1) return styleLetters[pos] || char;
    return char; // lettre non dans "bonjour" reste inchangée
  }).join('');
}

const fancy = async (m, sock) => {
  const prefix = config.PREFIX;
  const body = m.body.trim();
  if (!body.startsWith(prefix)) return;

  const args = body.slice(prefix.length).split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (!['fancy', 'style'].includes(cmd)) return;

  let index = null;
  let text = '';

  if (args.length === 0) {
    text = 'INCONNU XD V2';
  } else if (!isNaN(args[0])) {
    index = parseInt(args[0]) - 1;
    text = args.slice(1).join(' ');
  } else {
    text = args.join(' ');
  }

  if (index !== null) {
    if (index < 0 || index >= fancyStyles.length) {
      return sock.sendMessage(m.from, {
        text: `❌ Style number *${index + 1}* is not available. Please choose between 1 and ${fancyStyles.length}.`,
      }, { quoted: m });
    }

    const [style, name] = fancyStyles[index];
    const styledText = stylizeText(text, style);

    return sock.sendMessage(m.from, {
      text: `🎨 *${name}*\n\n${styledText}\n\n> MADE IN BY INCONNU BOY`,
    }, { quoted: m });
  }

  // Affiche tous les styles appliqués au texte si pas d'index
  const allStyles = fancyStyles
    .map(([style, name], i) => `*${i + 1}.* ${stylizeText(text, style)}`)
    .join('\n\n');

  await sock.sendMessage(m.from, {
    text: `✨ *Fancy Styles for:* _${text}_\n\n${allStyles}\n\n👑 MADE IN BY INCONNU BOY`,
  }, { quoted: m });
};

export default fancy;
