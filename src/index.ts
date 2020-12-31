import { Client, GuildChannel, Message } from 'discord.js';
import * as dotenv from 'dotenv';
import { playerSplit } from './playerSplit';

dotenv.config({ path:  __dirname + '/../.env'});

const channelWatch: Map<String, Array<GuildChannel>> = new Map();

const client = new Client();
client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
    console.log('Bot started');
});

client.on('voiceStateUpdate', (oldState, newState) => {  
    if (!channelWatch.has(newState.guild.id))
        return;
    
    const channels = channelWatch.get(newState.guild.id);
    if (oldState.channel && channels.some(channel => channel === oldState.channel)) {
        if (oldState.channel.members.size === 0) {
            oldState.channel.delete();
            const remainingChannels = channels.filter(channel => channel !== oldState.channel);
            if (remainingChannels.length === 1 && remainingChannels[0].type === 'category') {
                remainingChannels[0].delete();
                channelWatch.delete(oldState.guild.id);
            } else {
                channelWatch.set(oldState.guild.id, remainingChannels);
            }
        }
    }
});


client.on('message', (msg: Message) => {
    if (!msg.content.startsWith(process.env.PREFIX))
        return;
    
    const [command, ...args] = msg.content.substring(process.env.PREFIX.length, msg.content.length).split(' ');

    switch (command) {
        case 'ping':
            msg.reply('Pong!');
            break;
        
        case 'split':
            playerSplit(msg).then(channels => {
                if (channels && channels.length !== 0) {
                    channelWatch.set(msg.guild.id, channels);
                }
            });
            break;
        case 'joss':
            msg.channel.send('https://www.amazon.ca/s?k=extra+joss&ref=nb_sb_noss_1');
            break;
        case 'gagzone':
            msg.reply('I destroyed that piece of shit');
            break;
        case 'help':
            msg.channel.send(
`list of commands :
!joss
!split
!gagzone`
            );
            break;
        default:
            msg.reply(`Invalid command! Type ${process.env.PREFIX}help for a list`);
            break;
    }
});
