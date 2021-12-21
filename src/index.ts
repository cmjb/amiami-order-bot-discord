import * as discord from './discord/init';
import * as amiami from './amiami/index';
import {terminal} from 'terminal-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export function main() {
  let intervalTimeInMinutes = parseInt(process.env.SEARCH_INTERVAL_MINUTES || 5) * 60000;
  discord.init();
  setInterval(queueDiscordAmiAmiMessages, intervalTimeInMinutes);
  terminal.bold('amiami-order-bot messaging scheduled. \n');
  
  queueDiscordAmiAmiMessages();
}

function queueDiscordAmiAmiMessages() {
  terminal.bold("Syncing ami ami list \n")
  amiami.syncAmiAmiList().then(() => {
    terminal.bold("Posting new items to discord...\n");
    amiami.postAmiAmiList();
  })
 
}

main();
