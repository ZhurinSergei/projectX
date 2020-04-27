function getRequest(url, port, path, callback) {
	const https = require('http');
	const options = {
		hostname: url,
		port: port,
		path: path,
		method: 'GET'
		}

	const req = https.request(options, callback);

	req.on('error', error => {
		console.error(error);
	})

	req.end();
return req;
}

function request(url, port, path, method, data, callback) {
	const https = require('http');

	const options = {
		hostname: url,
		port: port,
		path: path,
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length
		}
	}

//console.dirxml(options);
	
	const req = https.request(options, callback);

	req.on('error', error => {
		console.error('error ' + error);
	})

console.dirxml(data);
	req.write(data);
	req.end();

	return req;
}

module.exports = {getRequest, request};
