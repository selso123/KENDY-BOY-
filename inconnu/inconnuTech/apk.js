import config from '../../config.cjs';
import axios from 'axios';

const apkDownloader = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "app") {
    if (!text) {
      return sock.sendMessage(m.from, { text: "❌ *Please provide an app name to search.*" }, { quoted: m });
    }

    // Start the ping-like reaction
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    try {
      const sanitizedQuery = text.trim().replace(/[^a-zA-Z0-9\s]/g, '');
      const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${sanitizedQuery}/limit=1`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data || !data.datalist || !data.datalist.list.length) {
        return sock.sendMessage(m.from, { text: "⚠️ *No results found for the given app name.*" }, { quoted: m });
      }

      const app = data.datalist.list[0];
      const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

      // Compact and Attractive Box
      const box = `
╭─────⟪ *APK Downloader* ⟫─────
┃ 📦 *Name:* ${app.name}
┃ 🏋 *Size:* ${appSize} MB
┃ 🏷 *Package:* ${app.package}
┃ 📅 *Updated:* ${app.updated}
╰────────────────────────────
🔗 *Powered By INCONNNU XD V2*`;

      // Send the box with APK information
      await sock.sendMessage(m.from, { text: box }, { quoted: m });

      // Send the APK file
      await sock.sendMessage(m.from, {
        document: { url: app.file.path_alt },
        fileName: `${app.name}.apk`,
        mimetype: "application/vnd.android.package-archive",
        caption: "Here is the APK file you requested."
      }, { quoted: m });

      // Final success reaction
      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

    } catch (error) {
      console.error("Error:", error);
      return sock.sendMessage(m.from, { text: "❌ *An error occurred while fetching the APK. Please try again.*" }, { quoted: m });
    }
  }
}

export default apkDownloader;
                             
