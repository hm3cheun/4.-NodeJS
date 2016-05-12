var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var dishRouter = require('./dishrouter');
var leaderRouter = require('./leaderRouter');
var promoRouter = require('./promoRouter');
var favoriteRouter = require('./favoriteRouter');
var hostname = 'localhost';
var port = 3000;
var app = express();

var homeRouter = express.Router();

app.use(morgan('dev'));  //use morgan for all apps
app.use('/dishes', dishRouter);
app.use('/leadership', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/favorites', favoriteRouter);

app.all('/', function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
});
app.get('/', function(req, res) {
  res.end('index.html');
});





app.use(express.static(__dirname + '/public'));
app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
