
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Готово! Подключен как ${client.user.tag}`);
        client.user.setPresence({ activity: { name: '!help', type: 'WATCHING' }, status: 'dnd' });
    },
};