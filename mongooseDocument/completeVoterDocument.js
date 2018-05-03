
const mongoose = require("../mongoose/configMongoose");
const CompleteVoter = require("../mongooseModel/completeVoter");
const { ObjectId } = mongoose.Types;

let createCompleteVoter = function(object){
    const newComplete = new CompleteVoter({
        name : {
            firstName : object.login.name.firstName,
            lastName : object.login.name.lastName,
        },
        imageURL : object.login.imageURL,
        authDetails : {
            authType : object.login.authType,
            authId : object.login.googleID,
            documentId : new ObjectId(object.login._id)
        },
        email : object.login.email,
        gender : object.additional.gender,
        aadharNumber : object.additional.aadharNumber,
        voterNumber : object.additional.voterNumber,
        voted : false
    });

    return newComplete;
}

module.exports = { createCompleteVoter }
























