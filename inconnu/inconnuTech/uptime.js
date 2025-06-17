import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

  if (['alive', 'hansuptime', 'uptime'].includes(cmd)) {
    const uptimeMessage = `
╭━━━━━━━❰ 🔥 ❱━━━━━━━╮
┃🧿 *BOT : INCONNU-XD V2*
┃ 
┃⏳ *Uptime:*
┃   ┗━➤ ${days}d ${hours}h ${minutes}m ${seconds}s
┃ 
┃💻 *Status:* Online & Ready
┃🔋 *Power Mode:* Ultra Instinct 
┃👑 *Owner:* @${m.sender.split('@')[0]}
╰━━━━━━━━━━━━━━━━━━━╯
`;

    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "🚀 Speed Test",
          id: `${prefix}ping`
        })
      }
    ];

    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: uptimeMessage
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "POWERED BY INCONNU-XD V2"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: "🚨 SYSTEM STATUS",
              gifPlayback: true,
              subtitle: "🧿 SYSTEM MONITOR",
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons
            }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '554488138425',
                newsletterName: "INCONNU-XD",
                serverMessageId: 143
              }
            }
          }),
        },
      },
    }, {});

    await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
};

export default alive;
      
