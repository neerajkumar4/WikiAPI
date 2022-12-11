
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Article = mongoose.model("Article", articleSchema)

//////////request targeting all articles////////////////////
app.route("/articles")
  .get((req, res) => {
    Article.find({}, (err, result) => {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });



//////////request targeting specific articles////////////////////
app.route("/articles/:articleTitle")
  .get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("No articles matching that articles found");
      }
    });
  })
  .put((req,res)=>{
    Article.findOneAndReplace(
      {title:req.params.articleTitle},
      {title:req.body.title,content:req.body.content},
      null,
      (err)=>{
        if(!err){
          res.send("successfully updated article.");
        }
      }
    );
  })
  .patch((req,res)=>{
    Article.findOneAndUpdate(
      {title:req.params.articleTitle},
      {title:req.body.title,content:req.body.content},
      (err)=>{
        if(!err){
          res.send("successfully updated article.");
        }
      }
    )
  })
  .delete((req,res)=>{
    Article.deleteOne(
      {title:req.params.articleTitle},
      (err)=>{
        if(!err){
          res.send("successfully deleted the article.");
        }else{
          res.send(err);
        }
      }
    );
  });


app.listen(3000, function () {
  console.log("Server started on port 3000");
});