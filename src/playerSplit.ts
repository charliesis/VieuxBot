import { GuildChannel, GuildMember, Message } from 'discord.js';

export async function playerSplit(msg: Message) {
    if (!msg.member.voice.channel) {
        msg.reply('You are not in a voice channel');
        return;
    }

    const members = msg.member.voice.channel.members.array().filter(member => !member.user.bot);

    const teams: Array<Array<GuildMember>> = chunkSplit(members, 4);
    const guild = msg.guild;

    const addedChannels: GuildChannel[] = [];
    const catChannel  = await guild.channels.create(`Split`, {type: 'category'});
    for (let i = 0; i < teams.length; ++i) {
        const vChannel = await guild.channels.create(`Split ${i}`, {type: 'voice', parent: catChannel});
        teams[i].forEach(member => member.voice.setChannel(vChannel));
        addedChannels.push(vChannel);
    }

    addedChannels.push(catChannel);

    return addedChannels;
}

function chunkSplit(arr: Array<any>, chunkSize: number) {
    arr = shuffle(arr);
    let maxTeams = Math.floor(arr.length / chunkSize) + 1;
    
    const split: Array<Array<any>> = [];
    for (let i = 0; i < maxTeams; ++i)
        split.push([]);
    
    let i = 0;
    while(arr.length !== 0) {
        split[i % maxTeams].push(arr.pop());
        i++;
    }

    return split;
}

function shuffle(array: Array<any>) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
