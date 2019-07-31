const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs"); // use EJS as view engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // use 'public/' for static files

// Text to pass the home page
const homeStartingContent = "This is a simple blogging web application. Click on the 'CREATE POST' link to create a new post with a title and a body. After you're done composing, click on 'Publish Post' and you'll be redirected to the home page where a part of it will be displayed. Click on the 'Read More' link beside each post you create, and you'll navigate to the respective post's page with the full post body text shown. While there, click on 'Delete Post' to delete the post and you'll navigate to the home page after the respective post is deleted.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
// Array that holds all the new blog posts
let posts = [];

app.get("/", (req, res) => {
    res.render("home", {
        startingContent: homeStartingContent,
        blogPosts: posts  // pass the posts array to home template
    });
});

app.get("/about", (req, res) => {
    res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", (req, res) => {
    res.render("contact", {contactContent: contactContent});
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    // create a new post object
    const newPost = {
        blogPostTitle: req.body.postTitle,
        blogPostBody: req.body.postBody
    };
    posts.push(newPost); // append to array of blog posts
    res.redirect("/");   // redirect to "/" GET route
});

app.get("/posts/:postName", (req, res) => {
    // Get the requested post title parameter from 'req.params'
    const requestedTitle = _.lowerCase(req.params.postName);
    // Loop through posts array to see if it exists
    posts.forEach(post => {
        // Get title of stored post; lowercase it with Lodash
        const storedTitle = _.lowerCase(post.blogPostTitle);
        if (storedTitle === requestedTitle) {
            res.render("post", {title: post.blogPostTitle, content: post.blogPostBody});
        } else {
            console.log("Post title not found");
        }
    });
});

app.post("/delete", (req, res) => {
    // get the delete button's value from the request body
    const requestedTitle = _.lowerCase(req.body.deleteButton);
    // remove the blog post that has the same name as the above value
    posts = posts.filter(post => {
        const storedTitle = _.lowerCase(post.blogPostTitle);
        return storedTitle !== requestedTitle;
    });
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server is up and running on port 3000");
});