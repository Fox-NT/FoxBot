module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async execute(messageReaction, user) {
        const message = messageReaction.message;
        const messageID = '845305982955421746';
        let roleDB;
        const emoji = {
            id: '844448121479364608',
            name: 'accept'
        };
        const roles = {
            newbie: {
                id: '843779305598746644',
                name: 'Новичок'
            },
            mortals: {
                id: '371234280174649355',
                name: 'Смертные'
            }
        };
        const member = message.guild.members.cache.get(user.id);

        let mem =  await User.findOne({ guildID: message.guild.id, userID: member.id });
        if (message.id == messageID) {

            if (member.roles.cache.some(role => role.id === roles.mortals.id)) {
                return console.log(`Пользователю Ник:${member.user.username}, ID: ${member.id} невозможно выдать роль "${roles.mortals.name}", роль у него уже имеется.`)
            }
            if (messageReaction.emoji.id === emoji.id) {
                console.log(`Пользователю Ник:${member.user.username}, ID: ${member.id} была автоматически добавлена роль "${roles.mortals.name}"`)
                member.roles.add(roles.mortals.id)
                    .then(() => {
                        member.roles.remove(roles.newbie.id)
                            .then(() => {
                            rolDB = member.roles.cache.map(r => r.id);

                            mem.roles = rolDB;
                            mem.save();
                        });
                    })
                console.log(`У пользователя Ник:${member.user.username}, ID: ${member.id} была автоматически снята роль "${roles.newbie.name}"`)
            }
        }
    },
};