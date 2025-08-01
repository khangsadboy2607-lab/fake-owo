const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefix = 'v';
const userDataPath = './data/users.json';
let userData = {};

if (fs.existsSync(userDataPath)) {
  userData = JSON.parse(fs.readFileSync(userDataPath));
}

function saveData() {
  fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
}

client.once('ready', () => {
  console.log(`✅ Bot đã online dưới tên: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  const userId = message.author.id;

  if (!userData[userId]) {
    userData[userId] = { cash: 1000 };
  }

  if (cmd === 'vcash') {
    const vcash = require('./commands/vcash');
    vcash.run(message, userData[userId]);
  } else if (cmd === 'vtx') {
    const vtx = require('./commands/vtx');
    vtx.run(message, args, userData[userId]);
  } else if (cmd === 'vbj') {
    const vbj = require('./commands/vbj');
    vbj.run(message, args, userData[userId]);
  }

  saveData();
});

client.login('TOKEN_CUA_BAN');
