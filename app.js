const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const xlsx = require('node-xlsx').default;

global.ViewEngine = require(__dirname+'/view-engine');

app.set('views', __dirname+'/views');
app.set('view engine', 'twig');
app.use(express.static(__dirname+'/public'));
app.use(cors({ origin : (origin, callback) => { callback(null, true) }, credentials: true }));
app.use((req, res, next) => {

	// added locals variable
	res.locals.app = {
		name: 'Data Generator',
		vendor: 'Medan Software',
		version: 'v1.0.0'
	}

	res.render = (file, options = {}) => {
		Object.assign(options, res.locals); // merge option variable to local variable
		const Twig = new ViewEngine.Twig(__dirname+'/views'); // assign template paths

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

// console.log(xlsx)
// const workSheetsFromFile = xlsx.parse(`${__dirname}/sample1.xlsx`);
// const active_sheet = 1;
// const sheetOptions = {'!merges': [range]};

// var last_i = 0;

// console.log(workSheetsFromFile[active_sheet].data);
// for (i = 3; i < workSheetsFromFile[active_sheet].data.length; i++) {
// 	if (last_i < 1) {
// 		last_i = i+2;
// 		// console.log(i, i+1, i+2);
// 		console.log(workSheetsFromFile[active_sheet].data[i+1])
// 		console.log(workSheetsFromFile[active_sheet].data[i+2])
// 	} else {
// 		// console.log(i, last_i+1, last_i+2)
// 		console.log(workSheetsFromFile[active_sheet].data[last_i+1])
// 		console.log(workSheetsFromFile[active_sheet].data[last_i+2])
// 		last_i = last_i+2;
// 	}
// 	console.log('============================')
// }

var laporan = ['LP/11RES/1.8/2020/', 'Tgl 08 Januari 2020'];
	var kasus_dan_pasal = ['362 KUHP', 'Pencurian Biasa'];
	var tkp = 'Alamat';
	var motif = 'Dengan cara';
	var uraian = 'Pada hari';
	var korban = 'Nama Korban';
	var tersangka = 'Data Diri tersangka';
	var barang_bukti = ['Barang1', 'Barang2'];
	var keterangan = 'Tahap II';


var array_random = function(array) {
	var random = Math.floor(Math.random() * array.length);
	return array[random];
}

var random_integer = function(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var data = new Array();

const moment_timezone = require('moment-timezone');
const moment = require('moment');
const faker = require('faker');
moment.tz.setDefault(process.env.TIMEZONE || 'Asia/Jakarta');
faker.locale = 'id_ID';

for (i = 0; i < 10; i++)  {

	var gender = array_random(['male', 'female']);
	data[i] = new Object;

	var num = (i+1);
	if (num < 10) {
		num = '0'+num;
	}

	var section = array_random(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']);

	data[i]['laporan'] = ['LP/'+(num)+'/'+section+'/RES.'+random_integer(1, 4)+'.'+random_integer(1, 40)+'/2021'];
	data[i]['tersangka'] = [faker.name.firstName(gender)+' '+faker.name.lastName(gender)];
	data[i]['korban'] = [faker.name.firstName(gender)+' '+faker.name.lastName(gender)];
	data[i]['tkp'] = [faker.address.streetAddress(true)];
}

console.log(data)

app.get('/', (req, res) => {
	res.render('home.twig', {
		name: 'Developer'
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
