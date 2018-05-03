const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20');
const GoogleVoter = require("../mongooseModel/googleVoterModel");
const LocalStrategy = require("passport-local");
const { CompleteManualVoter } = require("../mongooseModel/completeManualVoter");
const { mainCredentials } = require("./credentials");

// STRATEGY TO LOGIN WITH GOOGLE 
passport.use("google", new GoogleStrategy(
    {
        clientID: mainCredentials.clientID,
        clientSecret: mainCredentials.clientSecret,
        callbackURL: "http://localhost:3000/auth/google/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
        // GET THE NEEDED PROPERTY FORM THE PROFILE OBJECT SENT BY GOOGLE
        let voter = {
            name : {
                firstName : profile.name.givenName,
                lastName : profile.name.familyName
            },
            googleID : profile._json.id,
            imageURL : profile._json.image.url,
            authType : "google",
            email : profile.emails[0].value
        };

        // CREATE THE USER DOCUMENT 
        let newGoogleVoter = new GoogleVoter(voter);

        // SAVES THE USER DOCUMENT
        GoogleVoter.findOne({ googleID : voter.googleID }).then((document) => {
            if(!document){
                newGoogleVoter.save().then((document) => {
                    done(null, document);
                });
            }else{
                done(null, document);
            }
        });


    }
));

passport.use("local", new LocalStrategy({ usernameField : "email" },
    (username, password, done) => {
        CompleteManualVoter.findOne({ email : username, password : password }).then((document) => {
            if(!document) return done(null, false);
            
            done(null, document);
        });
    }
));

// SERIALIZE THE USER 
passport.serializeUser((user, done) => {
    done(null, { id : user._id, authType : user.authType } );
});

// DESERIALIZE THE USER 
passport.deserializeUser((object, done) => {
    if(object.authType == "google"){
        GoogleVoter.findOne( { _id : object.id } ).then((document) => {
            done(null, document);
        });
    }else if(object.authType == "manual"){
        CompleteManualVoter.findOne({ _id : object.id }).then((document) => {
            done(null, document);
        });
    }
});

module.exports = passport;























