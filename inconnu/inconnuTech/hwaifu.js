import axios from 'axios';
import config from '../../config.cjs'; // Your bot configuration

// Helper function to send image
const sendImage = async (m, sock, imageUrl, caption) => {
  try {
    await sock.sendMessage(m.from, {
      image: { url: imageUrl },
      caption: caption + '\n\n> MADE BY INCONNU XD V2',
    });
    await m.React('✅');
  } catch (error) {
    console.error(error);
    await sock.sendMessage(m.from, {
      text: '❌ Oops! Something went wrong while sending the image.',
    });
  }
};

// Get the command name
const parseCommand = (message) => {
  const prefix = config.PREFIX;
  if (message.body.startsWith(prefix)) {
    return message.body.slice(prefix.length).split(' ')[0].toLowerCase();
  }
  return '';
};

// Valid NSFW commands
const isNsfwCommand = (cmd) =>
  ['hwaifu', 'trap', 'hneko', 'hentai'].includes(cmd);

// Main function
const getNsfwImage = async (m, sock) => {
  const cmd = parseCommand(m);
  if (!isNsfwCommand(cmd)) return;

  await m.React('🔞');

  let endpoint = '';
  let caption = '';

  switch (cmd) {
    case 'hwaifu':
      endpoint = 'nsfw/waifu';
      caption = 'Here is your random NSFW Waifu 😏';
      break;
    case 'trap':
      endpoint = 'nsfw/trap';
      caption = 'Here is your random NSFW Trap 🔥';
      break;
    case 'hneko':
      endpoint = 'nsfw/neko';
      caption = 'Here is your random NSFW Neko 😽';
      break;
    case 'hentai':
      endpoint = 'nsfw/blowjob';
      caption = 'Here is your NSFW Hentai 🍑';
      break;
  }

  try {
    const response = await axios.get(`https://api.waifu.pics/${endpoint}`);
    const imageUrl = response.data.url;
    await sendImage(m, sock, imageUrl, caption);
  } catch (error) {
    console.error(error);
    await sock.sendMessage(m.from, {
      text: '⚠️ Failed to fetch the NSFW image. Please try again later.',
    });
  }
};

export default getNsfwImage;
