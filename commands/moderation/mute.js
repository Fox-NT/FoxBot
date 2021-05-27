const Discord = require("discord.js");
const { prefix } = require('../../config.json');

module.exports = {
    name: 'mute',
    aliases: ['мут', 'заглушить', 'замутить', 'мьют', 'замьютить'],
    description: 'Замутить пользователя на канале!',
    cooldown: 2,
    args: true,
    access: 'Moder',
    usage: '<пользователь> <время> <причина>',
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
            return message.channel.send(`Ошибка. Некорректно введен ник пользователя которого необходимо замутить.\nИспользуйте пример: \`${prefix}${this.name} [@имя-пользователя] [время(в минутах)] [причина]\``)
        }

        if (!member) {
            return message.channel.send(`Ошибка. Невозможно замутить пользователя \`${args[0]}\`.\nДанный пользователь не зарегистрирован у нас на сервере!`)
        }

        if (member.id === author.id) {
            return message.reply(`Ошибка. Вы не можете замутить самого себя!`)
        }

        let mem =  await User.findOne({ guildID: message.guild.id, userID: member.id });

        if (!reason) {
            reason = 'Не указана';
        }

        if (!time) {
            time = 3600000;
        }
        const date = Date.now();
        const unmute = date + time;

        let embed = new Discord.MessageEmbed()
            .setTitle("Действие: Замучен на сервере")
            .setDescription(`**Замучен** ${member} (${member.id})\n**Время**: ${time/1000/60} минут(а).\n**Причина**: __${reason}__`)
            .setColor("#525151")
            .setThumbnail('https://i.imgur.com/P7gqD6x.png')
            .setFooter(`Мут выдан администратором ${message.author.tag}`)
            .setTimestamp();

        let embedDM = new Discord.MessageEmbed()
            .setTitle("Действие: Замучен на сервере")
            .setDescription(`Вы были замучены на сервере ${server}\n**Время**: ${time/60000} минут(а)\n**Причина**: __${reason}__\n**Ваш ник**: ${member}(${member.id})`)
            .setColor("#525151")
            .setThumbnail('https://i.imgur.com/P7gqD6x.png')
            .setFooter(`Мут выдан администратором ${message.author.tag}`)
            .setTimestamp();

        member.send(embedDM)
            .catch(() => {
                message.channel.send(`Пользователь не был уведомлен о муте в ЛС. Возможно, у него отключены личные сообщения!`)
            })
            .then(() => {
                message.channel.send(embed)
            })
            .then(() => {
                rolDB = member.roles.cache.map(r => r.id);
                member.roles.set([])
                    .then(() => {
                        member.roles.add(roles.muted);
                        console.log(`Пользователю Ник:${member.user.username}, ID: ${member.id} была добавлена роль "Muted"`);
                        console.log(`У пользователя Ник:${member.user.username}, ID: ${member.id} была сняты все роли`);
                        console.log(`Пользователю ${user.username}(${user.userID}) выдан мут на ${time/60000} мин.`);

                        mem.roles = rolDB;
                        mem.mute = true;
                        mem.unmute = unmute;
                        mem.save();
                    });
                // member.roles.add(roles.muted).then(() => {
                //     member.roles.remove(roles.main);
                // })
            });

    },
};