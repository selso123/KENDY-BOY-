import { serialize } from '../../lib/Serializer.js';
import fs from 'fs';

const AntideleteDB = './lib/AntideleteDB.json';
if (!fs.existsSync(AntideleteDB)) fs.writeFileSync(AntideleteDB, JSON.stringify({}), 'utf-8');

const antideleteSettings = JSON.parse(fs.readFileSync(AntideleteDB));

export const handleAntidelete = async (m, sock, isBotAdmins) => {
    if (!m.isGroup) return;

    const PREFIX = /^[\\/!#.]/;
    const isCOMMAND = (body) => PREFIX.test(body);
    const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    // Turn on/off antidelete
    if (cmd === 'antidelete') {
        const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
        const action = args[0] ? args[0].toLowerCase() : '';

        if (action === 'on') {
            if (!antideleteSettings[m.from]) {
                antideleteSettings[m.from] = { status: true, mode: 'all' };
            } else {
                antideleteSettings[m.from].status = true;
            }
            fs.writeFileSync(AntideleteDB, JSON.stringify(antideleteSettings, null, 2));
            await sock.sendMessage(m.from, {
                text: `━✅ *Inconnu Xd AntiDelete Activated* ✅━\n> 🔹 Choose setting:\n> 📥 antidelete set dm    📌only for private chats\n> 📥 antidelete set gc    📌only for groups\n> 📥 antidelete set all   📌for all chats (group + dm)\n━━━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "INCONNU BOY",
                        newsletterJid: "120363397722863547@newsletter",
                    }
                }
            }, { quoted: m });
            return;
        }

        if (action === 'off') {
            if (antideleteSettings[m.from]) {
                delete antideleteSettings[m.from];
                fs.writeFileSync(AntideleteDB, JSON.stringify(antideleteSettings, null, 2));
                await sock.sendMessage(m.from, {
                    text: `━❌ *inconnu Xd AntiDelete Deactivated* ❌━`,
                    contextInfo: {
                        forwardingScore: 5,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: "INCONNU-BOY-TECH",
                            newsletterJid: "120363397722863547@newsletter",
                        }
                    }
                }, { quoted: m });
                return;
            } else {
                await sock.sendMessage(m.from, { text: 'AntiDelete is not active.' }, { quoted: m });
                return;
            }
        }

        if (action === 'set') {
            const mode = args[1] ? args[1].toLowerCase() : '';

            if (!['dm', 'gc', 'all'].includes(mode)) {
                return await sock.sendMessage(m.from, {
                    text: `Please choose a valid mode:\n\n📥 *antidelete set dm* - Private chats only\n📥 *antidelete set gc* - Groups only\n📥 *antidelete set all* - All chats`,
                    contextInfo: {
                        forwardingScore: 5,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: "INCONNU-BOY-TECH",
                            newsletterJid: "120363397722863547@newsletter",
                        }
                    }
                }, { quoted: m });
            }

            if (!antideleteSettings[m.from]) antideleteSettings[m.from] = {};
            antideleteSettings[m.from].mode = mode;
            fs.writeFileSync(AntideleteDB, JSON.stringify(antideleteSettings, null, 2));

            return await sock.sendMessage(m.from, {
                text: `━⚡ *inconnu Xd AntiDelete mode set to:* ${mode.toUpperCase()} ⚡━`,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "INCONNU-BOY-TECH",
                        newsletterJid: "120363397722863547@newsletter",
                    }
                }
            }, { quoted: m });
        }

        return await sock.sendMessage(m.from, {
            text: `━⚡ *inconnu Xd AntiDelete Control Panel* ⚡━\n> 🔹 *antidelete on* ➔ Turn ON\n> 🔹 *antidelete off* ➔ Turn OFF\n> 🔹 *antidelete set dm/gc/all* ➔ Set Mode\n━━━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "INCONNU-BOY-TECH",
                    newsletterJid: "120363397722863547@newsletter",
                }
            }
        }, { quoted: m });
    }
};

// Handle deleted messages
export const detectDelete = async (m, sock) => {
    if (m.messageStubType !== 68) return; // 68 = message delete stub
    if (!antideleteSettings[m.from]) return;
    if (!antideleteSettings[m.from].status) return;

    const chatMode = antideleteSettings[m.from].mode || 'all';

    if ((chatMode === 'gc' && !m.isGroup) || (chatMode === 'dm' && m.isGroup)) return;

    const quotedMsg = m.message?.protocolMessage?.key;
    if (!quotedMsg) return;

    try {
        const originalMsg = await sock.loadMessage(quotedMsg.remoteJid, quotedMsg.id);

        if (!originalMsg) return;

        const senderName = m.pushName || 'User';

        let resendText = `━⚠️ *inconnu Xd AntiDelete* ⚠️━\n> 👤 Deleted by: @${quotedMsg.participant.split('@')[0]}\n━━━━━━━━━━━━━━━━━━━━━━`;

        await sock.sendMessage(m.from, { text: resendText, mentions: [quotedMsg.participant] }, { quoted: m });

        if (originalMsg.message?.imageMessage) {
            const buffer = await sock.downloadMediaMessage(originalMsg);
            await sock.sendMessage(m.from, { image: buffer }, { quoted: m });
        } else if (originalMsg.message?.videoMessage) {
            const buffer = await sock.downloadMediaMessage(originalMsg);
            await sock.sendMessage(m.from, { video: buffer }, { quoted: m });
        } else if (originalMsg.message?.audioMessage) {
            const buffer = await sock.downloadMediaMessage(originalMsg);
            await sock.sendMessage(m.from, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m });
        } else if (originalMsg.message?.documentMessage) {
            const buffer = await sock.downloadMediaMessage(originalMsg);
            await sock.sendMessage(m.from, { document: buffer, mimetype: originalMsg.message.documentMessage.mimetype, fileName: originalMsg.message.documentMessage.fileName }, { quoted: m });
        } else if (originalMsg.message?.conversation) {
            await sock.sendMessage(m.from, { text: `💬 ${originalMsg.message.conversation}` }, { quoted: m });
        } else if (originalMsg.message?.extendedTextMessage?.text) {
            await sock.sendMessage(m.from, { text: `💬 ${originalMsg.message.extendedTextMessage.text}` }, { quoted: m });
        }

    } catch (e) {
        console.log('Error in detectDelete', e);
    }
};


                                              
