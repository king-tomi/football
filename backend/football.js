import { Router } from 'express';
const router = Router();
import { MongoClient, ServerApiVersion} from 'mongodb';
//import {Football} from './connect.js'; 
const footballuri = "mongodb+srv://ayodabooluwatomisin:ayodabo3103@cluster0.fs9hl6g.mongodb.net/footballdb/?retryWrites=true&w=majority";

const client = new MongoClient(footballuri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect();
console.log("Connected");

//add a single team 1.5
async function addTeam(client, teamData) {
    const result = await client.db("footballdb").collection("football").insertOne(teamData);
    console.log(`Inserted result for id: ${result.insertedId}`)
};

//updates a single team record 1.6
async function updateTeam(client, teamName,updateData) {
    const result = await client.db("footballdb").collection("football")
    .updateOne({Team: teamName}, {$set: updateData});

    console.log(`Data Updated for ${result.modifiedCount} number of documents`)
};

//returns data based on year 1.7
async function getAllDataByYear(client, year) {
    const cursor = await client.db("footballdb").collection("football").find({
        Year: year
    }).project({GamesPlayed: 1, Win: 1, Draw: 1, _id: 0});

    const result = await cursor.toArray();
    return result;
};

//deletes a single data 1.8
async function deleteTeam(client, teamName) {
    const result = await client.db("footballdb").collection("football").deleteOne({Team: teamName});

    console.log(`${result.deletecCount} number of document(s) was/were deleted`)
};

//access the top 10 teams who have more wins than a specified number of wins 1.9
async function getDataByWin(client, wins) {
    const cursor = await client.db("footballdb").collection("football").find({
        Win: wins
    }).sort({Win: -1})
    .limit(10);

    const result = await cursor.toArray();
    return result;
};

//returns all teams by grouping them using average goal for for a specific given year 2.0
async function getAllDataByYearOnGoalsFor(client, year) {
    const average = await client.db("footballdb").collection("football").aggregate([
        { $project: {averageGoalsFor: { $avg: "$GoalsFor"} } }]).toArray()[0]["averaeGoalsFor"];

    const result = await client.db("footballdb").collection("football").find(
        {Year: year,
        GoalsFor: {$gte: average}}
    ).toArray();

    return result;
};


//define API endpoints

//add single team
router.post('/api_v1/add_team', async function(req, res){
    const data = req.body;
    await addTeam(client, data);
    res.send('Added Data for given Team ' + req.body.Team);
});

//update a single team
router.post('/api_v1/update_team/:team', async function(req, res) {
    const data = req.body;
    const team = req.params.team;
    await updateTeam(client, team, data);
    res.send('Updated Data for given Team ' + team);
});

//delete single data
router.post("/api_v1/delete_team/:team", async function(req, res) {
    const team = req.params.team;
    await deleteTeam(client, team);
    res.send('Deleted data for given team ' + team)
});

//get data by given year
router.get('/api_v1/get_teams/:year', async function(req, res) {
    const year = new Number(req.params.year);
    const result = await getAllDataByYear(client, year);
    return res.json({result})
});

//gets data by win
router.get('/api_v1/get_teams_win/:win', async function(req, res) {
    const win = new Number(req.params.win);
    const result = await getDataByWin(client, win);
    return res.json({result})
});

//get data by goals for
router.get('/api_v1/get_teams_goals_for/:year', async function(req, res) {
    const year = new Number(req.params.year);
    const result = await getAllDataByYearOnGoalsFor(client, year);
    return res.json({result})
});

export default router;