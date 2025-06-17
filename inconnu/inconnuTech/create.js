import config from '../../config.cjs';

const createGroup = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : '';

  if (cmd !== "create") return;

  if (!isCreator) {
    return m.reply("🚫 *Only the bot owner can use this command.*");
  }

  const args = m.body.slice(prefix.length + cmd.length).trim();

  // Show usage if no args
  if (!args) {
    return Matrix.sendMessage(m.from, {
      text: `
╭━━〔 *GROUP CREATION TOOL* 〕━━⬣
┃
┃📌 *How to use:*
┃
┃➤ ${prefix}create *GroupName*
┃     ↪ Creates a group without members
┃
┃➤ ${prefix}create *GroupName* add *num1,num2,...*
┃     ↪ Creates a group and adds members
┃
┃📍 *Examples:*
┃▪ ${prefix}create INCONNU XD 
┃▪ ${prefix}create INCONNU XD add 2299001122,2298123456
┃
╰━━━〔 © INCONNU XD V2 〕━━⬣
      `.trim()
    }, { quoted: m });
  }

  let groupName = args;
  let numbersToAdd = [];

  if (args.includes("add")) {
    const [namePart, numberPart] = args.split("add");
    groupName = namePart.trim();
    numbersToAdd = numberPart
      .split(",")
      .map(num => num.replace(/[^0-9]/g, '') + "@s.whatsapp.net")
      .filter(id => id.length > 15); // avoid invalid numbers
  }

  try {
    const response = await Matrix.groupCreate(groupName, []);
    const newGroupJid = response.gid;

    if (numbersToAdd.length > 0) {
      await Matrix.groupParticipantsUpdate(newGroupJid, numbersToAdd, "add");
    }

    await Matrix.sendMessage(m.from, {
      text: `
⬡ *Group created successfully!*
⬡ *Group Name:* ${groupName}
⬡ *Group ID:* ${newGroupJid}
⬡ *Members added:* ${numbersToAdd.length > 0 ? numbersToAdd.length : "None"}

> MADE IN BY INCONNU XD V2 
      `.trim()
    }, { quoted: m });

  } catch (err) {
    console.error("Group creation error:", err);
    return m.reply("❌ *An error occurred while creating the group.*\nPlease check permissions or number format.");
  }
};

export default createGroup;
