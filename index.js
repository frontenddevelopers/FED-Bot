const discord = require("discord.js");
const client = new discord.Client();
const config = require("./config.json");
const help = require("./messages/help.json");
const welcome = require("./messages/welcome.json");

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    if (!message.member.roles.some(r => ["Administrators"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");

    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "help") {
        let [person, msg] = args;

        for (let cmd in help) {
            if (help.hasOwnProperty(cmd)) {
                if (msg === cmd) {
                    message.channel.send({
                        embed: help[cmd]
                    });
                }
            }
        }
    }
});

client.on("guildMemberAdd", member => {
    if (member.id) {
        client.users.get(member.id).send({
            embed: welcome.message
        });
    }
});

client.login(config.token);
