const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 3000;
const app = express();
const date = require(__dirname + '/date.js');
app.use(bodyParser.urlencoded({
  extended: true
}));
// public folder on the web with css and images
app.use(express.static('public'));
app.set('view engine', 'ejs')

//connect to my local database
mongoose.connect('mongodb://localhost:27017/todolistDB');
const itemSchema = new mongoose.Schema({
  name: String
});
var initialItems = [{
  name: "welcome to yours ToDolist"
}, {
  name: "hit + button to add tasks"
}, {
  name: "<--hit this button to delete tasks"
}];
const Item = mongoose.model('Item', itemSchema);
app.get('/', function(req, res) {
  let day = date.getDate();
  //use of find method to print all the names of tasks to ejs template
  Item.find({}, (err, items) => {
    if (err)
      console.log(err)
    else {
      if (items.length === 0) {
        Item.insertMany(initialItems, err => {
          if (err)
            console.log(err)
          else console.log("successfully initial Database!")
        });
        res.redirect('/');
      } else res.render("list", {
        listTitle: day,
        newListItem: items,
        route: '/'
      });
    }
  });
});


app.post('/', function(req, res) {
  var itemName = req.body.newItem;
  const item = new Item({name: itemName});
  item.save();
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
