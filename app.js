const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
// public folder on the web with css and images
app.use(express.static('public'));

app.set('view engine', 'ejs')
var items = ["Buy food", "cook food", "eat food"];
var workItems = [];

app.get('/', function(req, res) {
  console.log(items)
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  var day = today.toLocaleDateString("en-US", options);
  var currentDay = today.getDay();

  res.render("list", {
    listTitle: day,
    newListItem: items ,
    route: '/'
  });
});

app.post('/', function(req, res) {
  var item = req.body.newItem;
  items.push(item);
  res.redirect('/');
});

app.get('/work', function(req, res) {
  res.render('list', {
    listTitle: "Work List",
    newListItem: workItems,
    route: "/work"
  });
});
app.post('/work', function(req, res) {
  var item = req.body.newItem;
  workItems.push(item);
  res.redirect('/work');
});


app.listen(port, function() {
  console.log("server is running on port 3000.")
});
