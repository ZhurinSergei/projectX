const Telegraf = require('telegraf');

const bot = new Telegraf('960357135:AAEbMc0d5133D16MUp3gVUEOm0h4al7Rq48');
bot.start((ctx) => ctx.reply('Welcome!'));
//bot.help((ctx) => ctx.reply('Send me a sticker'));
//bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();