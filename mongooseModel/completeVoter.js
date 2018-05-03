
const mongoose = require("../mongoose/configMongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const completeVoterSchema = new Schema({
    name : {
        type : { firstName : String, lastName : String },
        require : true,
        trim : true
    },
    imageURL : {
        type : String,
        trim : true        
    },
    authDetails : {
        type : { authType : String, authId : String, documentId : ObjectId },
        trim : true        
    },
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
    }
});


const CompleteVoter = mongoose.model("completevoters", completeVoterSchema);

module.exports = CompleteVoter;