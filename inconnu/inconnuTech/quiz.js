import fetch from 'node-fetch';
import config from '../../config.cjs';

const quizSessions = new Map();

const quiz = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();
    const sender = m.sender;

    const validCommands = ['quiz', 'trivia', 'question'];
    if (!validCommands.includes(cmd)) return;

    // Prevent spam
    if (quizSessions.has(sender)) {
      return m.reply("⏳ You already have an active quiz. Reply to it first!");
    }

    const res = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return m.reply("❌ No quiz available right now. Try again later.");
    }

    const question = data.results[0];
    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    const shuffled = allAnswers.sort(() => Math.random() - 0.5);

    const correctIndex = shuffled.indexOf(question.correct_answer);
    const difficulty = question.difficulty.toLowerCase();
    const points = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;

    const answerOptions = shuffled.map((a, i) => `${i + 1}. ${decodeHTML(a)}`).join('\n');

    const quizMessage = `*🧠 QUIZ TIME*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `*Category:* ${question.category}\n` +
      `*Difficulty:* ${capitalize(difficulty)}\n` +
      `*Points:* ${points}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `*Question:* ${decodeHTML(question.question)}\n\n` +
      `${answerOptions}\n\n` +
      `*Reply with the correct number (1-4)*\n` +
      `_You have 30 seconds_\n` +
      `© BY INCONNU XD V2`;

    const replyMsg = await m.reply(quizMessage);
    
    // Save quiz session
    quizSessions.set(sender, {
      answer: correctIndex + 1,
      points,
      messageID: replyMsg.key.id,
      timestamp: Date.now()
    });

    // Auto-clear after 30 seconds
    setTimeout(() => {
      if (quizSessions.has(sender)) {
        m.reply("⏰ Time's up! The quiz has expired.");
        quizSessions.delete(sender);
      }
    }, 30000);

  } catch (err) {
    console.error(err);
    m.reply("❌ An error occurred while fetching the quiz.");
  }
};

// Helper to decode HTML characters
function decodeHTML(str) {
  return str.replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export session handler to use in message listener
export { quizSessions };
export default quiz;
