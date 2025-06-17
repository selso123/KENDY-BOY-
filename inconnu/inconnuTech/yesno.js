import axios from 'axios';
import config from '../../config.cjs';

const yesno = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    
    if (!['yesno', 'yesorno', 'ouiounon'].includes(cmd)) return;

    const { data } = await axios.get('https://yesno.wtf/api');

    let responseText = `*🔮 Answer:* ${data.answer.toUpperCase()}`;
    await gss.sendMessage(m.from, { image: { url: data.image }, caption: responseText }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply("❌ Une erreur est survenue en interrogeant l'oracle du OUI/NON.");
  }
};

export default yesno;
