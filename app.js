const Telegraf = require('telegraf');
const { Markup } = require('telegraf');
const { GET, request } = require('./app/requests/requests.js');
var http = require('http');

let state = {};

//'960357135:AAEbMc0d5133D16MUp3gVUEOm0h4al7Rq48'
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome! Send me a tracking code.'));
bot.help((ctx) => ctx.reply('Send me a tracking code.'));

app.on('text', ctx => {
	const userId = ctx.message.from.id;
	const token = ctx.message.text;

	if (!state[userId])
		state[userId] = { id: userId, token: token};

	return ctx.reply(link, 
			Markup.inlineKeyboard([
				Markup.callbackButton('True', true),
				Markup.callbackButton('False', false),
			]).extra())
});

app.on('callback_query', ctx => {
	const isVerifyToken = ctx.update.callback_query.data;	
	
	if (!isVerifyToken)
		return ctx.reply('Send me a tracking code.');

	ctx.answerCallbackQuery('Wait...');
	
	const userId = ctx.update.callback_query.from.id;
	const token = state[userId].token
	
	const answerPOST = GET(process.env.URL_API, process.env.PORT, '/parcels', (response) => {
		var answer = '';

		response.on('data', chunk => answer += chunk);
		response.on('end', () => {
			console.log('answerPOST: ' + answer);
		});
	});
	
	console.log('answerPOST: ' + answer);

	return ctx.replyWithMarkdown('Okay');
});

app.command('MyParcels', ctx => {
	const userId = ctx.message.from.id;
	if (!state[userId])
		state[userId] = { id: userId };
	
	const answerGet = GET(process.env.URL_API, process.env.PORT, '/parcels', (response) => {
		var answer = '';

		response.on('data', chunk => answer += chunk);
		response.on('end', () => {
			console.log('answer: ' + answer);
		});
	});
	
	console.log('answerGet: ' + answer);
	
	return ctx.replyWithMarkdown(answerGet);
});



bot.launch();
