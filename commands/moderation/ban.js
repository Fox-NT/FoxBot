const Discord = require("discord.js");
const { prefix } = require('../../config.json');

module.exports = {
    name: 'ban',
    aliases: ['бан', 'заблокировать', 'блок', 'block'],
    description: 'Заблокировать пользователя на канале!',
    cooldown: 2,
    args: true,
    access: 'Admin',
    usage: '<пользователь> <причина>',
    guildOnly: true,
    permissions: 'BAN_MEMBERS',
    execute(message, args) {
        const member = message.mentions.members.first();
        const user = args[0];
        const reason = args[1];
        const server = message.guild.name;
        const roles = {
            admin: '324504512121536512',
            moder: '324506610409930752'
        }

        if (!user.startsWith('@')) {
            return message.channel.send(`Некорректно введен ник пользователя которого необходимо забанить.\nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя] [причина]\``)
        }
        if (!member) {
            return message.channel.send(`Невозможно забанить пользователя \`${args[0]}\`.\nДанный пользователь не зарегистрирован у нас на сервере!`)
        }
        if(member.id === message.author.id) {
            return message.reply(`Вы не можете забанить самого себя!`)
        }
        const admin = member.roles.cache.some(role => role.id === roles.admin);
        const moder = member.roles.cache.some(role => role.id === roles.moder);

        if (admin || moder) {
            return message.channel.send(`Данного пользователя нельзя забанить, т.к. он является администратором.`)
        }
        if (!reason) {
            return message.channel.send(`Вы не указали причину бана. \nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя] [причина]\``)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Действие: Блокировка")
            .setDescription(`Забанен ${member} (${member.id})\nПричина: __${reason}__`)
            .setColor("#ff2050")
            .setThumbnail(member.avatarURL)
            .setFooter(`Забанен администратором ${message.author.tag}`)
            .setTimestamp();

        let embedDM = new Discord.MessageEmbed()
            .setTitle("Действие: Блокировка")
            .setDescription(`Вы были забанены на сервере ${server})\nПричина: __${reason}__\nВаш ник: ${member}(${member.id})`)
            .setColor("#ff2050")
            .setThumbnail(member.avatarURL)
            .setFooter(`Забанен администратором ${message.author.tag}`)
            .setTimestamp();

        member.send(embedDM)
        .catch(() => {
            message.channel.send(`Пользователь не был уведомлен о бане в ЛС. Возможно, у него отключены личные сообщения!`)
        })
        .then(() => {
            message.channel.send(embed)
        })
        .then(() => {
            message.guild.members.ban(member)
            message.delete();
        });
    },
};