const User = require('../../data/user.js');
const { prefix } = require('../../config.json');
const config = require('../../config.json')
module.exports = {
    name: 'get-xp',
    aliases: ['дать-опыт', 'дать-хп', 'дать-эксп', 'give-exp'],
    description: 'Добавить опыта пользователю для повышения уровня',
    cooldown: 2,
    args: true,
    access: 'Admin',
    usage: '<пользователь> <колво-опыта>',
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    async execute(message, args) {
        const member = message.mentions.members.first();
        const user = args[0];
        const count = +args[1];
        const author = message.author;

        if (!user.startsWith('@') && !user.startsWith('<@')) {
            return message.channel.send(`Ошибка. Некорректно введен ник пользователя которому необходимо дать опыт.\nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя] [кол-во опыта]\``)
        }

        if (!member) {
            return message.channel.send(`Ошибка. Невозможно дать опыт пользователю \`${args[0]}\`.\nДанный пользователь не зарегистрирован у нас на сервере!`)
        }

        if (!count) {
            return message.channel.send(`Ошибка. Вы не указали количество опыта, которое хотите дать.`)
        }

        if(isNaN(count)) {
            return message.channel.send(`Ошибка. Вы ввели не число.`)
        }
        let mem =  await User.findOne({ guildID: message.guild.id, userID: member.id });
        if(!mem) {
            User.create({ guildID: member.guild.id, userID: member.id, username: member.user.username
            });
            message.channel.send(`Ошибка. Данный пользователь отсутствовал в базе данных и был успешно добавлен. Попробуйте еще раз!`);
            return }

        mem.xp += +count;

        let embedXP = new Discord.MessageEmbed()
            .setTitle(`Действие: Выдача опыта`)
            .setDescription(`Пользователю ${member} (${member.id}) был выдан опыт. \nКоличество: ${count} XP`)
            .setColor("#fd01d9")
            .setThumbnail('https://i.imgur.com/3tHawLp.png')
            .setFooter(`Опыт выдан администратором ${author.username}`)
            .setTimestamp();

        message.channel.send(embedXP)

        const level = mem.level;
        const formula = Math.floor(100*Math.pow(1.1, level));
        if(mem.xp >= formula){
            let embed = new Discord.MessageEmbed()
                .setColor(config.color)
                .setDescription(`[:tada:] Поздравим **${message.author.username}** с новым уровнем!`)
            message.channel.send(embed)
            mem.xp -= formula;
            mem.level += 1;
        }
        mem.save();
    },
};