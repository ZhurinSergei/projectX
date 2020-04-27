
const http = require('http');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')
const { Markup } = require('telegraf');
const axios = require('axios');

const { getRequest, request } = require('./app/requests/requests.js');


let state = {};
const addressAPI = 'http://' + process.env.URL_API + ':' + process.env.PORT;

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome! Send me a tracking code.'));
bot.help((ctx) => ctx.reply('Send me a tracking code.'));

const getAllParcelsFromUser = async (userId) => {
    const link = addressAPI + '/parcels';
    const response = await axios.get(link);

    let parcels = response.data;
    parcels = parcels.filter(x => x.userId === userId);

    return parcels;
}

const getInfoAllParcels = parcels => {
    let info = 'My parcels:\n';
    parcels.map((currentValue, index) =>
	info += (index + 1) + ') Token: ' + currentValue['token'] + ', Status:' + currentValue['status'] + '\n');

    return info;
}

bot.command('MyParcels', async (ctx) => {
	const userId = ctx.message.from.id;

	const parcels = await getAllParcelsFromUser(userId);
	if(parcels.length == 0)
        	return ctx.replyWithMarkdown('No parcels');

	const infoAboutParcels = getInfoAllParcels(parcels);
	return ctx.replyWithMarkdown(infoAboutParcels);
});

bot.command('deleteParcels', ctx => {
 

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

