//Require Dependencies
const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const logger = require("morgan");           //logs our requests to the console
const app = express();

//Connect MongoDB
mongoose.connect("mongodb://localhost:27017/equilibrium");
// require('./config/database');


//Get our API routes
const api = require("./server/routes/api");


app.use(logger('dev'));  //log every request to the console

//Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs');  //setup ejs for templating


//Setup passport
// app.use(session({
//     secret: "ilovescotch"      //session secret
// }));
app.use(passport.initialize());
app.use(passport.session());   //persistent login sessions
app.use(flash());     //use connect-flash for flash messages stored in session

//Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

//Set our api routes
app.use('/api', api);

//Catch all other routes and return the index file.
//Catch-all route MUST come after all other API routes have been defined.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


// Get port from environment and store in Express
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port, () => console.log('API running on localhost: ${port}'));
