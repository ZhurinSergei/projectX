const http = require('http');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')
const { Markup } = require('telegraf');
const axios = require('axios');

const { getRequest, request } = require('./app/requests/requests.js');


let state = {};
const addressAPI = 'http://' + process.env.URL_API + ':' + process.env.PORT;

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    const userId = ctx.message.from.id;
    if(!state[userId])
	state[userId] = {userId:userId, message:'', state:'start'};

    ctx.reply('Welcome! Send me a tracking code.')
});
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
	state[userId].state = 'MyParcels';

	const parcels = await getAllParcelsFromUser(userId);
	if(parcels.length == 0)
        	return ctx.reply('No parcels');

	const infoAboutParcels = getInfoAllParcels(parcels);
	return ctx.replyWithMarkdown(infoAboutParcels);
});

bot.command('deleteParcel', ctx => {
    const userId = ctx.message.from.id;
    state[userId].state = 'deleteParcel';

    ctx.reply('Send the token number you want to delete');
});

bot.on('text', ctx => {
	const userId = ctx.message.from.id;
	const text = ctx.message.text;

	if(!state[userId])
	    state[userId] = {userId:userId, message:text, state:'start'}
	state[userId].message = text;

	switch(state[userId].state) {
	    case 'start':
        	return ctx.reply('Is the token correct?',
			Extra.HTML().markup(m =>
			m.inlineKeyboard([
				m.callbackButton('True', 'new_token'),
				m.callbackButton('False', 'false')
			])));
	    case 'deleteParcel':
                return ctx.reply('Do you want to remove the token?',
                        Extra.HTML().markup(m =>
                        m.inlineKeyboard([
                                m.callbackButton('True', 'delete_token'),
                                m.callbackButton('False', 'false')
                        ])));
	}

});

bot.on('callback_query', async ctx => {
        const userId = ctx.update.callback_query.from.id;
	const callbackState = ctx.update.callback_query.data;

	if (callbackState === 'false') {
		state[userId].state = 'start';
		return ctx.reply('Send me a tracking code.');
	}

	const link = addressAPI + '/parcels';

	let response;
	switch(callbackState) {
	    case 'new_token':
		response = await axios.post(link,
					{userId:userId,
                			token:state[userId].message,
               				status:'sent'});
		break;

	    case 'delete_token':
		const parcels = await getAllParcelsFromUser(userId);
		const idTokenFromDelete = parcels[state[userId].message - 1]._id;

		response = await axios.delete(link + '/' + idTokenFromDelete);
		break;
	}

	return ctx.replyWithMarkdown('Okay!');
});

bot.launch();






