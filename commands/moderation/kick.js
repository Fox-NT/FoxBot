const Discord = require("discord.js");
const { prefix } = require('../../config.json');

module.exports = {
    name: 'kick',
    aliases: ['выгнать', 'отключить', 'leave', 'кик'],
    description: 'Выгнать пользователя с канала!',
    cooldown: 2,
    args: true,
    access: 'Moder',
    usage: '<пользователь>',
    guildOnly: true,
    permissions: 'KICK_MEMBERS',
    execute(message, args) {
        const member = message.mentions.members.first();
        const user = args[0];
        let reason = args[1];
        const server = message.guild.name;
        const author = message.author;
        const roles = {
            admin: '324504512121536512',
            moder: '324506610409930752'
        }

        if (!user.startsWith('@') && !user.startsWith('<@')) {
            return message.channel.send(`Некорректно введен ник пользователя которого необходимо выгнать.\nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя] [причина]\``)
        }

        if (!member) {
            return message.channel.send(`Невозможно кикнуть пользователя \`${args[0]}\`.\nДанный пользователь не зарегистрирован у нас на сервере!`)
        }

        if(member.id === author.id) {
            return message.reply(`Вы не можете кикнуть самого себя!`)
        }

        const admin = member.roles.cache.some(role => role.id === roles.admin);
        const moder = member.roles.cache.some(role => role.id === roles.moder);

        if (admin || moder) {
            return message.channel.send(`Данного пользователя нельзя забанить, т.к. он является администратором.`)
        }

        if (!reason) {
           reason = `Не указана`
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Действие: Кик с сервера")
            .setDescription(`Кикнут ${member} (${member.id})\nПричина: __${reason}__`)
            .setColor("#ff5f20")
            .setThumbnail(member.avatarURL)
            .setFooter(`Кикнут администратором ${message.author.tag}`)
            .setTimestamp();

        let embedDM = new Discord.MessageEmbed()
            .setTitle("Действие: Кик с сервера")
            .setDescription(`Вы были кикнуты с сервера ${server}\nПричина: __${reason}__\nВаш ник: ${member}(${member.id})`)
            .setColor("#ff5f20")
            .setThumbnail(member.avatarURL)
            .setFooter(`Кикнут администратором ${message.author.tag}`)
            .setTimestamp();

        member.send(embedDM)
            .catch(() => {
                message.channel.send(`Пользователь не был уведомлен о кике в ЛС. Возможно, у него отключены личные сообщения!`)
            })
            .then(() => {
                message.channel.send(embed)
            })
            .then(() => {
                member.kick()
                message.delete();
            });
    },
};