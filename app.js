const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 3000;
const app = express();
const _ = require('lodash');
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
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});
const CustomList = mongoose.model('customList', listSchema);
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
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect('/');
});
app.post('/delete', function(req, res) {
  const day = date.getDate();
  const itemID = req.body.itemID;
  const listName = req.body.listName;
  if (listName === day) {
    Item.findByIdAndRemove(itemID, err => {
      if (err)
        console.log(err);

      res.redirect('/');
    });
  } else {
    CustomList.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: itemID
        }
      }
    }, function(err, result) {
      if (!err)
        res.redirect('/' + listName);
    });
  }
});
app.get('/:dynamicList', function(req, res) {
  const listName = _.capitalize(req.params.dynamicList);
  CustomList.findOne({
    name: listName
  }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new CustomList({
          name: listName,
          items: initialItems
        });
        list.save((err , doc)=>{
          if(err)
          console.log(err);
          else
          res.redirect('/' + list.name);
        });

      } else {
        res.render('list', {
          listTitle: foundList.name,
          newListItem: foundList.items,
          route: "/" + foundList.name
        });
      }
    }

  });
});


app.listen(port, function() {
  console.log("server is running on port 3000.")
});
