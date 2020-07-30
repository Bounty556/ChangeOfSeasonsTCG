const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// For socket.io
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, { serveClient: false });

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// How should socket.io handle connections?
io.on('connection', (socket) => {
  socket.join(socket.id);
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

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
// Add routes, both API and view
app.use(routes);

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/changeOfSeasons');

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

