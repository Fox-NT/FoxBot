const fs = require('fs');
const ms = require('ms')

const config = require('./config.json')
global.Discord = require('discord.js');
global.mongoose = require('mongoose');
global.Guild = require("./data/guild.js");
global.User = require('./data/user.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


const logs = require(`./logs.js`);

const { prefix, token, dataURL } = require('./config.json');

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, async (...args) => event.execute(...args, client));
    }
}
mongoose.connect(dataURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
    console.log('[✅ DataBase] Connected!')
})

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    // if (folder == 'levels') continue;
    // if (folder == 'moderation') continue;
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

setInterval(unmute, 30000);
async function unmute()  {
    let muteUser = [];
    const roles = {
        admin: '324504512121536512',
        moder: '324506610409930752',
        muted: '795359030277177364',
        main: '371234280174649355'
    }
    const current = Date.now();
    muteUser = await User.find( { mute: true });
    muteUser.forEach(user => {
        const guild = client.guilds.cache.find(gl => gl.id === `${user.guildID}`);
        const channel = guild.channels.cache.find(ch => ch.id === '844949267760021525');
        const member = guild.members.cache.find(m => m.id === user.userID);

        if (user.unmute <= current) {
            console.log(`Мут закончился у пользователя: ${user.username}(${user.userID})`);
            user.mute = false;
            user.unmute = 0;
            let embed = new Discord.MessageEmbed()
                .setTitle("Действие: Окончание действия мута")
                .setDescription(`**Мут закончился у пользователя** ${user.username} (${user.userID})\n`)
                .setColor("#f6f64b")
                .setThumbnail('https://i.imgur.com/mW71irc.png')
                .setFooter(`Мут снят системой по истечении времени`)
                .setTimestamp();
            let embedDM = new Discord.MessageEmbed()
                .setTitle("Действие: Окончание действия мута")
                .setDescription(`**У Вас закончился мут на сервере ${guild.name}\n** Ваш ник:${user.username} (${user.userID})`)
                .setColor("#f6f64b")
                .setThumbnail('https://i.imgur.com/mW71irc.png')
                .setFooter(`Мут снят системой по истечении времени`)
                .setTimestamp();
            member.send(embedDM)
                .catch(() => {
                    channel.send(`Пользователь не был уведомлен о муте в ЛС. Возможно, у него отключены личные сообщения!`)
                })
                .then(() => {
                    channel.send(embed)
                })
                .then(() => {
                    member.roles.remove(roles.muted)
                        .then(() => {
                            // user.roles.forEach(role => {
                            //     if (role != 313263801174589452) {
                            //         member.roles.add(role);
                            //     }
                            // })

                            member.roles.set(user.roles);
                        })
                    console.log(`Пользователю Ник:${user.username}, ID: ${user.userID} были добавлены роли обратно после мута`)
                    console.log(`У пользователя Ник:${user.username}, ID: ${user.userID} была снята роль "Muted"`)
                    console.log(`Мут закончился у пользователя: ${user.username}(${user.userID})`)
                })

        }
        user.save();
    })
}
client.on('message', async message => {

    if(message.author.bot) return;
    client.nodb = (user) => message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`К сожелению **${user.tag}** нету в базе-данных.`));
    let roles = message.member.roles.cache.map(r => r.id);
    let user =  await User.findOne({ guildID: message.guild.id, userID: message.author.id, username: message.author.username });
    let guild =  await Guild.findOne({ guildID: message.guild.id });
    if(!user) { User.create({ guildID: message.guild.id, userID: message.author.id, roles: roles, username: message.author.username  }); return }
    if(!guild) { Guild.create({ guildID: message.guild.id }); return }
    // message.channel.send(`\`[✅ DataBase]\` **${message.author.username}** Успешно был(а) добавлен в базу-данных`);
    // message.channel.send(`\`[✅ DataBase]\` **${message.guild.name}** Успешно была добавлена в базу-данных`);
    // let random = Math.floor(Math.random() * 5);
    const level = user.level;
    const formula = Math.floor(100*Math.pow(1.1, level));

    user.xp++
    user.messages++
    console.log(`Текущий уровень: ${user.level}\nДо следующего уровня осталось: ${user.nextLevel-user.xp}.`)
    if(user.xp >= formula){
        let embed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setDescription(`[:tada:] Поздравим **${message.author.username}** с новым уровнем!`)
        message.channel.send(embed)
        user.xp -= formula;
        user.level += 1;
    }

    user.nextLevel = formula;

    user.save();

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) {
        return message.reply(`У нас нет команды \`${message.content}\`. Попробуй другую!\nВведи \`!help\` чтобы посмотреть список команд.`);
    }

    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply('У Вас нет прав на использование данной команды!');
        }
    }

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply(`Я не могу применить команду \`${prefix}${commandName}\` в личных сообщениях. Она предназначена только для сервера!`);
    }

    if (command.args && !args.length) {
        let reply = `Вы не указали дополнительные аргументы, ${message.author}!`;

        if (command.usage) {
            reply += `\nПравильно использовать данную команду: \`${prefix}${commandName} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    const { cooldowns } = client;

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
            return message.reply(`Пожалуйста, подождите еще ${timeLeft.toFixed(1)} секунд(ы), чтобы использовать команду \`!${command.name}\` еще раз.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Произошла ошибка при выполнении данной команды, возможно, я её просто не знаю!');
    }
});

logs;
client.login(token);
