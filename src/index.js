require('dotenv').config();

const config = require('./config');

const app = require('./app');

app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'Something wrong happened' : error.stack,
    });
});

app.listen(config.PORT, config.HOST, () => {
    console.log('Express server started on port %s at %s', config.PORT, config.HOST);
});