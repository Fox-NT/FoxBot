const User = require('../../data/user.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'add-bd',
    aliases: ['bd-add', 'адд-бд', 'add-бд'],
    description: 'Добавить пользователя в базу данных (серверная)',
    cooldown: 5,
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
            return message.channel.send(`Ошибка. Некорректно введен ник пользователя которого необходимо добавить в БД.\nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя]\``)
        }

        if (!member) {
            return message.channel.send(`Ошибка. Невозможно добавить пользователя \`${args[0]}\` в БД.\nДанный пользователь не зарегистрирован у нас на сервере!`)
        }

        let mem =  await User.findOne({ guildID: message.guild.id, userID: member.id });
        if(mem) {
            return message.channel.send(`Ошибка. Данный пользователь уже содержится в БД.`)
        }
        let rolDB = member.roles.cache.map(r => r.id);
        if(!mem) {
            User.create({ guildID: member.guild.id, userID: member.id, roles: rolDB, username: member.user.username
            })}

        let embed = new Discord.MessageEmbed()
            .setTitle(`Действие: Добавление в БД`)
            .setDescription(`Пользователь ${member} (${member.id}) был успешно добавлен в БД.`)
            .setColor("#92ff55")
            .setThumbnail('https://i.imgur.com/nOL1mka.png')
            .setFooter(`Добавлен администратором ${author.username}`)
            .setTimestamp();

        message.channel.send(embed)

    },
};