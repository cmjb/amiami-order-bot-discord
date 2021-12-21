import { JSDOM } from "jsdom";
import axios from "axios";
import {createClient} from 'redis';
import * as discord from '../discord/init';

const client = createClient({
    url: 'redis://redis:6379'
});

client.connect();

client.on('error', (err) => console.log('Redis Client Error', err));

export async function syncAmiAmiList() {
    return new Promise((resolve, reject) => {
  
        axios.get(`https://www.amiami.com/files/eng/new_items/1001.html`)
        .then(response => {
            let dom = new JSDOM(response.data);
            let urlList = Array.from(dom.window.document.querySelectorAll("li>a")).map(node => {
                return node.getAttribute("href");
            });
            let nodeList = Array.from(dom.window.document.querySelectorAll("li>a")).map(node => {
                return node;
            });
            let imageurlList = Array.from(dom.window.document.querySelectorAll("img")).map(node => {
                return node.getAttribute("data-src");
            });
            
            parseAmiAmiList(urlList, imageurlList, nodeList);
            resolve(null);
            
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

export async function postAmiAmiList() {
    const client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    for await (const key of client.scanIterator()) {
        // use the key!
        let figureJson = await client.get(key);
        let figure = JSON.parse(figureJson || '{}');
        if(!figure.discordMessageSent) {
            discord.sendFigureEmbed(figure);
            figure.discordMessageSent = true;
            setKeyInRedis(figure.code, JSON.stringify(figure));
        }
      }
}

function parseAmiAmiList(urlList: (string | null)[], imageurlList: (string | null)[], nodeList: Element[]) {
    return new Promise((resolve, reject) => {

        let figurePromises: Promise<string | null>[] = [];
        
        urlList.forEach((value, key) => {
            let code = value?.split('=')[1];
            interface IFigure {
                code: string | undefined;
                url: string | null;
                imageurl: string | null;
                title: string | null;
                discordMessageSent: boolean;
            } 
            
            let figure: IFigure = {
                code: undefined,
                url: null,
                imageurl: null,
                title: null,
                discordMessageSent: false
            };
            if(code?.split('-')[0] === 'FIGURE') {
                imageurlList.forEach((link, index) => {
                    let fileName = link?.split('/')[link.split('/').length-1];
                    let codeInFileName = fileName?.split('.')[0];
                    if(codeInFileName === code)
                    {
                        figure['code'] = code;
                        figure['url'] = value;
                        figure['imageurl'] = link;

                        nodeList.forEach((val, k) => {
                            //console.log(value);
                            //console.log(val.getAttribute('alt'))
                            if(value === val.getAttribute('href')) {
                                //console.log(val.getAttribute('alt'));
                                //console.log(val);
                                figure['title'] = val.getAttribute('alt');
                                checkExistingInRedis(code).then((result) => {
                                    if(result === null) {
                                        let savePromise = setKeyInRedis(code, JSON.stringify(figure));
                                        figurePromises.push(savePromise);
                                    }                 
                                });
                            }
                        })
                        //console.log(figure);
    
                    }
                    //console.log(link?.split('/'))
                })
            }
            //console.log(code);
        });
        Promise.allSettled(figurePromises).then(() => {
            resolve(null);
        })
    });
}

async function checkExistingInRedis(item: string | undefined) {
    
    //client.on('error', (err) => console.log('Redis Client Error', err));
    
  
    //await client.set('key', 'value');
    if(!item) {
        return undefined;
    }

    let result = client.get(item);
    console.log(result);
    
    return result;
}

async function setKeyInRedis(itemKey: string | undefined, item: string | undefined) {
    
    
  
    //await client.set('key', 'value');
    if(!item || !itemKey) {
        return null;
    }
    let result = client.set(itemKey, item);
    console.log(result);
    
    return result;
}


function parseAmiAmiItemForDiscord() {

}