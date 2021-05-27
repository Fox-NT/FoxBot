const Discord = require("discord.js");

const User = require('../../data/user.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'warn',
    aliases: ['варн', 'предупреждение', 'пред', 'warning'],
    description: 'Вынести варн пользователю!',
    cooldown: 3,
    args: true,
    access: 'Moder',
    usage: '<пользователь>',
    guildOnly: true,
    permissions: 'KICK_MEMBERS',
    async execute (message, args) {
        const member = message.mentions.members.first();
        const user = args[0];
        let reason = args[1];
        const server = message.guild.name;
        const author = message.author;
        const roles = {
            admin: '324504512121536512',
            moder: '324506610409930752'
        }
        let mem =  await User.findOne({ guildID: message.guild.id, userID: member.id });

        if (!user.startsWith('@') && !user.startsWith('<@')) {
            return message.channel.send(`Некорректно введен ник пользователя которого необходимо наказать.\nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя] [причина]\``)
        }

        if (!member) {
            return message.channel.send(`Невозможно наказать пользователя \`${args[0]}\`.\nДанный пользователь не зарегистрирован у нас на сервере!`)
        }

        if(member.id === author.id) {
            return message.reply(`Вы не можете наказать самого себя!`)
        }

        const admin = member.roles.cache.some(role => role.id === roles.admin);
        const moder = member.roles.cache.some(role => role.id === roles.moder);

        if (admin || moder) {
            return message.channel.send(`Данного пользователя нельзя наказать, т.к. он является администратором.`)
        }

        if (!reason) {
            reason = `Не указана`
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Действие: Варн (${mem.warn+1}/3)`)
            .setDescription(`Наказан ${member} (${member.id})\nПричина: __${reason}__`)
            .setColor("#ff5f20")
            .setThumbnail('https://i.imgur.com/u5CtJeg.png')
            .setFooter(`Варн выдан администратором ${message.author.tag}`)
            .setTimestamp();
        let embedDM = new Discord.MessageEmbed()
            .setTitle(`Действие: Варн (${mem.warn+1}/3)`)
            .setDescription(`Вы были наказаны на сервере ${server}\nПричина: __${reason}__\nВаш ник: ${member}(${member.id})`)
            .setColor("#ff5f20")
            .setThumbnail('https://i.imgur.com/u5CtJeg.png')
            .setFooter(`Варн выдан администратором ${message.author.tag}`)
            .setTimestamp();

        let embedKICKDM = new Discord.MessageEmbed()
            .setTitle(`Действие: Кикнут с сервера`)
            .setDescription(`Вы были кикнуты с сервера ${server}\nПричина: __Варны (3/3)__\nВаш ник: ${member}(${member.id})`)
            .setColor("#ff5f20")
            .setThumbnail('https://i.imgur.com/tyxAdED.png')
            .setFooter(`Варн выдан администратором ${message.author.tag}`)
            .setTimestamp();
        let embedKICK = new Discord.MessageEmbed()
            .setTitle(`Действие: Кикнут с сервера`)
            .setDescription(`Наказан ${member} (${member.id})\nПричина: __Варны (3/3)__`)
            .setColor("#ff5f20")
            .setThumbnail('https://i.imgur.com/tyxAdED.png')
            .setFooter(`Кикнут системой`)
            .setTimestamp();

        member.send(embedDM)
            .catch(() => {
                message.channel.send(`Пользователь не был уведомлен о кике в ЛС. Возможно, у него отключены личные сообщения!`)
            })
            .then(() => {
                message.channel.send(embed)
                message.delete();
            });

        mem.warn++;

        if (mem.warn == 3) {
            mem.warn = 0;
                member.send(embedKICKDM)
                    .catch(() => {
                        message.channel.send(`Пользователь не был уведомлен о кике в ЛС. Возможно, у него отключены личные сообщения!`)
                    })
                    .then(() => {
                        message.channel.send(embedKICK);
                        member.kick()
                    });
        }

        mem.save();
    },
};