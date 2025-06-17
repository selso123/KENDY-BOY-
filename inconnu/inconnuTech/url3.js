import axios from "axios";

import config from "../../config.cjs";

const shortenUrl = async (m, sock) => {

  const prefix = config.PREFIX;

  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  const validCommands = ["shortenurl", "urlshortener", "shorten"];

  if (validCommands.includes(cmd)) {

    const url = m.body.split(" ")[1];

    if (!url) {

      return await sock.sendMessage(

        m.from,

        { text: "ρℓєαѕє ρяσνι∂є α υяℓ тσ ѕнσятєη. єχαмρℓє:!shortenurl https://github.com/INCONNU-BOY/INCONNU-XD-V2*" },

        { quoted: m }

      );

    }

    const apiUrl = `https://bk9.fun/tools/shorten?url=${encodeURIComponent(url)}`;

    try {

      await m.React("⏳"); // React with a loading icon

      const response = await axios.get(apiUrl);

      const data = response.data;

      if (data.status === true && data.BK9) {

        const originalUrl = data.BK9.origin;

        const shortenedUrl = data.BK9.url;

        const responseText = `*inconnu xᴅ v2 sʜᴏʀᴛᴇɴ ᴜʀʟ*\n\n*ᴏʀɪɢɪɴᴀʟ ᴜʀʟ*: *${originalUrl}*\n*sʜᴏʀᴛᴇɴᴇᴅ ᴜʀʟ:* *${shortenedUrl}\n\n _ᴛᴀᴘ ᴀɴᴅ ʜᴏʟᴅ ᴏɴ ᴛʜᴇ sʜᴏʀᴛᴇɴᴇᴅ ᴜʀʟ ᴛᴏ ᴄᴏᴘʏ ɪᴛ_\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ inconnu boy*`;

        await sock.sendMessage(

          m.from,

          {

            text: responseText,

            contextInfo: {

              isForwarded: false,

              forwardedNewsletterMessageInfo: {

                newsletterJid: "120363397722863547@newsletter",

                newsletterName: "INCONNU XD V2",

                serverMessageId: -1,

              },

              forwardingScore: 999, // Score to indicate it has been forwarded

              externalAdReply: {

                title: "INCONNU XD V2",

                body: "υяℓ ѕнσятєηєя ѕєяνι¢e",

                thumbnailUrl: "https://pps.whatsapp.net/v/t61.24694-24/491838851_1691815294762837_175487952056747300_n.jpg?ccb=11-4&oh=01_Q5Aa1QE1LGt54jO2ZJ-BIvc1hrsSH--faJrfv2RA070q9z381Q&oe=681127B9&_nc_sid=5e03e0&_nc_cat=107", // Add thumbnail URL if required

                sourceUrl: "https://whatsapp.com/channel/0029Vb6T8td5K3zQZbsKEU1R", // Source URL

                mediaType: 1,

                renderLargerThumbnail: false,

              },

            },

          },

          { quoted: m }

        );

      } else {

        throw new Error("Invalid response from the API");

      }

    } catch (error) {

      console.error("Error:", error); // Log the full error for debugging

      await sock.sendMessage(

        m.from,

        {

          text: `*ᴇʀʀᴏʀ sʜᴏʀᴛᴇɴɪɴɢ ᴜʀʟ: ${error.message}*`,

          contextInfo: {

            externalAdReply: {

              title: "INCONNU XD V2",

              body: "ѕнσят υяℓ ѕєяνι¢єѕ",

              sourceUrl: "https://whatsapp.com/channel/0029Vb6T8td5K3zQZbsKEU1R",

              mediaType: 1,

            },

          },

        },

        { quoted: m }

      );

    }

  }

};

export default shortenUrl;
