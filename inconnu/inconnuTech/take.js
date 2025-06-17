import fs from 'fs/promises';
import config from '../../config.cjs';

const stickerCommand = async (m, gss) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const [cmd, ...args] = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ') : [];
  const command = cmd.toLowerCase();

  const defaultPackname = "inconnu xd v2";
  const defaultAuthor = "INCONNU XD V2";

  if (['sticker', 's', 'take'].includes(command)) {
    const quoted = m.quoted || {};

    if (!quoted) return m.reply(`Reply to a media message to use the ${prefix + command} command.`);

    try {
      // STICKER CONVERSION (image or video to sticker)
      if (['sticker', 's'].includes(command)) {
        if (quoted.mtype !== 'imageMessage' && quoted.mtype !== 'videoMessage') {
          return m.reply(`Send/Reply with an image or video to convert into a sticker ${prefix + command}`);
        }

        const media = await quoted.download();
        if (!media) throw new Error('Failed to download media.');

        const filePath = `./${Date.now()}.${quoted.mtype === 'imageMessage' ? 'png' : 'mp4'}`;
        await fs.writeFile(filePath, media);

        if (quoted.mtype === 'imageMessage') {
          const stickerBuffer = await fs.readFile(filePath);
          await gss.sendImageAsSticker(m.from, stickerBuffer, m, {
            packname: defaultPackname,
            author: defaultAuthor
          });
        } else {
          await gss.sendVideoAsSticker(m.from, filePath, m, {
            packname: defaultPackname,
            author: defaultAuthor
          });
        }

        await fs.unlink(filePath); // Clean up
      }

      // TAKE COMMAND (change packname)
      if (command === 'take') {
        if (quoted.mtype !== 'stickerMessage') {
          return m.reply(`Please reply to a sticker to change its pack name.\nUsage: ${prefix}take inconnutech`);
        }

        const newPackname = args.join(' ') || defaultPackname;
        const stickerMedia = await quoted.download();
        if (!stickerMedia) throw new Error('Failed to download sticker.');

        await gss.sendImageAsSticker(m.from, stickerMedia, m, {
          packname: newPackname,
          author: defaultAuthor
        });
      }

    } catch (error) {
      console.error("Error in sticker/take command:", error);
      await m.reply('Something went wrong while processing your request.');
    }
  }
};

export default stickerCommand;
