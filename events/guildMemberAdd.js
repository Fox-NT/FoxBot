const User = require('../data/user.js');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member, client) {
        const channel = member.guild.channels.cache.find(ch => ch.id === '843778839498588190');
        if (!channel) return;

        const roles = {
            id: '843779305598746644',
            name: 'Новичок'
        };
        member.roles.add('843779305598746644')
            .then(() => {

            })

        client.nodb = (user) => channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`К сожелению **${user.tag}** нету в базе-данных.`));

        let rolDB = member.roles.cache.map(r => r.id);
        let mem =  await User.findOne({ guildID: member.guild.id, userID: member.id, username: member.user.username });
        if(!mem) { await User.create({ guildID: member.guild.id, userID: member.id, roles: rolDB, username: member.user.username })}

            // mem.roles = rolDB;
            // mem.save();

        console.log(`Пользователю Ник:${member.user.username}, ID: ${member.id} была автоматически добавлена роль "${roles.name}" за верификацию`)
        // let embed = new discord.MessageEmbed()
        //     .setColor("#54ffa7")
        //     .setAuthor('Добро пожаловать на сервер G.o.D.','https://i.imgur.com/j2lX0Ga.jpg')
        //     .setDescription('Приветствуем тебя на нашем сервере')
        //     .addFields({ name: 'Здесь ты можешь найти полезную информацию о сервере и проекте.\n\u200C', value: '`\`\`Навигация по серверу\`\`\`\n' },
        //              { name: 'Информационный раздел:', value: '• <#843778839498588190> — верификация новых пользователей, навигация' +
        //                       '\n• <#781925829545558016> — правила сервера' +
        //                       '\n• <#844898770478301215> — выбор ролей' +
        //                       '\n• <#844897784331108403> — новости сервера' +
        //                       '\n• <#844922113931608086> — список команд нашего бота\n\u200C'},
        //         { name: 'Общение:', value: '\n• <#844949267760021525> — текстовый канал для общения' +
        //                 '\n• <#844949716755677215> — канал для обмена скриншотами, картинками' +
        //                 '\n• <#844949630356553729> — канал для управления музыкой' +
        //                 '\n• <#845279544495964210> — NSFM-канал\n\u200C' },
        //         { name: 'Верификация:', value: '\nНа данный момент для тебя доступно всего 2 канала.\nДля того, чтобы получить доступ ко всем \`закрытым\` каналам необходимо пройти \`верификацию\`\n\`\`\`Для прохождения верификации\`\`\`\n Нажмите на реакцию(<:accept:844448121479364608>) под этим сообщением' },
        //     )
        // channel.send(embed).then(m => m.react('844448121479364608'));
    },
};