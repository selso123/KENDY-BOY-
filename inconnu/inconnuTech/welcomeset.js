import config from '../../config.cjs';

const gcEvent = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'welcome') {
    if (!m.isGroup) return m.reply("🚫 *This command only works in group chats!*");

    let responseMessage;

    if (text === 'on') {
      config.WELCOME = true;
      responseMessage = `╭──〔 *WELCOME ENABLED* 〕──╮
│  
│  ✦ Welcome & Goodbye messages  
│     have been successfully *activated*!
│
│  ✦ New members will receive a  
│     custom welcome greeting. 👋
│  
╰────────────────────╯`;
    } else if (text === 'off') {
      config.WELCOME = false;
      responseMessage = `╭──〔 *WELCOME DISABLED* 〕──╮
│  
│  ✦ Welcome & Goodbye messages  
│     have been successfully *disabled*.
│
│  ✦ New joiners or leavers  
│     won't be notified. 🔕
│  
╰───────────────────╯`;
    } else {
      responseMessage = `╭──〔 *📘 WELCOME USAGE* 〕──╮
│  
│  ✦ *Type:* \`${prefix}welcome on\`
│     ➥ Enable Welcome/Left messages
│  
│  ✦ *Type:* \`${prefix}welcome off\`
│     ➥ Disable Welcome/Left messages
│  
╰───────────────────╯`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error:", error);
      await Matrix.sendMessage(m.from, { text: '❌ *An error occurred while processing your request.*' }, { quoted: m });
    }
  }
};

export default gcEvent;
