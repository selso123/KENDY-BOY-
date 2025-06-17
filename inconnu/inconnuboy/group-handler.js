import moment from 'moment-timezone';
import config from '../../config.cjs';

const newsletterName = "INCONNU-XD-V2";
const fallbackPP = "https://i.ibb.co/fqvKZrP/ppdefault.jpg";

function getNewsletterContext(jid) {
   return {
      mentionedJid: [jid],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
         newsletterJid: "120363397722863547@newsletter",
         newsletterName,
         serverMessageId: 101,
      },
   };
}

export default async function GroupParticipants(sock, { id, participants, action }) {
   try {
      const metadata = await sock.groupMetadata(id);

      for (const jid of participants) {
         let profilePic;

         try {
            profilePic = await sock.profilePictureUrl(jid, "image");
         } catch {
            profilePic = fallbackPP;
         }

         const userName = jid.split("@")[0];
         const membersCount = metadata.participants.length;
         const groupName = metadata.subject;
         const date = moment.tz('Africa/Kinshasa').format('DD/MM/YYYY');
         const time = moment.tz('Africa/Kinshasa').format('HH:mm:ss');

         if (action === "add" && config.WELCOME === true) {
            const welcomeMessage = {
               image: { url: profilePic },
               caption: `┏━━❰ 𝙒𝙀𝙇𝘾𝙊𝙈𝙀 𝙁𝙍𝙄𝙀𝙉𝘿 ❱━━┓

👤 𝙉𝙚𝙬 𝙈𝙚𝙢𝙗𝙚𝙧: @${userName}
🏠 𝙂𝙧𝙤𝙪𝙥: *${groupName}*
🔢 𝙏𝙤𝙩𝙖𝙡 𝙈𝙚𝙢𝙗𝙚𝙧𝙨: *${membersCount}*
📅 𝘿𝙖𝙩𝙚 𝙅𝙤𝙞𝙣𝙚𝙙: *${date}*
🕒 𝙏𝙞𝙢𝙚: *${time}*

┗━━━━━━━━━━━━━━✦
⬡ MADE IN ${newsletterName}`,
               mentions: [jid],
               contextInfo: getNewsletterContext(jid)
            };

            await sock.sendMessage(id, welcomeMessage);
         }

         if (action === "remove" && config.WELCOME === true) {
            const goodbyeMessage = {
               image: { url: profilePic },
               caption: `┏━━❰ 𝙂𝙊𝙊𝘿𝘽𝙔𝙀 𝙁𝙍𝙄𝙀𝙉𝘿 ❱━━┓

😔 𝘽𝙮𝙚 @${userName}
🚪 𝙇𝙚𝙛𝙩 𝙩𝙝𝙚 𝙜𝙧𝙤𝙪𝙥: *${groupName}*
📅 𝘿𝙖𝙩𝙚: *${date}*
🕒 𝙏𝙞𝙢𝙚: *${time}*
👥 𝙍𝙚𝙢𝙖𝙞𝙣𝙞𝙣𝙜 𝙈𝙚𝙢𝙗𝙚𝙧𝙨: *${membersCount}*

┗━━━━━━━━━━━━━━✦
⬡ MADE IN ${newsletterName}`,
               mentions: [jid],
               contextInfo: getNewsletterContext(jid)
            };

            await sock.sendMessage(id, goodbyeMessage);
         }
      }
   } catch (e) {
      console.error("❌ Error in GroupParticipants:", e);
   }
}
