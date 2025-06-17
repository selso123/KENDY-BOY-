import config from '../../config.cjs';

let SUDO_LIST = config.SUDO_LIST || [];

const cleanNumber = (jid) => jid.replace(/[^0-9]/g, '');

export const isAuthorized = (jid) => {
    const num = cleanNumber(jid);
    return num === config.OWNER_NUMBER || SUDO_LIST.includes(num);
};

const ownerHandler = async (m, gss) => {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();
    const sender = cleanNumber(m.sender);

    // .owner
    if (cmd === 'owner') {
        try {
            await gss.sendContact(m.from, [config.OWNER_NUMBER], m);
            await m.React("✅");
        } catch (error) {
            console.error('Error sending owner contact:', error);
            await m.reply('Failed to send owner contact.');
            await m.React("❌");
        }
    }

    // .inconnu add/del/list
    if (cmd === 'inconnu') {
        const [actionRaw, numberArg] = text.split(' ');
        const action = (actionRaw || '').toLowerCase();
        let number = cleanNumber(numberArg || '');

        // Si reply
        if (!number && m.quoted && m.quoted.sender) {
            number = cleanNumber(m.quoted.sender);
        }

        if (sender !== config.OWNER_NUMBER) {
            await m.reply("Only the bot owner can manage sudo users.");
            return;
        }

        if (!['add', 'del', 'list'].includes(action)) {
            await m.reply("Invalid usage. Try:\n.inconnu add 554488138425 (or reply)\n.inconnu del 554488138425 (or reply)\n.inconnu list");
            return;
        }

        if (action === 'list') {
            const listText = SUDO_LIST.length > 0
                ? SUDO_LIST.map((n, i) => `${i + 1}. ${n}`).join('\n')
                : "No sudo users found.";
            await m.reply(`*SUDO USERS:*\n${listText}`);
            return;
        }

        if (!number) {
            await m.reply("Please provide or reply with a number.");
            return;
        }

        if (action === 'add') {
            if (SUDO_LIST.includes(number)) {
                await m.reply("This number is already a sudo user.");
            } else {
                SUDO_LIST.push(number);
                await m.reply(`✅ ${number} has been added to the sudo list.`);
            }
        }

        if (action === 'del') {
            const index = SUDO_LIST.indexOf(number);
            if (index !== -1) {
                SUDO_LIST.splice(index, 1);
                await m.reply(`❌ ${number} has been removed from the sudo list.`);
            } else {
                await m.reply("This number is not in the sudo list.");
            }
        }
    }
};

export default ownerHandler;
                  
