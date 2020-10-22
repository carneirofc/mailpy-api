//const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const controller = require('./controller');

class App {

    constructor() {
        this.express = express();

        this.midlewares();
        this.routes();
    }

    midlewares(){
        // Set the ip-address of your trusted reverse proxy server such as 
        // haproxy or Apache mod proxy or nginx configured as proxy or others.
        // The proxy server should insert the ip address of the remote client
        // through request header 'X-Forwarded-For' as 'X-Forwarded-For: some.client.ip.address'
        this.express.enable('trust proxy');

        this.express.use(cors());   // CORS
        this.express.use(helmet()); // Nice to have headers
        this.express.use(morgan('common')); // Request Logger
        this.express.use(express.json());
    }

    routes (){
        this.express.get('/groups', controller.getGroups);
        this.express.get('/group:id', controller.getGroup);

        this.express.get('/conditions', controller.getConditions);

        this.express.get('/entries', controller.getEntries);
        this.express.get('/entry:id', controller.getEntry);

        this.express.get('/', (req, res, next) => {
            res.send('Mailpy - REST API');
        });
    }
}

module.exports = new App().express