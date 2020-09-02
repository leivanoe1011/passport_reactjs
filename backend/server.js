

const mongoose = require("mongoose");
const express = require("express");
// security cross origin
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
// parse the request and response objects
const bodyParser = require("body-parser");
const User = require("./user");

const PORT = 3001;

const app = express();

var varname = "secretcode";

mongoose.connect('mongodb://localhost/passportReact',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=>{
    console.log("mongoose connected");
});


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Most important part for the authentication to work
app.use(cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to 
    credentials: true
}))


app.use(session({
    secret: varname,
    resave: true,
    saveUninitialized: true
}));


app.use(cookieParser(varname));

// Initialize passport
app.use(passport.initialize());
// Initialize the session part of passport
app.use(passport.session());
// Below we pass passport to use the same instance of Passport throughout our server
require("./passportConfig")(passport);

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------


app.post("/login", (req, res, next)=>{
    console.log(req.body);
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if(!user) res.send("No user exists");
        else{
            req.logIn(user, (err) => {
                if(err) throw err;
                res.send("Successfully Authenticated");
                console.log(req.user);
            })
        }

    })(req,res,next);
});


app.post("/register", (req, res) => {

    // We must include async below in order for the await to work
    User.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) throw err;
      if (doc) res.send("User Already Exists");
      if (!doc) {

        // The function was converted to an asyncronous function above for the 
        // await to work below
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        await newUser.save();
        res.send("User Created");
      }
    });
  });

app.get("/user", (req, res)=>{
    console.log(req.body);
    res.send(req.user);
});

//----------------------------------------- END OF ROUTE---------------------------------------------------

app.listen(PORT, ()=> {
    console.log("Server has started");
})



