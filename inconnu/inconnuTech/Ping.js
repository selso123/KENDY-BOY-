import config from '../../config.cjs';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ping = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "ping") {
    const start = new Date().getTime();
    await m.React('⚡');

    // Effet rapide lettre par lettre
    const letters = ['P', 'I', 'N', 'G'];
    let text = '';
    for (const l of letters) {
      text += l + ' ';
      await sock.sendMessage(m.from, { text: `*${text.trim()}*` }, { quoted: m });
      await delay(200); // délai court (0.2s)
    }

    // Calcul du temps de réponse
    const end = new Date().getTime();
    const pingTime = (end - start) / 1000;

    // Message final stylisé
    const result = `
╭──〔 *INCONNU-XD V2* 〕─╮
│  
│  ✦ Response Time: *${pingTime.toFixed(3)}s*
│  ✦ Server: ✅ Online
│  ✦ Version: ⚙️ *V2 Fast Mode*
│  
╰───────────────────╯`;

    await sock.sendMessage(m.from, {
      text: result,
      contextInfo: {
        externalAdReply: {
          title: 'INCONNU-XD V2',
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://telegra.ph/file/28ff0200f58c619244264.jpg', // tu peux changer ça
          sourceUrl: 'https://github.com/INCONNU-BOY/INCONNU-XD-V2'
        }
      }
    }, { quoted: m });
  }
};

export default ping;
