const { REST } = require('@discordjs/rest');
const { Routes, PermissionFlagsBits } = require('discord-api-types/v9');

const [, , token, guildId, userId] = process.argv;

const rest = new REST({ version: '9' }).setToken(token);
(async () => {
  try {
    /** @type {import("discord-api-types").RESTGetAPIGuildResult} */
    const guild = await rest.get(
      Routes.guild(guildId),
    );
    if (guild.owner_id === userId) {
      console.log(`OK(requester is server owner)`);
      return;
    }
    /** @type {import("discord-api-types").RESTGetAPIGuildMemberResult} */
    const member = await rest.get(Routes.guildMember(guild.id, userId));

    const memberRoles = guild.roles.filter(role => member.roles.includes(role.id));
    const memberPermission = memberRoles.reduce((a, b) => a | BigInt(b.permissions), 0n);
    if (memberPermission & PermissionFlagsBits.Administrator) {
      console.log(`OK(requester has administrator permission)`);
      return;
    }
    if (memberPermission & PermissionFlagsBits.ManageGuild) {
      console.log(`OK(requester has manage guild permission)`);
      return;
    }
    console.log("Error");
    console.log(Object.entries(PermissionFlagsBits).filter(([k,v])=>{
      return v&memberPermission;
    }).map(e=>e[0]).join("\n"));
  } catch (error) {
    console.error(error);
  }
})();