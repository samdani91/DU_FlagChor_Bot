import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new Collection();

// Load all commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
	const { default: command } = await import(fileUrl);
	if (command?.data?.name) {
		console.log(`Loaded command: ${command.data.name}`);
		client.commands.set(command.data.name, command);
	}
}

// --- Bot Ready ---
// In client.once('clientReady', ...)
client.once('clientReady', async (c) => {
	console.log(`Logged in as ${c.user.tag}`);
	console.log(`Loaded ${client.commands.size} commands.`);

});

// --- Message Handler ---
client.on('messageCreate', async message => {
	if (message.author.bot || !message.content.startsWith('!')) return;

	const args = message.content.slice(1).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName);
	if (!command) return;

	try {
		await command.execute(message, args);
	} catch (error) {
		console.error(`Error executing ${commandName}:`, error);
		await message.reply('There was an error running that command.');
	}
});

// --- Login ---
client.login(process.env.BOT_TOKEN).catch(err => {
	console.error('Failed to login:', err);
});