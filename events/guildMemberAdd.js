import welcome from '../messages/welcome.json';

module.exports = (client, member) => {
  if (member.id) {
    client.users.get(member.id).send({
      embed: welcome.message,
    });
  }
};
