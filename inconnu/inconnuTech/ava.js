import { generateAvatar } from '../../inconnu/generateAvatar.js';
import config from '../../config.cjs';

const avatarCmd = async (m, conn) => {
  const prefix = config.PREFIX;
  const args = m.body.slice(prefix.length).trim().split(/\s+/);
  const command = args[0].toLowerCase();
  const name = args[1] || "butterfly";
  const style = args[2] || "adventurer";

  if (!["avatar", "dicebear", "ppbot"].includes(command)) return;

  const avatarUrl = generateAvatar(name, style);

  const response = `
╭━〔 DICEBEAR AVATAR 〕━╮
┃ 👤 *Name:* ${name}
┃ 🎨 *Style:* ${style}
┃ 🖼️ *Avatar:* [SVG Image]
╰━━━━━━━━━━━━━━━━━━╯
> © BY INCONNU XD V2
`;

  await conn.sendMessage(m.from, {
    image: { url: avatarUrl },
    caption: response
  }, { quoted: m });
};

export default avatarCmd;
