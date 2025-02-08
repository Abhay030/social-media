const express = require("express");
const app = express();
const usermodel = require('./model/user.js');
const postmodel = require('./model/post.js');
const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const post = require("./model/post.js");


app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/register", async (req, res) => {
    try {
        const { username, password, email, name, age } = req.body;

        // 🔹 Check if user already exists
        let user = await usermodel.findOne({ email });
        if (user) return res.status(400).send("User already exists");

        // 🔹 Hash Password using `await`
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // 🔹 Create new user and save to DB
        let newuser = await usermodel.create({
            username,
            password: hash,
            email,
            name,
            age
        });

        // 🔹 Generate JWT Token AFTER saving user
        const token = jwt.sign({ email: newuser.email, userid: newuser._id }, "shhhhh", { expiresIn: "1h" });

        // 🔹 Set Cookie and Send Response
        res.cookie("token", token);
        res.status(201).send("User registered successfully");
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/profile" , isLoggedIn , async (req , res) => {
    let user = await usermodel.findOne({email: req.user.email}).populate("posts")
    res.render("profile" , {user}); 
})

app.post("/post" , isLoggedIn , async (req , res) => {
    let user = await usermodel.findOne({email: req.user.email})
    let {content} = req.body

    let post = await postmodel.create ({
        user : user._id,
        content
    })

    user.posts.push(post._id)
    await user.save()
    // console.log(post);
    res.redirect("/profile")
})

app.post("/login", async (req, res) => {
    let{ email, password } = req.body;
    let user = await usermodel.findOne({ email });
    if (!user) return res.status(400).send("Something Went Wrong");

    const isMatch = await bcrypt.compare(password , user.password);
    if (!isMatch) {
        res.redirect("/login");
    }
    const token = jwt.sign({ email: user.email, userid: user._id }, "shhhhh", { expiresIn: "1h" });
    res.cookie("token", token);
    res.status(201).redirect("/profile");
})

app.get('/logout' , (req , res) => {
    res.clearCookie("token" , "");
    res.redirect("/login");
})

app.get("/like/:id", isLoggedIn , async (req , res) => {
    let post = await postmodel.findOne({_id: req.params.id}).populate("user")

    if(post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid) , 1);
    }
    await post.save();
    res.redirect('/profile')
})

app.get("/edit/:id", isLoggedIn , async (req , res) => {
    let post = await postmodel.findOne({_id: req.params.id}).populate("user")
    res.render('edit' , {post})
})

app.post("/update/:id", isLoggedIn , async (req , res) => {
    let post = await postmodel.findOneAndUpdate({_id: req.params.id} , {content: req.body.content})
    res.redirect('/profile')
})

function isLoggedIn(req, res, next) {
    try {
        // 🔹 Check if token exists
        if (!req.cookies.token) return res.redirect("/login");

        // 🔹 Verify JWT Token
        let data = jwt.verify(req.cookies.token, "shhhhh");

        // 🔹 Attach user data to `req`
        req.user = data;
        
        // 🔹 Move to next middleware
        next();
    } catch (error) {
        return res.status(403).send("Invalid or Expired Token");
    }
}

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});
