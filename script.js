// const fs = require('fs');
// const ms = require('ms')

// const config = require('./config.json')
// global.Discord = require('discord.js');
// global.mongoose = require('mongoose');
// global.Guild = require("./data/guild.js");
// global.User = require('./data/user.js');

const a = document.querySelectorAll('text'),
    username = 'FoxNT',
    userid = '#2122',
    userrank = '#12',
    userlevel = '77';
a[1].innerHTML = `${username} <tspan style="fill: #7F8384" font-size="12">${userid}</tspan>`
a[0].innerHTML = `
        <tspan fill="white">
            RANK
            <tspan font-size="30">
                ${userrank}
            </tspan>
        </tspan>
        <tspan fill="#2ecc71">
            LEVEL
            <tspan font-size="30">${userlevel}</tspan>
        </tspan>`

console.log(a[0]);