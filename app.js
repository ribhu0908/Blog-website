//jshint esversion:6

//------------------------------ACQUIRE ALL PACKAGES/CONSTANTS---------------------------------------------
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

//all ejs files inside views folder
app.set('view engine', 'ejs');

//no seperate body parser is needed, all static files inside public(CSS,images)
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeStartingContent = "Welcome to Guidanceopedia, an Initiative by Ribhu Mukherjee. I have lived a journey from an average student with 14+ backs to getting selected in top IITs. In this blog, I share guidance related to GATE,Coding and Mental health"
const aboutContent= "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const contactContent= "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."

let posts = []; //global array

//-------------------------CONNECT TO DB & CREATE COLLECTIONS-------------------------------------

//connect to mongodb localHost
mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

//Create Blogs collection
const blogsSchema = {
  title: String,
  content: String
};

const Blog = mongoose.model("Blog", blogsSchema);


//------------------------------GET AND POST CALLS---------------------------------------------

//when user accese home root, render home.ejs
app.get("/", function (req, res) {

  Blog.find({}, function (err, foundBlogs) {

    if (foundBlogs.length == 0) {

      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    }
    else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundBlogs
      });
    }
  });
});


//when user access about root, render about.ejs
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

//when user access contact root, render contact.ejs
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

//when admin access compose root, render compose.ejs
app.get("/compose", function (req, res) {
  res.render("compose");
});

//when admin posts in compose rout, redirict to home rout
app.post("/compose", function (req, res) {

  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  //create the Blog document
  const blog = new Blog({
    title: postTitle,
    content: postBody
  });

  blog.save();
  res.redirect("/");

});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = req.params.postName; 
  
  Blog.findOne({ title: requestedTitle }, function (err, foundBlog) {
    if (!err) {
      if (!foundBlog) {
        
        console.log("Invalid page");

      } else {
        //Show an exisiting blog
        res.render('post', { title: foundBlog.title, content: foundBlog.content });
      }
    }
    else {
      console.log("error has occured");
    }
  });
});


//------------------------------LISTEN ON PORT 3000---------------------------------------------
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
