
module.exports = {
    name: 'hello',
    aliases: ['хай', 'хэй', 'привет', 'hi'],
    description: 'Поприветствовать бота',
    cooldown: 2,
    args: false,
    access: 'Member',
    guildOnly: false,
    execute(message, args) {
        message.reply(`Привет!`);
    },
};