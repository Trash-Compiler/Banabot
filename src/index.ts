// Banabot by sev & Banabyte Team
// Licensed under GNU GPL 3.0 https://www.gnu.org/licenses/gpl-3.0.en.html

// Import third party dependencies
import * as dotenv from 'dotenv';
import * as Discord from 'discord.js';

// Configure dotenv
dotenv.config({path: `secret.env`});

// Import first party dependencies
import * as configuration from './config';
import BotFramework from './handlers/Bot';
import { Banabyte } from './modules/Banabyte';

// Setup Intents + Bot
const allIntents = new Discord.Intents(32767);
export let bot = new BotFramework({intents: allIntents});
export let config = configuration.default;

let BanabyteFeatures = new Banabyte(config.home.guild);
if(config.home.automod){
    console.log(`[AUTOMOD] Autmod enabled!`);
    BanabyteFeatures.BeginAutomod();
}

else console.log(`[AUTOMOD] Disabled automod as per config settings!`);

BanabyteFeatures.Welcomer();

// Start the bot
bot.login(config.bot.token);