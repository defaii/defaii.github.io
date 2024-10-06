const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs');
const config = require('../../config.json');
const ytdl = require('@distube/ytdl-core');
const axios = require('axios');
const queues = new Map();

// Charger les variables d'environnement depuis le fichier .env

const cookies = [
        {
            "domain": ".youtube.com",
            "expirationDate": 1761843672.056623,
            "hostOnly": false,
            "httpOnly": false,
            "name": "__Secure-1PAPISID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "Ue90_yNc9fe8VRNH/APEZbtdDwGed0r1uK",
            "id": 1
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1761843672.056726,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-1PSID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "g.a000oQgESWpEuViwIynTJXNjmah1ztzhTx5e9tlFHpKjRp9XT2U1tVAuMqPhcOUhSbjH2VKZ5wACgYKAWMSARcSFQHGX2Mi_0tsSJWEZhqH98gv6EWj2xoVAUF8yKqXLMubu_j9jPmnRUx7E_QH0076",
            "id": 2
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1759711075.223082,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-1PSIDCC",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "AKEyXzWG6Vu14HTzNrbVvAXbxshKS0O5cp-oh5jemlXFltw0dx3rkj-KFIVIZb3WDId1EJox7WpE",
            "id": 3
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1759710600.100566,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-1PSIDTS",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "sidts-CjIBQlrA-OXqeplI9Q6Z2ZyVNuycz3eHl9lQCOER76aPx8XosKvUZcXR2V_ui7uy7afyvhAA",
            "id": 4
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1761843672.05664,
            "hostOnly": false,
            "httpOnly": false,
            "name": "__Secure-3PAPISID",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "Ue90_yNc9fe8VRNH/APEZbtdDwGed0r1uK",
            "id": 5
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1761843672.056742,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-3PSID",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "g.a000oQgESWpEuViwIynTJXNjmah1ztzhTx5e9tlFHpKjRp9XT2U16XUeDS63JlLf8ReztEiBagACgYKAQISARcSFQHGX2Mi6WF-swBFeidrkDAx7YNdXhoVAUF8yKr4M0j2e2Mtn8iDGHZdqNRi0076",
            "id": 6
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1759711075.223108,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-3PSIDCC",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "AKEyXzXqvcLszRXk18vQCSo4PYyrcUsNzFoFJssfzIIFKqZuvNRoSxLyGXzaQkeHGy0awgj2cN0Z",
            "id": 7
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1759710600.100663,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-3PSIDTS",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "sidts-CjIBQlrA-OXqeplI9Q6Z2ZyVNuycz3eHl9lQCOER76aPx8XosKvUZcXR2V_ui7uy7afyvhAA",
            "id": 8
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1733484101.034696,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-BUCKET",
            "path": "/",
            "sameSite": "lax",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "CMAF",
            "id": 9
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1758994681.248126,
            "hostOnly": false,
            "httpOnly": false,
            "name": "_ga",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "GA1.1.1845182154.1722783396",
            "id": 10
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1757343403.359438,
            "hostOnly": false,
            "httpOnly": false,
            "name": "_ga_M0180HEFCY",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "GS1.1.1722783396.1.0.1722783403.0.0.0",
            "id": 11
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1758994683.382959,
            "hostOnly": false,
            "httpOnly": false,
            "name": "_ga_VCGEPY40VB",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "GS1.1.1724434681.1.1.1724434683.58.0.0",
            "id": 12
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1730397551,
            "hostOnly": false,
            "httpOnly": false,
            "name": "_gcl_au",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "1.1.169986628.1722621552",
            "id": 13
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1761843672.056591,
            "hostOnly": false,
            "httpOnly": false,
            "name": "APISID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "vjwERE1m1Xl7GS-p/AYddglla0jQhbnGDg",
            "id": 14
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1728175670,
            "hostOnly": false,
            "httpOnly": false,
            "name": "CONSISTENCY",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "AKreu9vcc4nplYdd1YB6PemUAr3SUytU8eL3OyHoQ7rJuVcy0zt8UpUc_cTYZP5DOG6bD6Ty6gsYacF53pngpcYCqcrhHpinHFMyPvo87E5iLeb1CjoBhhARTP0OljuYe0rL9n__Fm_9m0iWEv7kGc5BmhYV3wo4PGnd8Vg4jeOWMMR-lS7-U8RbQxbkWoljrEtO5cAZdXywNVRE",
            "id": 15
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1761843672.056502,
            "hostOnly": false,
            "httpOnly": true,
            "name": "HSID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "AsTygPK1GucO70MfL",
            "id": 16
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1762735062.851411,
            "hostOnly": false,
            "httpOnly": true,
            "name": "LOGIN_INFO",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "AFmmF2swRQIhAPSXPyo4rOtuUDyNG-KgrILBwiOXqd0Hx8pZOaRU2mdxAiBCL_8NkkkULi_dp_rmLdSPd6whXKUTpWET9MAYfEuOxA:QUQ3MjNmeWJUN3FUSlo4bm90QXNTZXpiTUdVVWF6eHRmTWhELWUyZjJyLWVLSElQLTNnU0p4UmlyZkEzdFlpWXQ0dmcwcERPWWwzd0FpS19SVEZ0Mjd3dFlOekk3SWFrMkF4LTVkczJRcWtFcm1URG5vSmdoMGFTSXdUc0dCQmxoNGxBREJha0c4elZBcXlZRHVobElNRURkUFlObnlBcXhR",
            "id": 17
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1743986267.029005,
            "hostOnly": false,
            "httpOnly": true,
            "name": "NID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "518=S3YAgRZgdhWWo_XwySTbxRSvaOFixOWcnZ6wPvlbz1z00wyq2KhwM8aBiXgOl_ko9Tot3YWa-6o9LXy7gWzmDwHQJHZU4uDv5q45Hi7h9HgjI_u3xKdi1gOInMfqsHJswDVmUtVewIKRDTJl-C5N_2b0M9JllRIe65K8pVYt_pIluHG8wqpXClmPJejqy7I1jtWS9qhhenevAlEjfrfqj1NVUqI_TXh23gblG2kt9ZGZeSgDpY3NUwWQEbKkQucjmKgVMHh1NuVJ2sVVXeGA_izAni5q3_y6FcLgiX7evr7lCtL7Wmct5IW0_fvog-8bDBald-_64mnfAmFPftabrG_CPF-B8fG20GluKooQVS4m",
            "id": 18
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1762735070.906554,
            "hostOnly": false,
            "httpOnly": false,
            "name": "PREF",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "f6=40000000&f7=100&tz=Europe.Paris&f5=30000&repeat=NONE&f4=4000000",
            "id": 19
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1761843672.056609,
            "hostOnly": false,
            "httpOnly": false,
            "name": "SAPISID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "Ue90_yNc9fe8VRNH/APEZbtdDwGed0r1uK",
            "id": 20
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1761843672.05671,
            "hostOnly": false,
            "httpOnly": false,
            "name": "SID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "g.a000oQgESWpEuViwIynTJXNjmah1ztzhTx5e9tlFHpKjRp9XT2U1DxS9g-UoeMMbjCWiqUeR-gACgYKAQkSARcSFQHGX2MihGnTVixVPr6_r9i5Hkk1gxoVAUF8yKr-UY0Bv92NwndRUqKzmWBv0076",
            "id": 21
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1759711075.222974,
            "hostOnly": false,
            "httpOnly": false,
            "name": "SIDCC",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "AKEyXzUtbNm56H-X5kxz59DCBbW4FZWT9tZvUcpAg4JPTuJ7gpf7nsGzPM4-oqyz4SatYcPQXMk",
            "id": 22
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1752060101.03459,
            "hostOnly": false,
            "httpOnly": false,
            "name": "SOCS",
            "path": "/",
            "sameSite": "lax",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "CAISEwgDEgk2NDA1MjE4ODAaAmZyIAEaBgiA4ZOzBg",
            "id": 23
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1761843672.056574,
            "hostOnly": false,
            "httpOnly": true,
            "name": "SSID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "ARtzdcXBOYg4rOotC",
            "id": 24
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1743605184.050101,
            "hostOnly": false,
            "httpOnly": true,
            "name": "VISITOR_INFO1_LIVE",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "GN0MDg6f3iw",
            "id": 25
        },
        {
            "domain": ".youtube.com",
            "expirationDate": 1743605184.050251,
            "hostOnly": false,
            "httpOnly": true,
            "name": "VISITOR_PRIVACY_METADATA",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "CgJCRRIcEhgSFhMLFBUWFwwYGRobHB0eHw4PIBAREiEgDw%3D%3D",
            "id": 26
        },
        {
            "domain": ".youtube.com",
            "hostOnly": false,
            "httpOnly": true,
            "name": "YSC",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": true,
            "storeId": "0",
            "value": "oZz6vyCl4y8",
            "id": 27
        }
]

