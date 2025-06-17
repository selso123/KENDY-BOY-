import config from '../../config.cjs';

const promoteAll = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'promoteall') return;
    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await gss.decodeJid(gss.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

    const toPromote = participants
      .filter(p => !p.admin)
      .map(p => p.id);

    if (toPromote.length === 0) return m.reply("*✅ EVERYONE IS ALREADY ADMIN.*");

    await gss.groupParticipantsUpdate(m.from, toPromote, 'promote');
    m.reply(`*✅ ALL ${toPromote.length} MEMBERS PROMOTED TO ADMIN IN ${groupMetadata.subject}*\n\n_© BY INCONNU XD V2_`);
  } catch (err) {
    console.error('PromoteAll Error:', err);
    m.reply('An error occurred while trying to promote all members.');
  }
};

export default promoteAll;
