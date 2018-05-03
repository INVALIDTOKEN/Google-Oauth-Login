const express = require("express");
let router = express.Router();
let passport = require("../passport-config/passportConfig");
let mongoose = require("../mongoose/configMongoose");
let CompleteVoter = require("../mongooseModel/completeVoter");
let { createCompleteVoter } = require("../mongooseDocument/completeVoterDocument");
let { ObjectId } = mongoose.Types;

let validateUser = function(request, response, next){
    if(request.user){
        next();
    }else{
        return response.redirect("/login");
    }
};

let validateComplete = function(request, response, next){
    if(request.user){
        if(request.cookies.completedDetails == "true"){
            next();
        }else{
            response.redirect("/complete");
        }
    }else{
        return response.redirect("/login");
    }
};



// GOOGLE AUTHENTICATION ROUTES
router.get("/auth/google", passport.authenticate("google", { scope : ["profile", "email"] } ));
router.get("/auth/google/redirect", passport.authenticate("google", {failureRedirect : "/home"} ), (request, response) => {
    response.redirect("/complete");
});

// RENDER THE PAGE TO COMPLETE THE INFORMATION
router.get("/complete", validateUser,  (request, response) => {

    // JUST TO CHECK IF THE USER IS A MANUALLY LOGGED IN SO DO NOT SHOW COMPLETE ROUTE BECAUSE HE HAS ALREADY LOGGED IN COMPLETE
    if(request.user.authType == "manual"){
        return response.redirect("/vote");
    }

    CompleteVoter.findOne({"authDetails.documentId" : new ObjectId(request.user._id), "authDetails.authType" : request.user.authType}).then((document) => {
        if(!document) return response.render("complete", { values : request.user , pageName : "Complete Info"});

        response.cookie("completedDetails", "true");
        response.redirect("/vote");
    });
});

// GETS ALL THE INFORMATION FROM THE USER
router.post("/complete", validateUser, (request, response) => {
    let completeDetail = {
        additional : request.body,
        login : request.user
    };
    let newCompleteVoter = createCompleteVoter(completeDetail);
    newCompleteVoter.save().then((document) => {
        response.cookie("completedDetails", "true");
        response.redirect("/vote");
    });
});

module.exports = router;





























