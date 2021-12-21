import {Client, Intents, TextChannel} from "discord.js";
import * as commands from './commands';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


export async function init() {
  console.log('Discord init.');
  await client.login(process.env.DISCORD_TOKEN);
}

export async function sendMessage(channelId: string, message: string) {
  console.log(channelId);
  if(channelId === '918839313440075777')
  {
    console.log('tes');
  }



  //console.log(client.channels.cache.values());
  let cchannel = await client.channels.cache.find(channel => channel.id === channelId) as TextChannel;
  console.log(cchannel);
  //cchannel.send(message);
}

async function send(channelId: string, data: any) {
  await client.guilds.fetch('889824033615536188').then(server => {
    client.channels.fetch(channelId).then((channel) => {
      let textChannel = <TextChannel> channel;
      console.log(channel);
      textChannel.send(data);
    });
  })
}

interface IFigure {
  code: string | undefined;
  url: string | null;
  imageurl: string | null;
  title: string | null;
  discordMessageSent: boolean;
} 

export async function sendFigureEmbed(figure: IFigure) {

    if(figure.discordMessageSent) {
      return null;
    }
//   let figure: IFigure = {
//     code: undefined,
//     url: null,
//     imageurl: null,
//     title: null
// };

  const figureEmbed = {
    color: 0x0099ff,
    title: 'New item added to store!',
    url: 'https://www.amiami.com' + figure.url,
    author: {
      name: 'amiami english',
      icon_url: 'https://www.amiami.com/favicon.png',
      url: 'https://www.amiami.com' + figure.url,
    },
    description: figure.title,
    thumbnail: {
      url: figure.imageurl,
    },
    fields: [
      {
        name: 'Newly posted figure',
        value: figure.title || 'Figure title missing.',
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
    ],
    image: {
      url: figure.imageurl,
    },
    timestamp: new Date(),
    footer: {
      text: 'Made with love by Ximf',
      icon_url: 'https://cdn.discordapp.com/avatars/724254812484665365/a_2cb3b618b48478b2bdd32e05d1ef18ba.webp?size=32',
    },
  };
  
  send(process.env.DISCORD_CHANNEL || '', {embeds: [figureEmbed]});
}