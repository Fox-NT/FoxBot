const fs = require('fs');

module.exports = {
    name: 'reload',
    aliases: ['перезагрузка', 'релоад', 'ребут', 'restart', 'рестарт'],
    description: 'Перезагрузка команды (серверная)',
    args: true,
    access: 'Admin',
    usage: '<команда>',
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`Такая команда отсутствует \`${commandName}\`, ${message.author}!`);
        }
        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Команда \`${newCommand.name}\` перезагружена!`);
        } catch (error) {
            console.error(error);
            message.channel.send(`Произошла ошибка при перезагрузке команды \`${command.name}\`:\n\`${error.message}\``);
        }
    },
};