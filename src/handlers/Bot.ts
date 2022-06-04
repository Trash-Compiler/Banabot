import * as Discord from 'discord.js';
import { CommandHandler } from './CommandHandler';
import config from '../config';
import { EventHandler } from './EventHandler';

export default class Bot extends Discord.Client {
    config: object;
    CMDHandler: CommandHandler;
    EventHandler: EventHandler;
    HomeGuild: Discord.Guild;
    owner: Discord.User;
    colors: Map<string, Discord.ColorResolvable>;

    constructor(options: Discord.ClientOptions){
        super(options);
        this.config = config;

        // CMD and Event Handler
        this.CMDHandler = new CommandHandler();
        this.EventHandler = new EventHandler();

        // Fill in the color map
        this.colors = new Map();
        let objColors = {
            "darkRed": `750000`,
            "red": `ff0400`,
            "darkBlue": `000da7`,
            "blue": `00c5ff`,
            "purple": `bd00ff`,
            "lime": `1fff00`,
            "darkGreen": `007525`,
            "black": `000000`,
            "white": `ffffff`,
            "yellow": `FFF700`
        };
        for(let prop in objColors){
            this.colors.set(prop, objColors[prop]);
        }
    }

    async loadData(): Promise<void>{
        this.owner = await this.users.fetch(config.bot.owner);
        this.HomeGuild = this.guilds.cache.get(config.home.guild);
        return;
    }
}