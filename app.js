const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);

global.ViewEngine = require(__dirname+'/view-engine');

app.set('views', __dirname+'/views');
app.set('view engine', 'twig');
app.use(express.static(__dirname+'/public'));
app.use(cors({ origin : (origin, callback) => { callback(null, true) }, credentials: true }));
app.use((req, res, next) => {

	// added locals variable
	res.locals.app = {
		name: 'NodeJs Web Simple',
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
