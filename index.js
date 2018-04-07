'use strict';

var express = require('express'),
  bodyParser = require('body-parser'),
  Realm = require('realm');

var app = express();

let PostSchema = {
  name: 'Post',
  primaryKey: 'title',
  properties: {
    timestamp: 'date',
    title: 'string',
    content: 'string'
  }
};

var blogRealm = new Realm({
  path: 'blog.realm',
  schema: [PostSchema]
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  let posts = blogRealm.objects('Post').sorted('timestamp', true);
  res.render('index.ejs', {posts: posts});
});

app.get('/write', function(req, res) {
  res.sendFile(__dirname + "/write.html");
});

app.post('/write', function(req, res) {
  let title = req.body['title'],
    content = req.body['content'],
    timestamp = new Date();
  blogRealm.write(() => {
    blogRealm.create('Post', {title: title, content: content, timestamp: timestamp});
  });
  res.sendFile(__dirname + "/write-complete.html");
});

app.get('/loginPost', function(req, res) {
  res.sendFile(__dirname + "/loginPost.html");
});

app.post('/loginPost', function(req, res) {
  let password = req.body['password'];
  if (password == 'password') {
    console.log('something');
	  res.sendFile(__dirname + "/write.html");
  }
});

app.get('/loginDelete', function(req, res) {
  res.sendFile(__dirname + "/loginDelete.html");
});

app.post('/loginDelete', function(req, res) {
  let password = req.body['password'];
  if (password == 'password') {
    console.log('something');
	  res.sendFile(__dirname + "/delete.html");
  }
});


app.get('/loginEdit', function(req, res) {
  res.sendFile(__dirname + "/loginEdit.html");
});

app.post('/loginEdit', function(req, res) {
  let password = req.body['password'];
  if (password == 'password') {
    console.log('something');
	  res.sendFile(__dirname + "/edit.html");
  }
});


app.get('/delete', function(req, res) {
  res.sendFile(__dirname + "/delete.html");
});

app.post('/delete', function(req,res){
	let title = req.body['title']
		
	blogRealm.write(() => {
		let toDel =  blogRealm.create('Post', {title: title}, true);
		blogRealm.delete(toDel);
	});
	  res.sendFile(__dirname + "/write-complete.html");
});



app.get('/edit', function(req, res) {
  res.sendFile(__dirname + "/edit.html");
});

app.post('/edit', function(req,res){
	 let title = req.body['title']
	 blogRealm.write(() => {
	let toEdit =  blogRealm.create('Post', {title: title}, true);	
	res.render('edit2.ejs', {toEdit: toEdit});
	 });

});

app.get('/edit2', function(req, res) {
	blogRealm.write(() => {
	let toEdit =  blogRealm.create('Post', {title: title}, true);	
	res.render('edit2.ejs', {toEdit: toEdit});
	});

})

app.post('/edit2', function(req,res){
	 let title = req.body['title'],
    content = req.body['content'],
    timestamp = new Date();
	blogRealm.write(() => {
    blogRealm.create('Post', {title: title, content: content}, true);
	});
	res.sendFile(__dirname + "/write-complete.html");
});

app.listen(3001, function() {
  console.log("Go!");
});
