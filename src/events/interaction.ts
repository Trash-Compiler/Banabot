/* eslint-disable @typescript-eslint/no-var-requires */
import { CommandInteraction } from 'discord.js';
import {bot} from '../index';

bot.on(`interaction`, async(interaction) => {
    if(!interaction.isCommand()) return; // Ignore non-commands
    let CMDToRun = require(bot.CMDHandler.commands.get(interaction.commandName.toLowerCase()).getElemThree());

    if(!interaction.memberPermissions.has(CMDToRun.settings.perm)){
        return interaction.reply({ content: `:x: You cannot run that command because you are lacking the permission \`${CMDToRun.settings.perm}\`!`, ephemeral: true });
    }

    CMDToRun.run((<CommandInteraction> interaction));
});