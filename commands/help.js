import help from '../messages/help.json';

exports.run = (client, message, args) => {
  const [, cmd] = args;
  if (Object.prototype.hasOwnProperty.call(help, cmd)) {
    message.channel.send({
      embed: help[cmd],
    });
  }
};
