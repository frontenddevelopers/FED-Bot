/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import discord from 'discord.js';
import Enmap from 'enmap';
import fs from 'fs';
import config from './config.json';

const client = new discord.Client();

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.commands = new Enmap();

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const props = require(`./commands/${file}`);
    const commandName = file.split('.')[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.login(config.token);
