import config from '../../config.cjs';

const startTime = Date.now();

const formatRuntime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const bugMenu = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "bug-menu" || cmd === "bugmenu") {
    const now = Date.now();
    const runtime = formatRuntime(now - startTime);

    let profilePictureUrl = 'https://files.catbox.moe/e1k73u.jpg';
    try {
      const pp = await sock.profilePictureUrl(m.sender, 'image');
      if (pp) profilePictureUrl = pp;
    } catch (e) {
      console.error("Failed to fetch profile picture:", e);
    }

    const text = `
╭───────────────⭓
│ ʙᴏᴛ : *ɪɴᴄᴏɴɴᴜ-xᴅ-v2*
│ ᴘʀᴇғɪx : ${prefix}
│ ᴍᴇɴᴜ : 𝗕𝗨𝗚-𝗠𝗘𝗡𝗨
│ ᴠᴇʀ : *𝟸.𝟶.𝟶*
╰───────────────⭓
➤ inconnu-kill
➤ inconnu-freeze
➤ inconnu-blast
➤ ios-kill
➤ x-force
────────────────────
⚡ 𝙄𝙉𝘾𝙊𝙉𝙉𝙐 𝘽𝙊𝙔 𝙏𝙀𝘾𝙃 ⚡
────────────────────
`;

    await sock.sendMessage(
      m.from,
      {
        image: { url: profilePictureUrl },
        caption: text.trim(),
        contextInfo: {
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: "INCONNU-XD-V2",
            newsletterJid: "120363397722863547@newsletter",
          },
        },
      },
      { quoted: m }
    );
  }
};

export default bugMenu;
