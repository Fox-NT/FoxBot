const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    aliases: ['помощь', 'хэлп', 'команды', 'command', 'commands'],
    description: 'Получить информацию о командах',
    cooldown: 2,
    args: false,
    access: 'Member',
    usage: '<пользователь>',
    guildOnly: false,
    execute(message, args) {
        const data = [];
        const com = new Map([]);
        const arr = [];

        const { commands } = message.client;

        if (!args.length) {
            data.push('Вот список всех возможных команд:');
            commands.forEach((command) => {
                com.set(`!${command.name}`, `${command.description}`);
            });
            for (let i of com) {
                arr.push(i.join(' - '));
            }

            data.push(`\`\`\`${arr.join(`\n`)}\`\`\``);

            data.push(`Ты можешь отправить \`${prefix}help [имя команды]\` для получения подробной информации о конкретной команде!`);

            return message.channel.send(`${data.join('\n')}`, { split: false });
                // .then(() => {
                //     if (message.channel.type === 'dm') return;
                //     message.reply(`Я отправил тебе в личное сообщение все свои команды!\nТы так же можешь написать \`${prefix}help [команда]\`  для получения конкретной информации о команде`);
                // })
                // .catch(error => {
                //     console.error(`Невозможно отправить сообщение в ЛС ${message.author.tag}.\n`, error);
                //     message.reply('Похоже, я не могу отправить тебе сообщение в ЛС, может они у тебя отключены? Проверь и попробуй еще раз!');
                // });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(`У нас нет такой команды.\nВведи \`!help\`, чтобы посмотреть список всех команд.`);
        }

        data.push(`**Команда:** ${command.name}`);

        if (command.aliases) data.push(`**Варианты команды:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Описание:** ${command.description}`);
        if (command.usage) data.push(`**Как использовать:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Перезарядка:** ${command.cooldown || 3} секунд(ы)`);

        if (command.guildOnly) {
            data.push(`\n**__Команду можно использовать только на сервере!__**`);
        } else {
            data.push(`\n**__Команду можно использовать на сервере и в личных сообщениях с ботом!__**`);
        }

        message.channel.send(data, { split: true });
    },
};