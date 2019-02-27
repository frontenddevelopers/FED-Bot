import discord from 'discord.js';
import config from './config.json';
import help from './messages/help.json';
import welcome from './messages/welcome.json';
import { searchMDN } from 'mdn-search-docs';

const client = new discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});
client.on('message', message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    if (!message.member.roles.some(r => ['Administrators'].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");

    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        let [...msg] = args;

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

    if (command === 'mdn') {
        let [...term] = args;
        let result = '';
        const collector = new discord.MessageCollector(
            message.channel,
            m => m.author.id === message.author.id,
            { time: 10000 }
        );
        searchMDN({ term: term })
            .then(res => {
                res.documents.forEach((r, i) => {
                    result += `${i + 1}) ${r.title}\n`;
                });
                message.channel.send('```css\n' + `${result}` + '```');
                collector.on('collect', message => {
                    if (
                        !Number.isNaN(message.content) &&
                        message.content <= 10
                    ) {
                        let test = res.documents[message.content - 1];

                        message.channel.send({
                            embed: {
                                title: test.title,
                                description: test.excerpt.replace(
                                    /<\/?[^>]+>/gi,
                                    ''
                                ),
                                url: test.url
                            }
                        });
                    } else {
                        message.channel.send(
                            'Invalid number. Please select  a number from the list.'
                        );
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

client.on('guildMemberAdd', member => {
    if (member.id) {
        client.users.get(member.id).send({
            embed: welcome.message
        });
    }
});

client.login(config.token);
