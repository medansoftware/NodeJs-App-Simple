const express = require('express');
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
const workSheetsFromFile = xlsx.parse(`${__dirname}/sample1.xlsx`);
const target_sheet = 0;
var last_i = 0;

// console.log(workSheetsFromFile[target_sheet].data)
for (i = 3; i < workSheetsFromFile[target_sheet].data.length; i++) {
	if (last_i < 1) {
		last_i = i+2;
		// console.log(i, i+1, i+2);
		console.log(workSheetsFromFile[target_sheet].data[i+1])
		console.log(workSheetsFromFile[target_sheet].data[i+2])
	} else {
		// console.log(i, last_i+1, last_i+2)
		console.log(workSheetsFromFile[target_sheet].data[last_i+1])
		console.log(workSheetsFromFile[target_sheet].data[last_i+2])
		last_i = last_i+2;
	}
	console.log('============================')
}

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
