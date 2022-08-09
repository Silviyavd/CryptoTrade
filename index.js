const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');

const routes = require('./routes');
const { port } = require('./config/env');
const { dbInit } = require('./config/db');
const { auth } = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorHandlerMiddleware');

const app = express();

app.engine('hbs', hbs.engine({
    extname: 'hbs'
}));

app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(auth);
app.use(routes);
app.use(errorHandler);

dbInit();
app.listen(port, () => console.log(`Server is running on port ${port}`));