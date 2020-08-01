const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

const morgan = require ('morgan');
const passport = require('passport');

const server = require('http').createServer(app);

const io = require('socket.io')(server, { serveClient: false });

let timer;

io.on('connection', (socket) => {
  const time = () => {
    const d = new Date();
    socket.emit(socket.id, d.toLocaleTimeString());
  };
  console.log('A user connected');
  timer = setInterval(time, 1000);
  socket.on('disconnect', () => {
    console.log('User disconnected');
    clearInterval(timer);
  });
});

const bodyParser = require('body-parser');

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
// Add routes, both API and view
app.use(routes);


// MIDDLEWARE
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())

// Sessions
// app.use(
// 	session({
// 		secret: 'ChangeOfSeasons', //pick a random string to make the hash that is generated secure
// 		store: new MongoStore({ mongooseConnection: dbConnection }),
// 		resave: false, //required
// 		saveUninitialized: false //required
// 	})
// )
// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/changeOfSeasons');

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser
// Routes
// app.use('/user', user)

// Start the API server
server.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});