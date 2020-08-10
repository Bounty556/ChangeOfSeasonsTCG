const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const session = require('express-session')
const app = express();
const PORT = process.env.PORT || 3001;
const morgan = require ('morgan');
const passport = require('passport');
const server = require('http').createServer(app);

const io = require('socket.io')(server, { serveClient: false });

// Let the front end know a user has connected to socket.io
io.on('connection', socket => {
  socket.on('joinRoom', (room, playerCallback) => {
    // Make sure the room has enough room in it
    const playersLength = (io.nsps['/'].adapter.rooms[room]) ? io.nsps['/'].adapter.rooms[room].length : 0;
    if (playersLength < 2) {
      socket.join(room);

      // Let the room know that a socket has joined
      playerCallback(playersLength + 1);
    }
  });

  socket.on('room', (room, msg, info) => {
    console.log('emitting');
    // Make sure the room exists and has users in it
    if (!io.nsps['/'].adapter.rooms[room] || io.nsps['/'].adapter.rooms[room].length > 0) {
      io.sockets.in(room).emit(msg, info);
    }
  });

  socket.on('disconnect', (info) => {
    // TODO: Cleanup lobby if empty
    // console.log(socket.rooms);
  });
});

require('./passport')(passport);
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
// Add routes, both API and view

// MIDDLEWARE
app.use(morgan('dev'));
app.use(
	express.urlencoded({
		extended: false
	})
);
app.use(express.json());

// Sessions
app.use(
	session({
		secret: 'ChangeOfSeasons', //pick a random string to make the hash that is generated secure
		// store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false, //required
		saveUninitialized: false //required
	})
);
// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/changeOfSeasons', { useNewUrlParser: true, useUnifiedTopology: true });

// Passport
app.use(passport.initialize());
app.use(passport.session()); // calls the deserializeUser
// Routes
// app.use('/user', user)
app.use(routes);
// Start the API server
server.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});