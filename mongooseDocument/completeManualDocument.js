
const { CompleteManualVoter } = require("../mongooseModel/completeManualVoter");


let createManualDocument = function(object){
    let newManualVoter = new CompleteManualVoter({
        email : object.email,
        gender : object.gender,
        aadharNumber : object.aadharNumber,
        voterNumber : object.voterNumber,
        voted : false,
        name : {
            firstName : object.firstName,
            lastName : object.lastName
        },
        password : object.password,
        authType : "manual"
    });

    return newManualVoter;
};


module.exports = { createManualDocument };




























