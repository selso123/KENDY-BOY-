
/**
 * INCONNU BOY TECH BOT
 * @param {string} name - Le nom ou identifiant utilisé comme "seed"
 * @param {string} style - Le style d'avatar (ex: "pixel", "bottts", "adventurer")
 * @returns {string} URL de l’avatar SVG généré
 */
export const generateAvatar = (name = "inconnu", style = "adventurer") => {
  // Format PNG pour compatibilité avec WhatsApp
  return `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(name)}`;
};
