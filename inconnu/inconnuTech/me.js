import config from '../../config.cjs';

const setOwnerNameCommand = async (m, Matrix) => {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === 'setownername') {
        if (!isCreator) {
            await Matrix.sendMessage(m.from, { text: "*📛 THIS IS AN OWNER COMMAND*" }, { quoted: m });
            return;
        }

        if (text.length > 0) {
            config.OWNER_NAME = text;
            m.reply(`✅ Owner name has been updated to: *${text}*`);
        } else {
            m.reply("⚠️ Please provide a new owner name.");
        }
    }
};

export default setOwnerNameCommand;
