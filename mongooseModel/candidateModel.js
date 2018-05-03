const mongoose = require("../mongoose/configMongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const candidateSchema = new Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    age : {
        type : Number,
        required : true,
        trim : true
    },
    votes : {
        type : Number,
        required : true,
        trim : true
    },
    voters : {
        type : [{voterId : ObjectId, authType : String }]
    }
});

const Candidate = mongoose.model("candidates", candidateSchema);


module.exports = Candidate;












