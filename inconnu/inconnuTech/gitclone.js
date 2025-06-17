import axios from 'axios';
import config from '../../config.cjs';

const gitCloneDownloader = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.slice(prefix.length + cmd.length).trim().split(' ');

  if (cmd === "gitclone") {
    // Ensure that the user provides a URL
    if (!args[0]) return sock.sendMessage(m.chat, { text: `Where is the link?\nExample :\n${prefix}${cmd} https://github.com/INCONNU-BOY/INCONNU-XD-V2` }, { quoted: m });

    // Check if the link is a valid GitHub URL
    if (!isUrl(args[0]) && !args[0].includes('github.com')) return sock.sendMessage(m.chat, { text: `Link invalid!!` }, { quoted: m });

    try {
      // Extract the user and repository from the GitHub URL
      let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
      let [, user, repo] = args[0].match(regex1) || [];
      repo = repo.replace(/.git$/, '');

      // Construct the API URL to get the zipball of the repository
      let url = `https://api.github.com/repos/${user}/${repo}/zipball`;

      // Get the filename from the response headers
      let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1];

      // Send the ZIP file to the user
      await sock.sendMessage(m.chat, {
        document: { url: url },
        fileName: filename + '.zip',
        mimetype: 'application/zip'
      }, { quoted: m });
    } catch (error) {
      console.error('Error in Git Clone:', error.message);
      sock.sendMessage(m.chat, { text: "❌ An error occurred while processing your request. Please try again later." }, { quoted: m });
    }
  }
};

const isUrl = (string) => {
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return pattern.test(string);
};

export default gitCloneDownloader;
