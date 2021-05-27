const User = require('../../data/user.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'remove-bd',
    aliases: ['bd-remove', 'бд-ремув'],
    description: 'Удалить пользователя из базы данных (серверная)',
    cooldown: 2,
    args: true,
    access: 'Admin',
    usage: '<пользователь>',
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    async execute(message, args) {
        const member = message.mentions.members.first();
        const user = args[0];
        const author = message.author;

        if (!user.startsWith('@') && !user.startsWith('<@')) {
            return message.channel.send(`Ошибка. Некорректно введен ник пользователя которого необходимо удалить из БД.\nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя]\``)
        }

        if (!member) {
            return message.channel.send(`Ошибка. Невозможно удалить пользователя \`${args[0]}\` из БД.\nДанный пользователь не зарегистрирован у нас на сервере!`)
        }
        let mem =  await User.findOne({ guildID: message.guild.id, userID: member.id });
        if(!mem) {
            return message.channel.send(`Ошибка. Данного пользователя нет в БД.`)
        }
        if(mem) {
            await User.deleteOne({ guildID: member.guild.id, userID: member.id })
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Действие: Удаление из БД`)
            .setDescription(`Пользователь ${member} (${member.id}) был успешно удален из БД.`)
            .setColor("#6d0101")
            .setThumbnail('https://i.imgur.com/nOL1mka.png')
            .setFooter(`Удален администратором ${author.username}`)
            .setTimestamp();

        message.channel.send(embed)

    },
};