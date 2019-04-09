import { searchMDN } from 'mdn-search-docs';
import discord from 'discord.js';

exports.run = (client, message, args) => {
  const [...term] = args;
  let result = '';
  const collector = new discord.MessageCollector(
    message.channel,
    m => m.author.id === message.author.id,
    { time: 10000 }
  );
  searchMDN({ term })
    .then(res => {
      res.documents.forEach((r, i) => {
        result += `${i + 1}) ${r.title}\n`;
      });
      message.channel.send(` \`\`\`css\n${result}\`\`\` `);
      // eslint-disable-next-line no-shadow
      collector.on('collect', message => {
        if (!Number.isNaN(message.content) && message.content <= 10) {
          const test = res.documents[message.content - 1];

          message.channel.send({
            embed: {
              title: test.title,
              description: test.excerpt.replace(/<\/?[^>]+>/gi, ''),
              url: test.url,
            },
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
};
