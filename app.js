
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')
const { Markup } = require('telegraf');
const { getRequest, request } = require('./app/requests/requests.js');
var http = require('http');

let state = {};

//'960357135:AAEbMc0d5133D16MUp3gVUEOm0h4al7Rq48'
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
			Extra.HTML().markup(m=>
			m.inlineKeyboard([
				m.callbackButton('True', 'true'),
				m.callbackButton('False', 'false')
			])))
});

bot.on('callback_query', ctx => {
//	console.log('callback');
	const isVerifyToken = ctx.update.callback_query.data;	
	
	if (isVerifyToken === 'false')
		return ctx.reply('Send me a tracking code.');

//	ctx.answerCallbackQuery('Wait...');

	const userId = ctx.update.callback_query.from.id;
	const token = state[userId].token

//	console.log(state[userId]);
	const data = {
		userId:userId,
		token:token,
		status:'arrived'
	}
//	console.log(JSON.stringify(data));
	const answerPOST =  request(process.env.URL_API,
				process.env.PORT,
				'/parcels',
				'POST',
				JSON.stringify(data),
				(response) => {
		console.log("STATUS: " + response.statusCode);

		//response.on('data', (d) => {
		//	process.stdout.write(d);
		//});
//		console.log('answerPOST: ' + answer);
	});
//console.log('Answer Post: ', answerPOST);

	return ctx.replyWithMarkdown('Okay');
});



bot.launch();

