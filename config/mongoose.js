const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/friendly_development', {useNewUrlParser: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
  console.log('Successfully Connected to the Database :: MongoDB');
});


module.exports = db;