const User = require("./user");
const bcrypt = require("bcryptjs"); // to unhash passwords
const localStrategy = require("passport-local").Strategy;


// Here we want the same instance of passport to be used across our app
// Below we are passing the passport library
module.exports = function(passport){
    new localStrategy((username, password, done) => {
        // done is a callback function
        User.findOne({username: username}, (err, user) =>{
            if(err) throw err;
            if(!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err) throw err;
                if(result === true){
                    return done(null, user);
                }
                else{
                    return done(null, false);
                }
            });
        });
    });

    // We want to create a cookie with a user inside of it.
    passport.serializeUser((user, cb) =>{
        cb(null, user.id);
    })

    // find the user in the database matching the user id in the cookie
    passport.deserializeUser((id, cb)=>{
        User.findOne({_id: id}, (err, user) =>{
            
            // Below we are sending the entire User Object that contains too much session information
            // cb(err, user);

            // We can decide what to send back
            const userInformation = {
                username: user.username
            };

            cb(err, userInformation);

        })
    })

}




