import config from '../../config.cjs';

// ⚙️ Hidetag Command (Open to Everyone) ⚙️
const tagEveryoneSilently = async (message, sock) => {
  // 🔑 Get Command Prefix 🔑
  const trigger = config.PREFIX;

  // 🔍 Detect User Command 🔍
  const userCommand = message.body.startsWith(trigger)
    ? message.body.slice(trigger.length).trim().split(' ')[0].toLowerCase()
    : '';

  // ✅ Handle 'hidetag' Logic ✅
  if (userCommand === 'hidetag') {
    // 🛡️ Check Group Context 🛡️
    if (!message.isGroup) {
      return await sock.sendMessage(
        message.from,
        { text: '🚫 This command only works in group chats.' },
        { quoted: message }
      );
    }

    try {
      // 📡 Get Group Info 📡
      const groupData = await sock.groupMetadata(message.from);
      const participants = groupData.participants;
      const mentions = participants.map(p => p.id);

      // ✉️ Extract Message Text ✉️
      const textContent = message.quoted?.text || message.body.slice(trigger.length + userCommand.length).trim();

      if (!textContent) {
        return await sock.sendMessage(
          message.from,
          { text: '❌ Please reply to a message or add text after the command.' },
          { quoted: message }
        );
      }

      const silentNote = `_🔊 INCONNU XD V2_`;

      // 🚀 Send Silent Mention Message 🚀
      await sock.sendMessage(
        message.from,
        {
          text: `${textContent}\n\n${silentNote}`,
          mentions
        },
        { quoted: message }
      );
    } catch (err) {
      console.error('Hidetag Error:', err);
      await sock.sendMessage(
        message.from,
        { text: '⚠️ An error occurred while sending the silent tag message.' },
        { quoted: message }
      );
    }
  }
};

export default tagEveryoneSilently;
