const http = require('http');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')
const { Markup } = require('telegraf');

const { getRequest, request } = require('./app/requests/requests.js');


let state = {};

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome! Send me a tracking code.'));
bot.help((ctx) => ctx.reply('Send me a tracking code.'));

bot.command('MyParcels', ctx => {
	const userId = ctx.message.from.id;
	if (!state[userId])
		state[userId] = { id: userId };

	const answerGet = getRequest(
		process.env.URL_API,
		process.env.PORT,
		'/parcels',
		response => {
			let data = '';
			response.on('data', chunk => data += chunk);
			response.on('end', () => {
				let answer = 'My parcels:\n';
				data = JSON.parse(data);

				if(data.length == 0)
					return ctx.replyWithMarkdown('Empty');

				data.map(x => answer += 'Token: ' + x['token'] + ', Status:' + x['status'] + '\n');
				
				return ctx.replyWithMarkdown(answer);
			});
		});
});


bot.on('text', ctx => {
	const userId = ctx.message.from.id;
	const token = ctx.message.text;

	if (!state[userId])
		state[userId] = { id: userId, token: token};

	return ctx.reply('Is the token correct?',
			Extra.HTML().markup(m =>
			m.inlineKeyboard([
				m.callbackButton('True', 'true'),
				m.callbackButton('False', 'false')
			])))
});

bot.on('callback_query', ctx => {
	const isVerifyToken = ctx.update.callback_query.data;	
	
	if (isVerifyToken === 'false')
		return ctx.reply('Send me a tracking code.');

	const userId = ctx.update.callback_query.from.id;
	const token = state[userId].token;

	const data = {
		userId:userId,
		token:token,
		status:'sent'
	};
	
	const answerPOST =  request(
				process.env.URL_API,
				process.env.PORT,
				'/parcels',
				'POST',
				JSON.stringify(data),
				response => {
					console.log("STATUS: " + response.statusCode);
			});

	return ctx.replyWithMarkdown('Okay!');
});

bot.launch();

