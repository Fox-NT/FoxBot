const Discord = require("discord.js");

const User = require('../../data/user.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'unwarn',
    aliases: ['анварн'],
    description: 'Снять варе с пользователя.',
    cooldown: 3,
    args: true,
    access: 'Moder',
    usage: '<пользователь> <количество>',
    guildOnly: true,
    permissions: 'KICK_MEMBERS',
    async execute (message, args) {
        const member = message.mentions.members.first();
        const user = args[0];
        let count = args[1];
        const server = message.guild.name;
        const author = message.author;

        if (!user.startsWith('@') && !user.startsWith('<@')) {
            return message.channel.send(`Некорректно введен ник пользователя которого с которого надо снять наказание.\nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя] [кол-во]\``)
        }

        if (!member) {
            return message.channel.send(`Невозможно снять наказание с пользователя \`${args[0]}\`.\nДанный пользователь не зарегистрирован у нас на сервере!`)
        }

        if(member.id === author.id) {
            return message.reply(`Вы не можете снять варн с самого себя!`)
        }

        let mem =  await User.findOne({ guildID: message.guild.id, userID: member.id, warn: {$gt  : 0} });

        if (!mem) {
            return message.channel.send(`Ошибка. Данный пользователь не имеет варнов.`)
        }

        if (!count) {
            count = mem.warn;
        }

        if (isNaN(count)) {
            return message.channel.send(`Ошибка. Введите корректное число!`)
        }

        if (count > mem.warn) {
            return message.channel.send(`Ошибка. У пользователя нет столько варнов.\nТекущее количество варнов у пользователя: ${member} - ${mem.warn}`)
        }

        mem.warn -= count;
        if (mem.warn < 0) {
            mem.warn = 0;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Действие: Снят варн (Варнов осталось: ${mem.warn}/3)`)
            .setDescription(`Снят варн с пользователя ${member} (${member.id})\n`)
            .setColor("#ff9b20")
            .setThumbnail('https://i.imgur.com/u5CtJeg.png')
            .setFooter(`Варн снят администратором ${message.author.tag}`)
            .setTimestamp();
        let embedDM = new Discord.MessageEmbed()
            .setTitle(`Действие: Снят варн (Варнов осталось: ${mem.warn}/3)`)
            .setDescription(`С Вас был снят варн на сервере ${server}\nВаш ник: ${member}(${member.id})`)
            .setColor("#ff9b20")
            .setThumbnail('https://i.imgur.com/u5CtJeg.png')
            .setFooter(`Варн снят администратором ${message.author.tag}`)
            .setTimestamp();

        member.send(embedDM)
            .catch(() => {
                message.channel.send(`Пользователь не был уведомлен о кике в ЛС. Возможно, у него отключены личные сообщения!`)
            })
            .then(() => {
                message.channel.send(embed)
                message.delete();
            });

        mem.save();
    },
};