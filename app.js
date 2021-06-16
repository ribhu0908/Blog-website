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

const homeStartingContent = `Welcome to Guidanceopedia!! A Free Initiative by Ribhu Mukherjee. I have \
scored 99.4%ile in GATE CSE 2020, and thereafter got selected in IIT Madras, IIT Bombay, IIT BHU, top \
NITs and top IIITs. I have taken 7+ seminars across engineering colleges/ universities guiding about \
GATE, Mental Health and coding. I am passionate about teaching and I am currently teaching 2800+ \
students in Youtube related to coding and GATE. In this blog, I will be putting my heart out \
in all areas related to tips and strategies of GATE, coding, mental health insights and much more. \
You can consider it to be our personal diary, where we will be exchanging views.\
Chalo kuch baatein kare!!`


const aboutContent= `
From 14+ Backlogs in my BTech, with being disqualified to even sit for campus placements,
battling depression and mental problems (even faced a point where I decided to quit Engineering)
TO 99.4%ile in GATE CS,Selected for Mtech RA in CSE dept(Rank 1)- NIT Suratkal,Selected for Mtech RA in Data Science dept(Rank 1)- NIT Suratkal
,Selected for MS+Phd in the CSE dept. Stood (Rank 1) thus received a full-time IRF scholarship- 
BIT MESRA, Selected for Mtech CSE(Rank 2) - IIIT Delhi,
Selected for MS+PhD in the CSE Dept- IIT Ropar,
Selected for MS-IDRP - IIT Madras,
Selected for MS+phd in the CSE Dept- IIT BHU,
Selected for MS+ phd in CSE - IIT Bombay,
(After IIT Madras selection I stopped sitting for rest of the interviews)
Its been a journey. And I give the full credit to my friends and family.
My NEW YEAR RESOLUTION WILL BE TO MENTOR AND GUIDE AS MANY STUDENTS AS POSSIBLE 
FOR GATE CSE/MS PHD IIT INTERVIEWS.
`;

const contactContent= "Write to me at iribhumukherjee@gmail.com.";
let posts = []; //global array

//-------------------------CONNECT TO DB & CREATE COLLECTIONS-------------------------------------

//connect to mongodb localHost
mongoose.connect("mongodb+srv://ribhu-mukherjee:babu2309@cluster0.rtndj.mongodb.net/blogDB", { useNewUrlParser: true });

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
  console.log(requestedTitle);
  
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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port successfully");
});
