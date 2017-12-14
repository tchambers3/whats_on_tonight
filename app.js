const 
  express = require('express'),
  body_parser = require('body-parser'),
  request = require('request'),
  API = require('./api'),
  fs = require('fs');
  app = express().use(body_parser.json());
  app.use(body_parser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
// Define the view (templating) engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('passport', require('./models/authentication.js').init(app));

require('./routes/auth.js').init(app);
require('./routes/shows.js').init(app);

app.get('/', (req,res) => {
	fs.readFile(__dirname + '/public/login.html', 'utf8', function(err, text){
                res.send(text);
            });
})

// Sets server port and logs message on success
app.listen(process.env.PORT || 5000, () => console.log('Listening'));
