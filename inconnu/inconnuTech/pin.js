import axios from 'axios';

const cmd = ['pinterestdl', 'pinterest', 'pin', 'pins', 'pindownload'];

const commands = async (sock, m, args) => {
  const url = args[0];

  if (!url || !url.startsWith("http")) {
    return m.reply("❎ Please provide a valid Pinterest URL.\n\nExample: *.pin https://www.pinterest.com/pin/123456789/*");
  }

  try {
    const apiUrl = `https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.success || !data.result.media || data.result.media.length === 0) {
      return m.reply("❎ Failed to fetch media. Make sure the Pinterest link is correct.");
    }

    const { title, description, media } = data.result;
    const video = media.find(item => item.type.includes('720p'));
    const thumbnail = media.find(item => item.type === 'Thumbnail');
    const mediaType = video ? 'Video' : 'Image';

    const caption = `╭━━━〔 *INCONNU-XD-PIN DL* 〕━━━┈⊷
┃▸╭──────────────
┃▸┃๏ *Pinterest Downloader*
┃▸└──────────────···๏
╰─────────────────┈⊷
╭━━❐━⪼
┇๏ *Title* : ${title || 'Unknown'}
┇๏ *Description* : ${description || 'No description'}
┇๏ *Media Type* : ${mediaType}
╰━━❑━⪼
> *© Powered by INCONNU XD V2*`;

    if (video) {
      await sock.sendMessage(m.chat, { video: { url: video.download_url }, caption }, { quoted: m });
    } else if (thumbnail) {
      await sock.sendMessage(m.chat, { image: { url: thumbnail.download_url }, caption }, { quoted: m });
    } else {
      m.reply("❎ No media found to download.");
    }

  } catch (err) {
    console.error("PinterestDL Error:", err);
    m.reply("⚠️ An error occurred while processing the Pinterest link.");
  }
};

export default async function loadPlugin(m, sock) {
  const prefix = /^[\\/!#.]/;
  const body = m.body || '';
  const isCOMMAND = prefix.test(body);
  const command = isCOMMAND ? body.slice(1).split(' ')[0].toLowerCase() : '';
  const args = body.trim().split(/\s+/).slice(1);

  if (cmd.includes(command)) {
    await commands(sock, m, args);
  }
  }