let reply_msg = "";
let ephemeral_option = "";

const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('pause_musique')
            .setLabel('Pause')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('skip_musique')
            .setLabel('Skip')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('stop_musique')
            .setLabel('Stop')
            .setStyle(ButtonStyle.Danger)
    );

const agentOptions = {
    pipelining: 5,
    maxRedirections: 0,
    localAddress: "127.0.0.1",
    };

const agent = ytdl.createAgent(cookies, agentOptions);
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Jouer de la musique depuis YouTube')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Url youtube')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Mets le message visible que par toi')
                .setRequired(false))
        .setDMPermission(false),
    player: createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    }),
    queues,
    playNextSong,
    run: async (interaction, client) => {
        
        const voiceChannel = interaction.member.voice.channel;
        const textChannel = interaction.channel;
        const url = interaction.options.getString('url');
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;

        if (textChannel.id !== config.discord.channel.bot) {
            return interaction.reply({ content: `Vous devez être dans le channel <#${config.discord.channel.bot}> pour utiliser cette commande`, ephemeral: true });
        }
        if (!voiceChannel) {
            return interaction.reply({ content: `Vous devez être dans un salon vocal pour écouter de la musique !`, ephemeral: true });
        }
        if (!url.includes("youtu")) {
            return interaction.reply({ content: `Veuillez fournir un lien YouTube valide`, ephemeral: true });
        }
        if (url.includes("playlist")) {
            return interaction.reply({ content: `Veuillez fournir un lien du type \`https://www.youtube.com/watch?v={videoId}&list={playlistId}\``, ephemeral: true });
        }
        if (url.includes("start_radio")) {
            return interaction.reply({ content: `Le bot n'accepte pas les radio youtube, merci de regarder pour avoir une vrai playlist`, ephemeral: true });
        }

        await interaction.deferReply({ ephemeral });

        if (url.includes("&list=")) {
            return getPlaylistVideos(url, "", [], interaction, voiceChannel);
        } else {
            return lancerMusique(url, voiceChannel, interaction);
        }
    },
}

