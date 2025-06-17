import axios from 'axios';
import config from '../../config.cjs';

const anime = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "anime") {
    if (!text) {
      return sock.sendMessage(m.from, { text: 'Please provide an anime name after the command.' }, { quoted: m });
    }

    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${text}&limit=1`);
      const animeData = response.data.data[0];

      if (animeData) {
        const animeInfo = `
          *Anime Name:* ${animeData.title}
          *Score:* ${animeData.score}
          *Genres:* ${animeData.genres.map(genre => genre.name).join(', ')}
          *Synopsis:* ${animeData.synopsis}
          *Link:* ${animeData.url}
        `;
        sock.sendMessage(m.from, { text: animeInfo }, { quoted: m });
      } else {
        sock.sendMessage(m.from, { text: 'No anime found with that name.' }, { quoted: m });
      }
    } catch (error) {
      sock.sendMessage(m.from, { text: 'An error occurred while fetching the anime data.' }, { quoted: m });
    }
  }
};

export default anime;
  
