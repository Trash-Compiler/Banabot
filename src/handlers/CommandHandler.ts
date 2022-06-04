/* eslint-disable @typescript-eslint/no-var-requires */
import { Collection } from 'discord.js';
import { CommandSettings } from '../util/CommandSettings';
import Triple from '../util/Triple';
import glob from 'glob';
import path from 'path';

// Loading in all of the commands
export class CommandHandler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: Collection<string, Triple<string, CommandSettings, string>>;
    constructor(){
        this.commands = new Collection();
        console.log(`[COMMANDS] Command loader started!`);
        this.loadCommands();
    }

    private loadCommands(): void {
        const dir = (path.join(__dirname, `../commands/`)).replace(/\\/g, `/`);
        glob(`${dir}/**/*.*`, {absolute: false}, (error, files) => {
            files = files.filter(f => f.endsWith(`.js`) || f.endsWith(`.ts`));
            if (files.length < 1) return console.log(`[WARNING] There are no commands to load...`);
            let fileRegexTS = new RegExp(/\/{0}([A-z-/\d]){1,100}([^A-z.ts]){1}/g); // converts the whole url path to just fileName
            let fileRegexJS = new RegExp(/\/{0}([A-z-/\d]){1,100}([^A-z.js]){1}/g); // converts the whole url path to just fileName
            let i = 0;
            console.log(`[COMMANDS] Loading ${files.length} Commands...`);
            files.forEach(async f => {
                let formattedCommand:string = f.replace(fileRegexTS, ``).replace(fileRegexJS, ``);
                let cmdObj = require(f);
                this.commands.set(cmdObj.settings.name.toLowerCase(), new Triple(cmdObj.settings.name.toLowerCase(), cmdObj.settings, f));
                console.log(`[COMMANDS] ${i + 1}: ${formattedCommand} loaded!`);
                i++;
            });

        });
        return;
    }
}