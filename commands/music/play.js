const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const { prefix } = require('../../config.json');
const queue = new Map();

module.exports = {
    name: 'play',
    aliases: ['stop', 'skip'],
    description: 'Музыкальный бот',
    cooldown: 5,
    args: true,
    access: 'Member',
    usage: '<url>',
    guildOnly: true,
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        const url = args[0];
        if (!voiceChannel) {
            return message.channel.send(`Ошибка. Вы должны находиться голосовом канале, чтобы использовать данную команду!`);
        }
        const permission = voiceChannel.permissionsFor(message.client.user);
        if (!permission.has('CONNECT')) {
            return message.channel.send(`Ошибка. У бота нет прав для входа в канал.`);
        }
        if (!permission.has('SPEAK')) {
            return message.channel.send(`Ошибка. У бота нет прав для трансляции в канале!`);
        }

        const serverQueue = queue.get(message.guild.id);
        if(message.content.startsWith(`${prefix}play`)) {
            let song = [];
            if (ytdl.validateURL(url)) {
                const songInfo = await ytdl.getInfo((url));
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url
                }
            } else {
                const videoFinder = async (queue) => {
                    const videoResult = await ytSearch(queue);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await videoFinder(args.join(' '));
                if (video) {
                    song = {
                        title: video.title,
                        url: video.url
                    }
                } else {
                    message.channel.send(`Ошибка. Видео не найдено.`)
                }
            }
            if (!serverQueue) {
                const queueConstructor = {
                    voice_channel: voiceChannel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
                queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);

                try {
                    const connection = await voiceChannel.join();
                    queueConstructor.connection = connection;
                    video_player(message.guild, queueConstructor.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send(`Ошибка. Проблема в подключении...`);
                    throw  err;
                }
            } else {
                serverQueue.songs.push(song);
                return message.channel.send(`🎵**${song.title}** добавлена в очередь!`)
            }
        } else if (message.content.startsWith(`${prefix}skip`)) {
            skipSong (message, serverQueue);

        } else if (message.content.startsWith(`${prefix}stop`)) {
            stopSong (message, serverQueue);

        }
    }
};

const video_player = async (guild, song) => {
    const songQueue = queue.get(guild.id);

    if (!song) {
        songQueue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly'});
    songQueue.connection.play(stream, { seek: 0, volume: 0.5 })
        .on('finish', () => {
            songQueue.songs.shift();
            video_player(guild, songQueue.songs[0]);
        });
    await songQueue.text_channel.send(`🎵Сейчас играет: **${song.title}**`);
}

const skipSong = (message, serverQueue) => {
    if (!serverQueue) {
        return message.channel.send(`Ошибка. Очередь пуста!`)
    }
    serverQueue.connection.dispatcher.end();
}

const stopSong = (message, serverQueue) => {
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}