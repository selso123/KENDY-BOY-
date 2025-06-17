import fs from 'fs';
import moment from 'moment-timezone';
import config from '../../config.cjs';

const rank = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd === "rank") {
    await m.React('💭'); // React with a thinking icon
    
    // Sample data: You can replace this with your actual leaderboard data
    const leaderboard = [
      { name: "User1", points: 1000 },
      { name: "User2", points: 900 },
      { name: "User3", points: 800 },
      { name: "User4", points: 700 },
      { name: "User5", points: 600 },
    ];

    // Sort the leaderboard by points (descending)
    leaderboard.sort((a, b) => b.points - a.points);

    // Find the rank of the user who sent the command
    const userRank = leaderboard.findIndex(user => user.name === m.pushName) + 1;
    const userPoints = leaderboard[userRank - 1] ? leaderboard[userRank - 1].points : 0;

    let rankMessage = `👑 *Rank Information*\n\n`;
    rankMessage += `*Your Rank*: ${userRank} / ${leaderboard.length}\n`;
    rankMessage += `*Your Points*: ${userPoints}\n\n`;

    rankMessage += `╭──❍ 「 *Leaderboard* 」❍\n`;

    // Display top 5 users (or all, if you prefer)
    leaderboard.slice(0, 5).forEach((user, index) => {
      rankMessage += `│ ${index + 1}. ${user.name} - ${user.points} points\n`;
    });

    rankMessage += `╰─────────────────❍`;

    await m.React('✔️'); // React with a success icon

    // Send the rank message
    sock.sendMessage(
      m.from,
      {
        text: rankMessage,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363397722863547@newsletter',
            newsletterName: "INCONNU XD V2",
            serverMessageId: -1,
          },
          forwardingScore: 999, // Score to indicate it has been forwarded
          externalAdReply: {
            title: "INCONNU XD V2",
            body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ inconnu boy",
            thumbnailUrl: 'https://files.catbox.moe/e1k73u.jpg', // Add thumbnail URL if required
            sourceUrl: 'https://whatsapp.com/channel/0029Vb6T8td5K3zQZbsKEU1R', // Add source URL if necessary
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  }
};

export default rank;
