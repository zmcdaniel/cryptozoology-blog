// Requires + Global Variables
var express = require('express');
var ejsLayouts = require('express-ejs-layouts'); // Allows use of layout.ejs as a master template page. Node module.
var bodyParser = require('body-parser'); // Allows me to post form data. Node module.
var db = require('./models'); // Gives us access to 'article' and 'tag' tables in the model folder. File structure.
var app = express();

// Settings
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended:false}));

// Definitions of Routes
// Display all articles (title + author)
app.get('/', function(req, res) {
  res.render('home');
});

// Display a form to submit a new article
app.get('/article/new', function(req, res) {
  res.render('newArticle', errorMessage ='');
});

// Use submitted form data to create new article. Redirect to newly created article.
app.post('/article/new', function(req, res) {
  console.log(req.body);

  var author = req.body.authorName;

  // Input checking
  if(!req.body.title) {
    res.render('newArticle', {errorMessage: 'Your title was blank! Please resubmit!'});
  }

  if (!author) {
    author = 'Anonymous';
  }

  if(!req.body.body) {
    res.render('newArticle', {errorMessage: 'Your content was blank! Please resubmit!'});
  }

  db.article.findOrCreate({   // <- This bit creates the article (the entry in the articles table)
    where: {
      title: req.body.title,
      body: req.body.body,
      authorName: author
    },
    include: [db.tag]
  }).spread(function(art, wasCreated) {
    if(req.body.tag) { // Create a tag if we need to
      db.tag.findOrCreate({ // <- This creates the 'relation' (the entry in the article_tags table)
        where: {name: req.body.tag}
      }).spread(function(tag, wasCreated) {
        if(tag !== '') {
          art.addTag(tag);
          res.redirect('/'); 
        } else {
          res.render('newArticle', {errorMessage: 'Something went wrong, please try again!'});
        }
      })
    } else { // Not adding a tag, just redirect
      res.redirect('/')
    }
  })

});

// Show all tags that exist
app.get('/tags', function(req, res) {
  db.tag.findAll().then(function(tags) {
    res.render('tags', {tags: tags});
  })
});

// Look at a specific tag (fetch the tag from the id# of tag)
app.get('/tag/:id', function(req, res) {
  db.tag.findOne({where: {id: req.params.id}, include: [db.article] }).then(function(tag) {
    res.render('tagDetail', { tag: tag });
  })
});

// Display all info about one article
app.get('/article/:id', function(req, res) {
  db.article.findOne({ where: {id: req.params.id}, include: [db.tag] }).then(function(article) {
    res.render('articleDetail', {article: article});
  })
});

// Listen on Port 3000
app.listen(3000);