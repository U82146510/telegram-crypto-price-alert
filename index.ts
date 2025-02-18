import TelegramBot from "node-telegram-bot-api";
import WebSocket from "ws";
import dotenv from 'dotenv';
import { EventEmitter } from "events";
import {ws} from './crypto_api/crypto_api.ts';

dotenv.config();

class my_emiter extends EventEmitter{};
const emiter = new my_emiter();

if(!process.env.telegram_token){
    throw new Error('telegram token missing');
};

const token:string = process.env.telegram_token as string;
const bot:TelegramBot = new TelegramBot(token,{polling:true});

const subscribe = new Set<number>();
const low_value = new Map<string,number>();
const max_value = new Map<string,number>();

bot.onText(/\/start/,(msg)=>{
    const chat_id:number = msg.chat.id;
    bot.sendMessage(chat_id,'successfully subscribed');
});


// Menu event function of the bot.

bot.on('message',async(msg:TelegramBot.Message):Promise<void>=>{
    const chat_id:number = msg.chat.id;
    const text:string | undefined = msg.text?.toLowerCase();
    if(text==='start'){
        await start();
        subscribe.add(chat_id);
        bot.sendMessage(chat_id,'start monitoring');
        return;
    }
    if(text==='stop'){
        subscribe.delete(chat_id);
        bot.sendMessage(chat_id,'stop monitoring');
        return;
    }
    if(text?.split(':')[0]==='min'){
        const currency_pair:string = (text.split(':')[1] as unknown)as string;
        if(!currency_pair){
            bot.sendMessage(chat_id,'currency pair is missing. hint->min:currency_pair:price');
            return;
        }
        const min:number=parseFloat(text.split(':')[2]);
        if(!min){
            bot.sendMessage(chat_id,'the target price is missing. hint->min:currency_pair:price');
            return;
        }
        low_value.set(currency_pair,min);
        bot.sendMessage(chat_id,`set lowest price: ${currency_pair} ${min}`);
        return;
    }
    if(text?.split(':')[0]==='max'){
        const currency_pair:string = (text.split(':')[1] as unknown)as string;
        if(!currency_pair){
            bot.sendMessage(chat_id,'currency pair is missing. hint->min:currency_pair:price');
            return;
        }
        const max:number=parseFloat(text.split(':')[2]);
        if(!max){
            bot.sendMessage(chat_id,'the target price is missing. hint->min:currency_pair:price');
            return;
        }
        max_value.set(currency_pair,max)
        bot.sendMessage(chat_id,`set hiest price: ${currency_pair} ${max}}`);
        return;
    }
    if(text==='low'){
        const rs = low_value.entries();
        if(rs){
            for(const key of rs){
                bot.sendMessage(chat_id,`Low price: ${key[0]} is ${key[1]} `);
            }
        }
    }
    if(text==='high'){
        const rs = max_value.entries();
        if(rs){
            for(const key of rs){
                bot.sendMessage(chat_id,`High price: ${key[0]} is ${key[1]}`);
            }
        }
    }

    if(text){
        bot.sendMessage(chat_id,
           `Menu: 
            start   -start monitoring.
            stop    -stop  monitoring.
            high    -display the highiest prices.
            low     -display the lowiest prices.

            min:currency_pairs:price   -set the lowest price.
            max:currency_pairs:price   -set the highest price.`
            );
    }
});

// The binance websocket API part. 

const start = async()=>{

    ws.on('message',async(data:WebSocket.Data):Promise<void>=>{
        try {
            const trade_data = JSON.parse(data.toString());
            const name = (trade_data.data.s as string).toLowerCase();
            const live_price = parseFloat(trade_data.data.c as string);


            const lowest_price:number = low_value.get(name) as number;
            if(!lowest_price){
                low_value.set(name,Infinity)
            }
            if(lowest_price>live_price){
                low_value.set(name,live_price);
                emiter.emit('data',{name:name+": L ",price:live_price});
            }
            
            const hiest_price:number=max_value.get(name) as number;
            if(!hiest_price){
                max_value.set(name,0);
            }
            
            if(hiest_price<live_price){                
                max_value.set(name,live_price);
                emiter.emit('data',{name:name+": H ",price:live_price});
            }
        } catch (error) {
            console.log(error);
        }
        
    });
    
    
    
    emiter.on('data',<T,U extends string>(data:{name:T,price:U}):void=>{
        const chat_id:SetIterator<number> = subscribe.values();
        for(const value of chat_id){
            bot.sendMessage(value,`${data.name}: ${data.price}`);
        }
    });
}


