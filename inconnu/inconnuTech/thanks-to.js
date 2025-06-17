const thanksCommand = async (m, Matrix) => {
    const prefix = "."; // Change this if your bot uses a different prefix
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : '';

    const validCommands = ['thanks', 'thanksto', 'dev'];
    if (!validCommands.includes(cmd)) return;

    await m.React('👤');

    const message = `
╭─❏ *DEVELOPER:*
│👨‍💻 DEV : *©INCONNU BOY*
│👨‍💻 NUM : +554488138425
│───────────────────
│🛠️ *BOT:*INCONNU XD V2*
│───────────────────
│🙋‍♂️ HELLO @${m.sender.split("@")[0]}
╰──────────────────❏
`;

    try {
        await Matrix.sendMessage(m.from, {
            image: { url: 'https://files.catbox.moe/e1k73u.jpg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363397722863547@newsletter', // optional
                    newsletterName: 'INCONNU XD V2',
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

        await m.React("✅");
    } catch (err) {
        console.error("Thanks Command Error:", err);
        await Matrix.sendMessage(m.from, { text: `Error: ${err.message}` }, { quoted: m });
        await m.React("❌");
    }
};

export default thanksCommand;