function playNextSong(interaction, guildId) {
    const serverQueue = queues.get(guildId);
    const guild = interaction.guild;
    const voiceChannel = guild.channels.cache.get(serverQueue.connection.joinConfig.channelId);

    if (!voiceChannel) {
        console.error('Le canal vocal n\'existe pas dans le serveur associé.');
        return;
    }

    if (serverQueue && serverQueue.connection) {
        if (serverQueue.songs.length > 0) {
            const currentSong = serverQueue.songs[0];
            const stream = ytdl(currentSong.url, { filter: 'audioonly', highWaterMark: 1 << 25 }, {agent});
            const resource = createAudioResource(stream);
            const embed = new EmbedBuilder()
                .setTitle('Musique actuelle')
                .setDescription(` `)
                .addFields(
                    { name: "Titre de la musique", value: `${currentSong.title}` },
                    { name: "Lien de la musique", value: `${currentSong.url}` },
                    { name: "Durée", value: `${currentSong.duration}` }
                )
                .setImage(currentSong.thumbnails.high.url)
                .setColor('#3498db');

            if (serverQueue.nowPlayingMessage) {
                serverQueue.nowPlayingMessage.edit({ embeds: [embed] }).catch(console.error);
            } else {
                voiceChannel.send({ embeds: [embed], components: [row] }).then(message => {
                    serverQueue.nowPlayingMessage = message;
                }).catch(console.error);
            }

            serverQueue.player.play(resource);
        } else {
            if (serverQueue.nowPlayingMessage) {
                serverQueue.nowPlayingMessage.delete().catch(console.error);
            }
            setTimeout(() => {
                serverQueue.connection.destroy();
                queues.delete(guildId);
            }, 3000);
        }
    }
}

