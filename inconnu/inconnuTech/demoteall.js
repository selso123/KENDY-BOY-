import config from '../../config.cjs';

const demoteAll = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'demoteall') return;
    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await gss.decodeJid(gss.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

    const toDemote = participants
      .filter(p => p.admin && p.id !== botNumber && p.id !== m.sender)
      .map(p => p.id);

    if (toDemote.length === 0) return m.reply("*✅ NO OTHER ADMINS TO DEMOTE.*");

    await gss.groupParticipantsUpdate(m.from, toDemote, 'demote');
    m.reply(`*✅ ${toDemote.length} ADMINS DEMOTED SUCCESSFULLY IN ${groupMetadata.subject}*\n\n_© BY INCONNU XD V2_`);
  } catch (err) {
    console.error('DemoteAll Error:', err);
    m.reply('An error occurred while trying to demote all members.');
  }
};

export default demoteAll;
