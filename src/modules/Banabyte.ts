/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-arrow-callback */
import * as Discord from 'discord.js';
import {bot, config} from '../index';

let whiteCheckMark = `✅`;
const filter = (reaction) => {
    return [whiteCheckMark].includes(reaction.emoji.name);
};

export class Banabyte {
    guildID: string;
    constructor(guildID: string){
        this.guildID = guildID;
    }

    async BeginAutomod (): Promise<void> {
        console.log(`[AUTOMOD] Automod Enabled and Started!`);

        let botTerms = [
            `check my bio`,
            `lgbtq safe space in bio`,
            `open my profile 18+ only`,
            `@everyone`,
            `safe space in bio`,
            `click my bio`,
            `check out my bio`,
            `join this server`,
            `join my server`
        ];

        let UserSet = new Set();
        bot.on(`messageCreate`, async (message) => {
            if(message.guild.id !== this.guildID) return;
            if(!message.member ||! message.member.roles) return;
            if(message.member.roles.cache.size > 1 ||! message.member.kickable) return;
            let contentDetected = false;

            let termFound: string = null;
            botTerms.forEach(term => {
                if(message.content.toLowerCase().includes(term)){
                    contentDetected = true;
                    termFound = term;
                }
            });

            if(contentDetected && config.home.automod) {
                if(!UserSet.has(message.author.id)){
                    UserSet.add(message.author.id);
                    setTimeout(async function(){
                        UserSet.delete(message.author.id);
                    }, 10 * 60 * 1000);
                    let replyMsg = (await message.reply(`:x: Your message was deleted because it may be a spam message. Posting this again may result in a kick!\n*If you believe that this message is a mistake, please urgently contact ${bot.owner.tag}*`));
                    setTimeout(async () => {replyMsg.delete();}, 7000);
                    message.delete();
                }
                else {
                    message.member.kick(`Automod - Blacklisted Term`);
                    message.delete();
                    UserSet.delete(message.author.id);
                    try {
                        let reportChannel = (<Discord.TextChannel> (await bot.channels.fetch(config.home.logs))) || null;
                        if(!reportChannel) return;
                        let reportEmbed = new Discord.MessageEmbed();
                        reportEmbed.setAuthor({name: config.bot.name, iconURL: bot.user.avatarURL()});
                        reportEmbed.setTitle(`Autokick - Blacklisted Term`);
                        reportEmbed.setColor(bot.colors.get(`red`));
                        reportEmbed.setThumbnail(message.author.avatarURL());
                        reportEmbed.addField(`Kicked User`, `<@${message.author.id}> ${message.author.tag} (${message.author.id})`);
                        reportEmbed.addField(`Blacklisted Term Found`, `${termFound}`);
                        reportEmbed.addField(`Offending Message`, `${message.content}`);
                        reportEmbed.setTimestamp();
                        let reportMsg = await reportChannel.send({embeds: [reportEmbed],  content: `Press ${whiteCheckMark} to ban this user!`});
                        reportMsg.react(`${whiteCheckMark}`);
                        reportMsg.awaitReactions({filter, max:2, time: 3 * 60 * 1000}).then(async (collected) => {
                            let firstReaction = collected.first();
                            let usrArr: string[] = [];
                            (await firstReaction.users.fetch()).filter(usr => !usr.bot).mapValues(usr => (usrArr.push(usr.tag)));
                            if(firstReaction.count >= 2){
                                message.guild.bans.create(message.author.id, {'reason': `Banned by ${usrArr.join(`, `)} - Voted on spam message`});
                                let banEmbed = new Discord.MessageEmbed();
                                banEmbed.setAuthor({name: config.bot.name, iconURL: bot.user.avatarURL()});
                                banEmbed.setTitle(`Banned - Automod Vote/React Ban`);
                                banEmbed.setColor(bot.colors.get(`red`));
                                banEmbed.setThumbnail(message.author.avatarURL());
                                banEmbed.addField(`Banned User`, `<@${message.author.id}> ${message.author.tag} (${message.author.id})`);
                                banEmbed.addField(`Banned By`, `${usrArr.join(`, `)}`);
                                banEmbed.setTimestamp();
                                await reportMsg.reply({embeds: [banEmbed]});
                            }
                        });
                    }
                    catch {null;}
                }

            }
        });
    }

    async Welcomer (): Promise<void> {
        console.log(`[WELCOMER] Welcomer Enabled and Started!`);

        bot.on(`guildMemberAdd`, async (member) => {
            if(member.guild.id !== this.guildID) return;

            // Welcome Users to Banabyte
            let welcomeChannel = (<Discord.TextChannel> (await member.guild.channels.cache.find(n => n.name.toLowerCase().includes(`welcome`)))) || null;
            let welcomeEmbed = new Discord.MessageEmbed();
            welcomeEmbed.setAuthor({name: config.bot.name, iconURL: bot.user.avatarURL()});
            welcomeEmbed.setTitle(`:wave: Welcome to the Banabyte Network!`);
            welcomeEmbed.setColor(`#${(Math.floor(Math.random()*16777215).toString(16))}`); // Random Color
            welcomeEmbed.setThumbnail(member.user.avatarURL());
            welcomeEmbed.addField(`Hello There`, ` ${member.user}`);
            welcomeEmbed.setFooter({'text': `Member Count: ${member.guild.memberCount}`, 'iconURL': `https://cdn.discordapp.com/emojis/766877243745632256`});
            welcomeEmbed.setTimestamp();
            await welcomeChannel.send({embeds: [welcomeEmbed]});
        });
    }
}