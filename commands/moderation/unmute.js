const Discord = require("discord.js");
const { prefix } = require('../../config.json');

module.exports = {
    name: 'unmute',
    aliases: ['анмут', 'анmute', 'размутить'],
    description: 'Снять мут с пользователя канала!',
    cooldown: 2,
    args: true,
    access: 'Moder',
    usage: '<пользователь>',
    guildOnly: true,
    permissions: 'KICK_MEMBERS',
    async execute(message, args) {
        const member = message.mentions.members.first();
        const user = args[0];
        let time = +args[1]*60000;
        let reason = args[2];
        const server = message.guild.name;
        const author = message.author;
        const roles = {
            admin: '324504512121536512',
            moder: '324506610409930752',
            muted: '795359030277177364',
            main: '371234280174649355'
        }
        let rolDB;

        if (!user.startsWith('@') && !user.startsWith('<@')) {
            return message.channel.send(`Ошибка. Некорректно введен ник пользователя которого необходимо размутить.\nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя]\``)
        }

        if (!member) {
            return message.channel.send(`Ошибка. Невозможно размутить пользователя \`${args[0]}\`.\nДанный пользователь не зарегистрирован у нас на сервере!`)
        }

        if (member.id === author.id) {
            return message.reply(`Ошибка. Вы не можете размутить самого себя!`)
        }

        let mem =  await User.findOne({ guildID: message.guild.id, userID: member.id, mute: true });

        if (!mem) {
            return message.channel.send(`Ошибка. Данный пользователь не замучен.`)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Действие: Размучен на сервере")
            .setDescription(`**Размучен** ${member} (${member.id})\n`)
            .setColor("#f8f87a")
            .setThumbnail('https://i.imgur.com/mW71irc.png')
            .setFooter(`Мут снят администратором ${message.author.tag}`)
            .setTimestamp();

        let embedDM = new Discord.MessageEmbed()
            .setTitle("Действие: Размучен на сервере")
            .setDescription(`С Вас был снят мут на сервере ${server}\n**Ваш ник**: ${member}(${member.id})`)
            .setColor("#f8f87a")
            .setThumbnail('https://i.imgur.com/mW71irc.png')
            .setFooter(`Мут снят администратором ${message.author.tag}`)
            .setTimestamp();

        member.send(embedDM)
            .catch(() => {
                message.channel.send(`Пользователь не был уведомлен о размуте в ЛС. Возможно, у него отключены личные сообщения!`)
            })
            .then(() => {
                message.channel.send(embed)
            })
            .then(() => {
                rolDB = mem.roles;
                member.roles.set(rolDB)
                    .then(() => {
                        console.log(`У пользователя Ник:${member.user.username}, ID: ${member.id} была снята роль "Muted"`);
                        console.log(`Пользователю Ник:${member.user.username}, ID: ${member.id} были добавлены все роли`);
                        console.log(`Пользователю ${user.username}(${user.userID}) снят мут`);

                        mem.mute = false;
                        mem.unmute = 0;
                        mem.save();
                    });
            });

    },
};