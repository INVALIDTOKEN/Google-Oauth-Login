
const express = require("express");
const router = express.Router();
let passport = require("../passport-config/passportConfig");
let mongoose = require("../mongoose/configMongoose");
let CompleteVoter = require("../mongooseModel/completeVoter");
let { CompleteManualVoter } = require("../mongooseModel/completeManualVoter");
let { createCompleteVoter } = require("../mongooseDocument/completeVoterDocument");
let Candidate = require("../mongooseModel/candidateModel");
let { ObjectId } = mongoose.Types;

let filterFromObject = function(array){
    let filterArray = array.map((object) => {
        return { name : object.name, id : object._id };
    });
    return filterArray;
}

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

// RENDERS THE VOTING PAGE
router.get("/vote", validateUser, validateComplete, (request, response) => {
    // IF LOGIN TYPE IS GOOGLE THEN GETTING THE FULL USER THEN CHECKING WEATHER HE HAS VOTED OR NOT 
    if(request.user.authType == "google"){
        CompleteVoter.findOne({ "authDetails.authType" : "google", "authDetails.documentId" : ObjectId(request.user._id) })
        .then((document) => {
            if(document.voted){

                // IF HE HAS VOTED REDIRECTING IT TO VOTED ROUTE
                response.cookie("voted", "true");
                response.redirect("/voted");

            }else{

                // IF HE HAS NOT VOTED THAN REDERING THE CANDIDATES 

                Candidate.find().then((documents) => {
                    let filteredArray = filterFromObject(documents);
                    response.render("vote", { votingCandidates : filteredArray, pageName : "vote" });
                });

            }
        });
    // IF THE LOGIN TYPE IS MANUAL THEN JUST CHECKING THE VOTED PROPERTY IF TRUE REDIRECTING TO THE VOTED ROUTE IF NOT THAN RENDERING THE CANDIDATES
    }else if(request.user.authType == "manual"){
        if(request.user.voted){
            response.cookie("voted", "true");
            response.redirect("/voted");
        }else{
            Candidate.find().then((documents) => {
                let filteredArray = filterFromObject(documents);
                response.render("vote", { votingCandidates : filteredArray, pageName : "vote" });
            });
        }
    }
});

// SUBMITTING THE USER VOTE
router.post("/vote", validateUser, validateComplete, (request, response) => {

    let mainObject = {};
    if(request.user.authType == "google"){
        // GETTING THE COMPLETE VOTER AND UPDATING IT TOO
        CompleteVoter.findOneAndUpdate(
            {
                "authDetails.documentId" : request.user._id
            },
            {
                $set : { voted : true, votedTo : ObjectId(request.body.candidate)}
            },
            {
                new : true
            }
        ).then((document) => {

            // GETTING THE CANDIDATE THAT GETS THE VOTE AND UPDATING IT TO
            return Candidate.findOneAndUpdate(
                {
                    _id : request.body.candidate
                },
                {
                    $addToSet : { voters : { voterId : ObjectId(document._id), authType : "google" } },
                    $inc : { votes : +1 }
                },
                {
                    new : true
                }
            );
        }).then((document) => {
            // REFRESING THE VOTE PAGE SO THAT IT CHECKS FOR THE VOTED PROPERTY
            response.redirect("/vote");
        });

    // IF THE LOGIN IS MANUAL
    }else if(request.user.authType == "manual"){

        // GETTING THE COMPLETE DOCUMENT AND UPDATEING IT TOO
        CompleteManualVoter.findOneAndUpdate(
            {
                _id : request.user._id
            },
            {
                $set : { voted : true, votedTo : ObjectId(request.body.candidate) }
            },
            {
                new : true
            }
        ).then((document) => {
            // THEN GETTING THE CANDIDATE THAT GETS THE VOTE AND UPDATING IT TO
            return Candidate.findOneAndUpdate(
                {
                    _id : request.body.candidate
                },
                {
                    $addToSet : { voters : { voterId : ObjectId(document._id), authType : "manual"} } ,
                    $inc : { votes : +1 }
                },
                {
                    new : true
                }
            );
        }).then((document) => {

            // REFRESHING THE PAGE SO THAT THE VOTED PROPERTY IS CHECKED AGAIN
            response.redirect("/vote");
        });
    }
});

module.exports = router;




























