const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const webpush = require('web-push');

global.ViewEngine = require(__dirname+'/view-engine');

app.set('views', __dirname+'/views');
app.set('view engine', 'twig');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));
app.use(cors({ origin : (origin, callback) => { callback(null, true) }, credentials: true }));
app.use((req, res, next) => {

	// added locals variable
	res.locals.app = {
		name: 'Service Worker Push',
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
	res.render('home.twig');
})
.post('/', async (req, res) => {
	webpush.setVapidDetails('mailto:agungmasda29@gmail.com', req.body.vapid.public, req.body.vapid.private);
	const subscription = JSON.parse(req.body.subscription);
	const notification = req.body.notification;
	var status = new Array();
	const notification_sent = (key, resolve) => {
		status.push({ key: key.toString(), status: 'sent' });
		resolve(key);
	}

	const notification_not_sent = (key, error, resolve) => {
		status.push({ key: key.toString(), status: 'not-sent', error: error });
		resolve(key);
	}
	if (Array.isArray(subscription)) {
		const promises = new Array()
		subscription.forEach(async (val, key) => {
			promises.push(new Promise((resolve, reject) => {
				webpush.sendNotification(val, JSON.stringify(notification)).then(sent => {
					notification_sent(key, resolve);
				}).catch(error => {
					notification_not_sent(key, { code: error.statusCode, message: error.body }, resolve);
				});
			}));
		});

		await Promise.all(promises);
		res.json(status);
	} else {
		webpush.sendNotification(subscription, JSON.stringify(notification)).then(sent => {
			res.json({ sent: true });
		}).catch(error => {
			res.json({ error: { code: error.statusCode, message: error.body } });
		});
	}
})
.get('/vapid_key', (req, res) => {
	res.render('vapid_key.twig', {
		vapid: webpush.generateVAPIDKeys()
	});
})
.get('/about', (req, res) => {
	res.render('about.twig');
})
.get('/contact', (req, res) => {
	res.render('contact.twig', {
		name: 'Developer'
	});
});

http.listen(process.env.PORT || 8080);
