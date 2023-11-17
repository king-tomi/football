import { MongoClient, ServerApiVersion} from 'mongodb';
import { connect } from 'mongoose';
import mongoose from 'mongoose';

// connect(
//     "mongodb+srv://ayodabooluwatomisin:ayodabo3103@cluster0.fs9hl6g.mongodb.net/footballdb?retryWrites=true&w=majority"
// );
// const FootballSchema = mongoose.Schema({
//     Team: String,
//     GamesPlayed: Number,
//     Win: Number,
//     Draw: Number,
//     Loss: Number,
//     GoalsFor: Number,
//     GoalsAgainst: Number,
//     Points: Number,
//     Year: Number
// });

// const Football = mongoose.model('Football', FootballSchema);

//const footballuri = "mongodb+srv://ayodabooluwatomisin:ayodabo3103@cluster0.fs9hl6g.mongodb.net/footballdb?retryWrites=true&w=majority";

// const client = new MongoClient(footballuri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// client.connect();
// console.log("Connected");

// console.log(client.db("footballdb").collection("football").findOne({Team: "Argentina"}));

//export default Football;