async function getPlaylistVideos(playlistUrl, nextPageToken = '', urlVideos = [], interaction, voiceChannel) {
    const maxResults = 100;
    const playlistId = playlistUrl.match(/list=([a-zA-Z0-9_-]+)/)[1];
    let apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=AIzaSyBU8AGu0cCI2Ce-mDUG34nHPto2DWoEfDU`;

    if (nextPageToken) {
        apiUrl += `&pageToken=${nextPageToken}`;
    }

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        data.items.forEach(video => {
            urlVideos.push(`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`);
        });

        if (data.nextPageToken) {
            await getPlaylistVideos(playlistUrl, data.nextPageToken, urlVideos, interaction, voiceChannel);
        } else {
            lancerPlaylist(urlVideos, interaction, voiceChannel);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la playlist:', error);
        interaction.followUp({ content: 'Erreur lors de la récupération de la playlist.', ephemeral: true });
    }
}

async function lancerPlaylist(urlArray, interaction, voiceChannel) {
    for (const url of urlArray) {
        try {
            await lancerMusique(url, voiceChannel, interaction);
        } catch (error) {
            console.error('Erreur lors du lancement d\'une musique de la playlist :', error);
        }
    }
}

async function lancerMusique(urlMusique, voiceChannel, interaction) {
    try {
        const donneeMusique = await getYouTubeVideoDetails(urlMusique);
        const connection = getVoiceConnection(interaction.guildId);
        let serverQueue = queues.get(interaction.guildId);

        if (!serverQueue) {
            serverQueue = { songs: [], connection: null, player: null };
            queues.set(interaction.guildId, serverQueue);
        }

        const newSong = { url: urlMusique, title: donneeMusique.videoTitle, duration: donneeMusique.duration, thumbnails: donneeMusique.thumbnails};
        serverQueue.songs.push(newSong);

        if (!serverQueue.connection) {
            const newConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            serverQueue.connection = newConnection;
            serverQueue.player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });

            serverQueue.connection.subscribe(serverQueue.player);

            serverQueue.player.on(AudioPlayerStatus.Idle, () => {
                serverQueue.songs.shift();
                if (serverQueue.songs.length > 0) {
                    playNextSong(interaction, interaction.guildId);
                } else {
                    serverQueue.connection.destroy();
                    queues.delete(interaction.guildId);
                    if (serverQueue.nowPlayingMessage) {
                        serverQueue.nowPlayingMessage.delete();
                    }
                }
            });

            playNextSong(interaction, interaction.guildId);
        } else if (serverQueue.player.state.status === 'paused') {
            serverQueue.player.unpause();
        }

        const embedInteractionReply = new EmbedBuilder()
            .setTitle("Musique Ajoutée à la file d'attente")
            .addFields(
                { name: "Titre de la musique", value: `${donneeMusique.videoTitle}` || "Pas de titre" },
                { name: 'Auteur', value: `${donneeMusique.videoAuthor}` || "Pas d\'auteur" },
                { name: 'Lien', value: `${donneeMusique.videoUrl}` || 'Pas de lien' },
                { name: 'Durée', value: `${donneeMusique.duration}` || 'Pas de durée' }
            )
            .setImage(donneeMusique.thumbnails.high.url)
            .setColor('#3498db');

        await interaction.editReply({ embeds: [embedInteractionReply], ephemeral: interaction.options.getBoolean('ephemeral') || false });
    } catch (error) {
        console.error('Erreur lors du lancement de la musique :', error);
        interaction.editReply({ content: 'Erreur lors du lancement de la musique.', ephemeral: true });
    }
}

async function getYouTubeVideoDetails(videoUrl) {
    try {
        const videoId = getYouTubeVideoId(videoUrl);
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyBU8AGu0cCI2Ce-mDUG34nHPto2DWoEfDU&part=snippet,contentDetails`;
        const response = await axios.get(apiUrl);
        const videoData = response.data.items[0];
        const videoTitle = videoData.snippet.title;
        const videoAuthor = videoData.snippet.channelTitle;
        const duration = convertime(videoData.contentDetails.duration)
        const thumbnails = videoData.snippet.thumbnails; // Récupération des miniatures

        // Vous pouvez maintenant accéder à différentes tailles de miniatures
        // Par exemple, thumbnails.default.url pour la miniature par défaut
        // thumbnails.medium.url pour la miniature de taille moyenne, etc.

        return { videoTitle, videoAuthor, videoUrl, duration, thumbnails };
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la vidéo :', error);
        throw new Error('Erreur lors de la récupération des détails de la vidéo.');
    }
}


function getYouTubeVideoId(videoUrl) {
    const match = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

function convertime(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    let duree = `${hours}:${minutes}:${seconds}`
    return duree
}

async function musiqueSkip(interaction) {
    const connection = getVoiceConnection(interaction.guildId);
    const serverQueue = queues.get(interaction.guildId);

    if (!connection || !serverQueue || serverQueue.songs.length === 0) {
        return interaction.reply({ content: 'Il n\'y a pas de chanson en cours de lecture ou dans la file d\'attente.', ephemeral: true });
    }

    try {
        serverQueue.player.stop();
        await new Promise(resolve => {
            serverQueue.player.once(AudioPlayerStatus.Idle, () => resolve());
        });

        if (serverQueue.songs.length > 0) {
            interaction.reply({ content: 'Chanson suivante !', ephemeral: true });
        } else {
            interaction.reply({ content: 'Il n\'y a plus de chansons dans la file d\'attente.', ephemeral: true });
        }
    } catch (error) {
        console.error('Erreur lors du passage à la chanson suivante :', error);
        interaction.reply({ content: 'Une erreur est survenue lors du passage à la chanson suivante.', ephemeral: true });
    }
}