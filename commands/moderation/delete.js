
module.exports = {
    name: 'delete',
    aliases: ['удалить', 'очистить', 'clear', 'очистка'],
    description: 'Удалить сообщения в канале',
    cooldown: 10,
    args: true,
    access: 'Moder',
    usage: '<колво-сообщений>',
    guildOnly: true,
    permissions: 'MANAGE_MESSAGES',
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;
        if(isNaN(amount)) {
            return message.channel.send(`Ошибка, введите корректное число!`)
        } else if (amount < 2 || amount > 100) {
            return message.channel.send(`Ошибка! Вы не можете удалить менее 2 или более 99 сообщений! Введите другое число.`);
        }
        message.channel.send(`Очищаю...`);
        setTimeout(() => message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('Произошла ошибка при попытке удаления сообщений!');
        }), 1500);
        const arr = [2, 3, 4, 22, 23, 24, 32, 33, 34, 42, 43, 44, 52, 53, 54, 62, 63, 64, 72, 73, 74, 82, 83, 84, 92, 93, 94];
        const arr2 = [21, 31, 41, 51, 61, 71, 81, 91];
        let msg;
        for(let i = 0; i <= arr.length; i++) {
            if(amount-1 === arr[i]) {
                msg = "сообщения";
                break;
            } else {
                for(let i = 0; i <= arr2.length; i++) {
                    if(amount-1 === arr2[i]) {
                        msg = "сообщение";
                        break;
                    } else {
                        msg = "сообщений";
                    }
                }
            }
        }
        setTimeout(() => message.channel.send(`Замечательно! Удалено \`${amount-1} ${msg}\`!`).then(m => m.react('845233616631496735')), 2000);
        setTimeout(() => message.channel.bulkDelete(2), 7000);
    },
};