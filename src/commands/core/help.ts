import * as Discord from 'discord.js';
import {CommandSettings} from '../../util/CommandSettings';
import {bot, config} from '../../index';

export let settings: CommandSettings = {
    name: `help`,
    description: `Displays the command list along with other relevant information`,
    perm: `SEND_MESSAGES`,
    options: [],
    category: `CORE`
};
// TODO - MAKE THIS LOOKUP STUFF
export let run = async function (interaction: Discord.CommandInteraction): Promise<void> {
    let cmdObjs = {};
    bot.CMDHandler.commands.forEach(cmd => {
        if(!cmdObjs[cmd.getElemTwo().category]){
            cmdObjs[cmd.getElemTwo().category] = [cmd.getElemOne()];
        }
        else {
            cmdObjs[cmd.getElemTwo().category].push(cmd.getElemOne());
        }
    });
        let reportEmbed = new Discord.MessageEmbed();
        reportEmbed.setAuthor({name: config.bot.name, iconURL: bot.user.avatarURL()});
        if(bot.application.botPublic) reportEmbed.author.url = config.bot.addURL;
        reportEmbed.setTitle(`Help - Commands List`);
        reportEmbed.setColor(bot.colors.get(`yellow`));
        reportEmbed.setThumbnail(interaction.guild.iconURL());
        for(let prop in cmdObjs){
            reportEmbed.addField(prop, `\`\`\`${cmdObjs[prop].join(`,\n`)}\`\`\``, true);
        }
        reportEmbed.addField(`Developed by`, bot.owner.tag, false);
        reportEmbed.setTimestamp();
        interaction.reply({embeds: [reportEmbed]});
    return;
};