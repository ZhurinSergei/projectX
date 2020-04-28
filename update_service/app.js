const axios = require('axios');

const addressAPI = 'http://' + process.env.URL_API + ':' + process.env.PORT;
const getAllParcels = async () => {
    const link = addressAPI + '/parcels';
    const response = await axios.get(link);

    return response.data;
}

const update = () => {
	const parcels = await getAllParcels();
	console.log(parcels);
}

setInterval(60000, update);