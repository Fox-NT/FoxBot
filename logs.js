const fs = require('fs');

const currentdate = new Date();
const datetime = "Время: " + currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " | "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds() + " | ";

const trueLog = console.log;
console.log = function(msg) {
    fs.appendFile("log.log", "\n"+`${datetime}` + msg, function(err) {
        if(err) {
            return trueLog(err);
        }
    });
    trueLog(msg); //uncomment if you want logs
}