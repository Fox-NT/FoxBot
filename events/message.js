const fs = require('fs');

module.exports = {
    name: 'message',
    execute(message) {
        console.log(`${message.author.tag} в #${message.channel.name} отправил: ${message.content}`);
        if (message.attachments.size > 0) {
            const img = message.attachments.find(img => img.name.endsWith('.png') || img.name.endsWith('.jpg') || img.name.endsWith('.jpeg') || img.name.endsWith('.bmp') || img.name.endsWith('.gif'))
            if (img) {
                if (message.channel.id != '844949716755677215') {
                    const msg = [`Оу, в этот канал нельзя отправлять картинки.`, `Используй для картинок другой канал.`, 'Стоп, стоп, стоп...', `Палехче, кидай в картинки в специальный канал.`]
                    message.delete();
                    return message.reply(`${msg[Math.floor(Math.random() * msg.length)]} `+`Для картинок есть отдельный канал <#844949716755677215>!`)
                        .then(m => m.react('844447427347742741')
                            .then(setTimeout(() => m.delete(), 5000)))
                        .catch('Произошла какая-то странная ошибка.')
                }
                message.react('844447365149622312');
            }
        }
    },
};