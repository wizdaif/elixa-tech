const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
// const sqlite = require('sqlite3').verbose();
const memberCount = require('./member-count')
const client = new Discord.Client();
//const Canvas = require('canvas');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Elixa is ready.');
	client.user.setActivity('Elixa | !help', { type: 'WATCHING' }).catch(console.error());
	memberCount(client)
	//let db = new sqlite.Database('./db/main.db', sqlite.OPEN_READWRITE);
	//db.run(`CREATE TABLE IF NOT EXISTS data(userid INTEGER NOT NULL, username TEXT NOT NULL`);
});

client.on("ready", () => {
    const channel = client.channels.cache.get("735986498368831579");
    if (!channel) return console.error("The channel does not exist!");
    channel.join().then(connection => {
        // Yay, it worked!
        console.log("Successfully connected.");
    }).catch(e => {

        // Oh no, it errored! Let's log it to console :)
        console.error(e);
    });
});

client.on('message', message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('message', message =>{
	if (!message.content.startsWith('am i cute?') || message.author.bot) return;
	message.channel.send('no your ugly, go simp for someone bro')
})


client.on('message', message =>{
if (!message.content.startsWith('i think i messed up') || message.author.bot) return;
	message.channel.send('yes, yes you did')
});

client.on('message', message => {
    if (!message.content.startsWith('where is the hub?') || message.author.bot) return;
const hublink = 'https://www.roblox.com/games/5408041704/Hub';
message.channel.send('Make sure to read -> <#723480747071111198>, ' + hublink)
    });

/*client.on('message', message =>{
	if (!message.content.startsWith('!!send') || message.author.bot) return;
	message.channel.send('./F-16.rbxm');
});*/

/*client.on('message', message => {
	if (message.content === '!join') {
		client.emit('guildMemberAdd', message.member);
	}
});*/

client.on('message', message => {
	if (!message.content.startsWith('https://discord.gg/') || message.author.bot) return;
	message.delete();
	message.reply('you can\'t send invites!') 
})

/*client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.id === '729881226969743434');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./background.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to IAT,', canvas.width / 2.5, canvas.height / 3.5);

	// Add an exclamation point here and below
	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the International Aviation Tech, ${member}!`, attachment);
});*/

/*client.on('message', (message) => {
	let db = new sqlite.Database('./db/main.db', sqlite.OPEN_READWRITE);
	let msg = message.content.toLowerCase();
	if (message.author.bot) return;
	let userid = message.author.id;
	let uname = message.author.tag;
	


	if (msg == '.getdata') {
		let query = 'SELECT * FROM data WHERE userid = ?';
		db.get(query, [userid], (err, row) => {
			if (err) {
				console.log(err)
				return;
			}
			if (row === undefined) {
				let insertdata = db.prepare(`INSERT INTO data vaules(?,?,?)`)
				insertdata.run(userid, uname, "none");
				insetdata.finalize();
				db.close();
				return;
			} else {
				let userid2 = row.userid;
				let username = row.username;
				message.channel.send(username)
			}
		});
	}

});*/


client.login(token);