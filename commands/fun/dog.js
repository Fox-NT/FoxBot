
module.exports = {
    name: 'dog',
    aliases: ['собака', 'пёс', 'пес', 'псина'],
    description: 'Обзозвать кого-нибудь собакой',
    cooldown: 2,
    args: true,
    access: 'Member',
    usage: '<пользователь>',
    guildOnly: true,
    execute(message, args) {
        message.reply(`Ха-ха-ха, ${args} собака :)`);

    },
};