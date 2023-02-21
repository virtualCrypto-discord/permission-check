const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const [, , token] = process.argv;

const rest = new REST({ version: '9' }).setToken(token);
(async () => {
  const guilds = [];
  let after = "0";
  for (; ;) {
    console.log(after);
    const t = await rest.get(Routes.userGuilds(), {
      query: new URLSearchParams({
        after
      })
    });
    guilds.push(...t);
    if (!t?.length) {
      break;
    }
    after = t.at(-1).id;
  }
  const res = {
    supported: [],
    non_supported: []
  };
  for (const guild of guilds) {
    console.log(guild);
    (guild.features.includes('APPLICATION_COMMAND_PERMISSIONS_V2') ? res.non_supported : res.supported).push(guild);
  }
  process.stdout.write(JSON.stringify(res));
  console.log(res.supported);
  console.error(`${res.supported.length}/${res.non_supported.length}`)
})();