//const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
//const yup = require('yup');
//const rateLimit = require('express-rate-limit');
//const slowDown = require('express-slow-down');
const controller = require('./controller');
require('dotenv').config();

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 1337;

//const db = monk(process.env.MONGODB_URI || "mongodb://localhost:27017/mailpy-db");
//const conditionsCollection = db.get('conditions');
//const entriesCollection = db.get('entries');
//const groupsCollection = db.get('groups');


const app = express();

// Set the ip-address of your trusted reverse proxy server such as 
// haproxy or Apache mod proxy or nginx configured as proxy or others.
// The proxy server should insert the ip address of the remote client
// through request header 'X-Forwarded-For' as 'X-Forwarded-For: some.client.ip.address'
app.enable('trust proxy');//, '127.0.0.1');

app.use(cors());
app.use(helmet());
app.use(morgan('common')); // Request Logger
app.use(express.json());

// const notFoundPath = path.join(__dirname, 'public/404.html');
  
app.get('/groups', controller.getGroups);
app.get('/group:id', controller.getGroup);

app.get('/conditions', controller.getConditions);

app.get('/entries', controller.getEntries);
app.get('/entry:id', controller.getEntry);

app.get('/', (req, res, next) => {
    res.send('Mailpy - REST API');
});

/*
const mailpyEntry = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

app.post('/url', slowDown({
    windowMs: 30 * 1000,
    delayAfter: 1,
    delayMs: 500,
}), rateLimit({
    windowMs: 30 * 1000,
    max: 1,
}), async (req, res, next) => {
    let { slug, url } = req.body;
    try {
        await schema.validate({
            slug,
            url,
        });
        if (url.includes('cdg.sh')) {
            throw new Error('Stop it. 🛑');
        }
        if (!slug) {
            slug = nanoid(5);
        } else {
            const existing = await urls.findOne({ slug });
            if (existing) {
                throw new Error('Slug in use. 🍔');
            }
        }
        slug = slug.toLowerCase();
        const newUrl = {
            url,
            slug,
        };
        const created = await urls.insert(newUrl);
        res.json(created);
    } catch (error) {
        next(error);
    }
});
*/

/*
app.use((req, res, next) => {
    res.status(404).sendFile(notFoundPath);
});
*/

app.use((error, req, res, next) => {
    console.log("Use", error, req, res);
    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
});

app.listen(PORT, HOST, () => {
    console.log('Express server started on port %s at %s', PORT, HOST);
});