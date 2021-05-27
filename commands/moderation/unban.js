const Discord = require("discord.js");
const { prefix } = require('../../config.json');

module.exports = {
    name: 'unban',
    aliases: ['анбан', 'разблокировать', 'анблок', 'unblock', 'разбан', 'разблок'],
    description: 'Разблокировать пользователя на канале!',
    cooldown: 2,
    args: true,
    access: 'Moder',
    usage: '<пользователь>',
    guildOnly: true,
    permissions: 'BAN_MEMBERS',
    execute(message, args) {
        const member = args[0];
        if (member.startsWith('@') && member.startsWith('<@')) {
            return message.channel.send(`Некорректно введен ID пользователя которого необходимо разбанить.\nИспользуйте пример: \`${prefix}${this.name} [id-пользователя]\``)
        }
        if (isNaN(member)) {
            return message.channel.send(`Некорректно введен ID пользователя которого необходимо разбанить.\nID не должен содержать ничего кроме цифр\nИспользуйте пример: \`${prefix}${this.name} [1234567890]\``)
        }
        if(member.id === message.author.id) {
            return message.reply(`Вы не можете разбанить самого себя!`)
        }
        let embed = new Discord.MessageEmbed()
            .setTitle("Действие: Разблокировка")
            .setDescription(`Разблокирован на сервере ID: ${member}\n`)
            .setColor("#88ff20")
            .setThumbnail(member.avatarURL)
            .setFooter(`Разбанен администратором ${message.author.tag}`)
            .setTimestamp();

        message.guild.members.unban(member)
            .then(() => {
                message.channel.send(embed);
                message.delete();
            })
            .catch(() => {
                message.channel.send(`Такого ID(${member}) нет в базе заблокированных пользователей.`)
            });
    },
};