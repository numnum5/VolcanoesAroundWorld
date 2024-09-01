// Imports
const configurations = require('./knexfile.js');
const knex = require('knex')(configurations);
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi.json'); 
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const usersRouter = require('./routes/users');
const knexRouter = require('./routes/knex'); 
const countriesRouter = require('./routes/countries');
const volcanoesRouter = require('./routes/volcanoes');
const meRouter = require('./routes/me');
const volcanoRouter = require('./routes/volcano');
const customRouter = require('./routes/custom');
const app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Serve swagger docs for documentation
app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerDocument));

// middleware for database connectivity
app.use((req, res, next) => {
	req.db = knex;
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', usersRouter);
app.use('/knex', knexRouter);
app.use('/countries', countriesRouter);
app.use('/volcanoes', volcanoesRouter);
app.use('/volcano', volcanoRouter);
app.use('/custom', customRouter);
app.use('/me', meRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;