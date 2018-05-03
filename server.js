
let express = require("express");
let pug = require("pug");
let cookieSession = require("cookie-session");
let bodyParser = require("body-parser");
let passport = require("./passport-config/passportConfig");
let mongoose = require("./mongoose/configMongoose");
let cookieParser = require("cookie-parser");
let { ObjectId } = mongoose.Types;
let Candidate = require("./mongooseModel/candidateModel");
let CompleteVoter = require("./mongooseModel/completeVoter");
let { CompleteManualVoter } = require("./mongooseModel/completeManualVoter");
let { createManualDocument } = require("./mongooseDocument/completeManualDocument");
let { createCompleteVoter } = require("./mongooseDocument/completeVoterDocument");
let app = express();
let port = 3000;

app.set("view engine", "pug");
app.set("views", "./views");
app.use("/static", express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    cookieSession(
        {
            maxAge : 24*60*60*1000,
            keys : ["Secret"]
        }
    )
);

let validateUser = function(request, response, next){
    if(request.user){
        next();
    }else{
        return response.redirect("/login");
    }
}

let validateComplete = function(request, response, next){
    if(request.user){
        if(request.cookies.completedDetails == "true"){
            next();
        }else if(request.user.authType == "manual"){
            next();
        }else{
            response.redirect("/complete");
        }
    }else{
        return response.redirect("/login");
    }
}

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// RENDERS THE LOGIN PAGE 
app.get("/login", (request, response) => {
    response.render("login", { pageName : "login Options" });
});

// RENDERS THE SIGNUP PAGE ( MANUAL SIGNUP PAGE )
app.get("/signup", (request, response) => {
    response.render("signup" , { pageName : "Signup", msg : false });
});

// CHECKS FOR UNIQUE EMAIL AND REDIRECTS TO LOGIN ROUTES
app.post("/signup", (request, response) => {
    
    CompleteManualVoter.findOne({ email : request.body.email }).then((document) => {
        if(!document){
            let newDocument = createManualDocument(request.body);
            newDocument.save().then((document) => {
                response.redirect("/login/details");
            });
        }else{
            response.render("signup", { pageName : "Signup", msg : true });
        }
    });
});

// MANUAL LOGIN USER 
app.get("/login/details", (request, response) => {
    response.render("login-details", { pageName : "Login Details", msg : false });
});

app.post("/login/details", passport.authenticate("local", {
    failureRedirect : "/login/details",
    successRedirect : "/vote"
}));


// GOOGLE ROUTES 
let googleRoutes = require("./routes/googleRoutes");
app.use(googleRoutes);

// VOTE ROUTES
let voteRoutes = require("./routes/voteRoutes");
app.use(voteRoutes);

app.get("/voted",validateUser, validateComplete,  (request, response) => {
    if(request.cookies.voted == "true"){
        // IF LOGIN OPTION IS GOOGLE FIRST GETTING THE FULL USER THEN THE CANDIDATE AND THEN RENDERING THE CANDIDATES DETAILS
        if(request.user.authType == "google"){
            CompleteVoter.findOne({"authDetails.documentId" : ObjectId(request.user._id)})
            .then( (document) => { return Candidate.findOne( { _id : ObjectId(document.votedTo) } ) } )
            .then( (document) => { return response.render("voted", {pageName : "voted", object : document } ) } ); 
        }else if(request.user.authType == "manual"){
            // IF LOGIN OPTION IS MANUAL THAN RENDERING THE CANDIDATES DETAILS AFTER FINDING THEM
            Candidate.findOne({ _id : request.user.votedTo })
            .then( (document) => { return response.render("voted", {pageName : "voted", object : document } ) } ); 
        }
    }else{
        response.redirect("/vote");
    }
});


// RENDERS HOME PAGE
app.get("/", (request, response) => {
    if(!request.user){
        response.render("home" , { pageName: "Home"});
    }else{
        response.redirect("/vote");
    }
    
});


app.listen(port, "127.0.0.1", () => {
    console.log("Server running at port 3000");
});



































