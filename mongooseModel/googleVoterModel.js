const mongoose = require("./../mongoose/configMongoose");
let Schema = mongoose.Schema;

let googleVoter = new Schema({
    name : {
        type : { firstName : String, lastName : String },
        require : true,
        trim : true
    },
    googleID : {
        type : String,
        require : true,
        trim : true        
    },
    imageURL : {
        type : String,
        require : true,
        trim : true        
    },
    authType : {
        type : String,
        require : true,
        trim : true        
    },
    email : {
        type : String,
        require : true,
        trim : true        
    }
});

const GoogleVoter = mongoose.model("googlevoters", googleVoter);

module.exports = GoogleVoter;






























