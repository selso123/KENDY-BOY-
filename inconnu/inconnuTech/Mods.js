import config from '../../config.cjs';

const modeCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net', ...(config.SUDO || [])].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd !== 'mode') return;

  if (!isCreator) {
    return await Matrix.sendMessage(
      m.from,
      {
        text: `🚫 *ACCESS DENIED*\n\n📛 This command is reserved for the *Owner* or *Sudo Users*.`,
      },
      { quoted: m }
    );
  }

  if (!text || !['public', 'private'].includes(text.toLowerCase())) {
    return await Matrix.sendMessage(
      m.from,
      {
        text: `❓ *Usage*\n\n➤ \`${prefix}mode public\`\n➤ \`${prefix}mode private\`\n\n🌐 Current mode: *${config.MODE || 'undefined'}*`,
      },
      { quoted: m }
    );
  }

  const selectedMode = text.toLowerCase();

  config.MODE = selectedMode;
  Matrix.public = selectedMode === 'public';

  return await Matrix.sendMessage(
    m.from,
    {
      text: `✅ *Mode Updated*\n\n🔄 Bot is now in *${selectedMode.toUpperCase()}* mode.`,
    },
    { quoted: m }
  );
};

export default modeCommand;
