
const mongoose = require("../mongoose/configMongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

let completeManualSchema = new Schema({
    email : {
        type : String,
        require : true,
        trim : true        
    },
    gender : {
        type : String,
        require : true,
        trim : true        
    },
    aadharNumber : {
        type : String,
        require : true,
        trim : true,
        maxlength : 12  
    },
    voterNumber : {
        type : String,
        require : true,
        trim : true        
    },
    voted : {
        type : Boolean,
        require : true,
        trim : true  
    },
    votedTo : {
        type : ObjectId
    },
    name : {
        type : { firstName : String, lastName : String },
        require : true,
        trim : true
    },
    password : {
        type : String,
        minlength : 5,
        trim : true,
        require : true
    },
    authType : String
});

let CompleteManualVoter = mongoose.model("completemanualvoters", completeManualSchema);

module.exports = { CompleteManualVoter };




























