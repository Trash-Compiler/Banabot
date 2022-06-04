import * as dotenv from 'dotenv';
dotenv.config({path: `secret.env`});

let config = {
    "home": {
        "guild": ``,
        "logs": ``,
        "automod": false
    },
    "roles": {
        "staff": ``,
        "owner": ``,
        "manager": ``
    },
    "bot": {
        "name": `Banabot`,
        "activity": {
            rotateStatus: true,
            rotateEvery: 30 * 1000,
            // If rotateStatus is enabled, it will cycle between these. Otherwise it will use the first element
            status: [`The Banabyte Network`, `Family Guy`, `Steins;Gate`, `sev's dungeon`, `Typescript Tutorials`, `you`],
            type: `WATCHING`
        },
        "owner": `258757935377809409`,
        "token": process.env.BOT_TOKEN,
        "globalCMDs": false,
        "addURL": `https://discord.com/api/oauth2/authorize?client_id=[CLIENT ID HERE]&permissions=8&scope=bot%20applications.commands`
    }
};

export default config;
