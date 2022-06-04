import { ExcludeEnum } from 'discord.js';
import { ActivityTypes } from 'discord.js/typings/enums';
import {bot, config} from '../index';

bot.on(`ready`, async() => {
    bot.guilds.cache.forEach(async (guild) => {
        console.log(`${guild} [${guild.id}] owned by ${(await guild.fetchOwner()).user.tag} [${(await guild.fetchOwner()).user.id}]`);
    });
    console.log(`----------------------------------`);
    console.log(`${config.bot.name} loaded!`);
    console.log(`Account ${bot.user.tag} is online on ${bot.guilds.cache.size} server(s)!`);
    console.log(`----------------------------------`);
    await bot.loadData();

    // Rotate Status
    if(config.bot.activity.rotateStatus && config.bot.activity.rotateEvery){
        bot.user.setActivity(config.bot.activity.status[0], {
            'type': (<ExcludeEnum<typeof ActivityTypes, `CUSTOM`>> config.bot.activity.type)
        });
        let i = 1;
        setInterval(async () => {
            bot.user.setActivity(config.bot.activity.status[i], {
                'type': (<ExcludeEnum<typeof ActivityTypes, `CUSTOM`>> config.bot.activity.type)
            });
            if(i + 1 == config.bot.activity.status.length) i = 0;
        }, config.bot.activity.rotateEvery);
    }
    else {
        bot.user.setActivity(config.bot.activity.status[0], {
            'type': (<ExcludeEnum<typeof ActivityTypes, `CUSTOM`>> config.bot.activity.type)
        });
    }

    // Load Commands in the Homeguild
    bot.CMDHandler.commands.forEach(async (cmd) => {
        bot.HomeGuild.commands.create({
            name: cmd.getElemOne(),
            description: cmd.getElemTwo().description,
            options: cmd.getElemTwo().options
        });

        if(!config.bot.globalCMDs) return;
        // Global Commands
        bot.application.commands.create({
            name: cmd.getElemOne(),
            description: cmd.getElemTwo().description,
            options: cmd.getElemTwo().options
        });
    });
});