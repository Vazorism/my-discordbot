const fs = require('fs');

// Load blacklist words from the text file
let blacklist = [];
try {
    const data = fs.readFileSync('./blacklist.txt', 'utf8');
    blacklist = data.split(',').map(word => word.trim().toLowerCase());
} catch (error) {
    console.error('❌ Error loading blacklist.txt:', error);
}

// Function to clean and normalize messages
function cleanMessage(text) {
    return text
        .toLowerCase()
        .replace(/[\s\W_]+/g, ''); // Remove spaces & special characters
}

// Function to check and delete messages
function filterMessage(message) {
    if (message.author.bot || !message.guild) return; // Ignore bots & DMs

    const cleanedMessage = cleanMessage(message.content);

    if (blacklist.some(word => cleanedMessage.includes(cleanMessage(word)))) {
        message.delete().catch(console.error); // Delete the message
    }
}

module.exports = { filterMessage };
