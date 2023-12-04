import React, { useState } from 'react';
import axios from 'axios';

function FootballApp() {
    const [teamData, setTeamData] = useState({});
    const [newTeamData, setNewTeamData] = useState({
      Team: '',
      GamesPlayed: '',
      Win: '',
      Draw: '',
      Loss: '',
      GoalsFor: '',
      GoalsAgainst: '',
      Points: ''
    });
    const [updateTeamData, setUpdateTeamData] = useState({
      Team: '',
      GamesPlayed: '',
      Win: '',
      Draw: '',
      Loss: '',
      GoalsFor: '',
      GoalsAgainst: '',
      Points: '',
      Year: ''
    });
    const [teamStats, setTeamStats] = useState({});
  
    const addTeam = async (data) => {
      try {
        const response = await axios.post('http://localhost:3000/football/api_v1/add_team', data);
        return response.data;
      } catch (error) {
        return { error: error.message };
      }
    };

    const handleAddTeam = async (event) => {
        event.preventDefault();
        const result = await addTeam(newTeamData);
        // Handle the result as needed
        console.log(result);
      };
  
    const updateTeam = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/football/api_v1/update_team/${updateTeamData.Team}`, updateTeamData);
        return response.data;
      } catch (error) {
        return { error: error.message };
      }
    };
  
  
    const handleUpdateTeam = async (event) => {
      event.preventDefault();
      const result = await updateTeam();
      // Handle the result as needed
      console.log(result);
    };

    const deleteTeam = async (teamName) => {
        try {
        const response = await axios.post(`http://localhost:3000/football/api_v1/delete_team/${teamName}`);
        return response.data;
        } catch (error) {
        return { error: error.message };
        }
  };

    const getDataByYear = async (year) => {
        try {
        const response = await axios.get(`http://localhost:3000/football/api_v1/get_teams/${year}`);
        setTeamData(response.data.result);
        } catch (error) {
        return { error: error.message };
        }
    };

    const getDataByWin = async (win) => {
        try {
        const response = await axios.get(`http://localhost:3000/football/api_v1/get_teams_win/${win}`);
        setTeamData(response.data.result);
        } catch (error) {
        return { error: error.message };
        }
    };

    const getDataByGoalsFor = async (year) => {
        try {
        const response = await axios.get(`http://localhost:3000/football/api_v1/get_teams_goals_for/${year}`);
        setTeamData(response.data.result);
        } catch (error) {
        return { error: error.message };
        }
    };

    // Function to fetch team data from the server
    const fetchTeamData = async () => {
        try {
        const response = await axios.get(`http://localhost:3000/football/api_v1/get_teams/${selectedTeam}`);
        setTeamData(response.data.result);
        } catch (error) {
        console.error(error);
        }
    };

    // Function to calculate team stats (total games played, drawn, won)
    const calculateTeamStats = () => {
        const totalGamesPlayed = teamData.reduce((acc, curr) => acc + curr.GamesPlayed, 0);
        const totalDraws = teamData.reduce((acc, curr) => acc + curr.Draw, 0);
        const totalWins = teamData.reduce((acc, curr) => acc + curr.Win, 0);

        setTeamStats({
        totalGamesPlayed,
        totalDraws,
        totalWins
        });
    };

    // Trigger fetching team data and calculating stats on component mount or team change
    useEffect(() => {
        fetchTeamData();
    }, [selectedTeam]);

    // Calculate team stats whenever team data changes
    useEffect(() => {
        calculateTeamStats();
    }, [teamData]);

    const [selectedTeam, setSelectedTeam] = useState('');

    // Function to handle team selection
    const handleTeamSelect = (event) => {
        setSelectedTeam(event.target.value);
    };

  return (
    <div>
      <h1>Football Data</h1>

      {/* Add Team Form */}
      <form onSubmit={handleAddTeam}>
        <input type="text" placeholder="Team Name" value={newTeamData.Team} onChange={(e) => setNewTeamData({ ...newTeamData, Team: e.target.value })} />
        <input type="number" placeholder="Games Played" value={newTeamData.GamesPlayed} onChange={(e) => setNewTeamData({ ...newTeamData, GamesPlayed: e.target.value })} />
        <input type="number" placeholder="Win" value={newTeamData.Win} onChange={(e) => setNewTeamData({ ...newTeamData, Win: e.target.value })} />
        <input type="number" placeholder="Draw" value={newTeamData.Draw} onChange={(e) => setNewTeamData({ ...newTeamData, Draw: e.target.value })} />
        <input type="number" placeholder="Loss" value={newTeamData.Loss} onChange={(e) => setNewTeamData({ ...newTeamData, Loss: e.target.value })} />
        <input type="number" placeholder="Goals For" value={newTeamData.GoalsFor} onChange={(e) => setNewTeamData({ ...newTeamData, GoalsFor: e.target.value })} />
        <input type="number" placeholder="Goals Against" value={newTeamData.GoalsAgainst} onChange={(e) => setNewTeamData({ ...newTeamData, GoalsAgainst: e.target.value })} />
        <input type="number" placeholder="Points" value={newTeamData.Points} onChange={(e) => setNewTeamData({ ...newTeamData, Points: e.target.value })} />
        <button type="submit">Add Team</button>
      </form>

      {/* Update Team Form */}
      <form onSubmit={handleUpdateTeam}>
        <input type="text" placeholder="Team Name" value={updateTeamData.Team} onChange={(e) => setUpdateTeamData({ ...updateTeamData, Team: e.target.value })} />
        <input type="number" placeholder="Games Played" value={updateTeamData.GamesPlayed} onChange={(e) => setUpdateTeamData({ ...updateTeamData, GamesPlayed: e.target.value })} />
        <input type="number" placeholder="Win" value={updateTeamData.Win} onChange={(e) => setUpdateTeamData({ ...updateTeamData, Win: e.target.value })} />
        <input type="number" placeholder="Draw" value={updateTeamData.Draw} onChange={(e) => setUpdateTeamData({ ...updateTeamData, Draw: e.target.value })} />
        <input type="number" placeholder="Loss" value={updateTeamData.Loss} onChange={(e) => setUpdateTeamData({ ...updateTeamData, Loss: e.target.value })} />
        <input type="number" placeholder="Goals For" value={updateTeamData.GoalsFor} onChange={(e) => setUpdateTeamData({ ...updateTeamData, GoalsFor: e.target.value })} />
        <input type="number" placeholder="Goals Against" value={updateTeamData.GoalsAgainst} onChange={(e) => setUpdateTeamData({ ...updateTeamData, GoalsAgainst: e.target.value })} />
        <input type="number" placeholder="Points" value={updateTeamData.Points} onChange={(e) => setUpdateTeamData({ ...updateTeamData, Points: e.target.value })} />
        <input type="number" placeholder="Year" value={updateTeamData.Year} onChange={(e) => setUpdateTeamData({ ...updateTeamData, Year: e.target.value })} />
        <button type="submit">Update Team</button>
      </form>

      {/* Delete Team */}
      <button onClick={() => deleteTeam('TeamName')}>Delete Team</button>

      {/* Get Data By Year */}
      <input type="text" value={year} onChange={(e) => setYear(e.target.value)} />
      <button onClick={getDataByYear}>Get Data By Year</button>

      {/* Get Data By Win */}
      <input type="text" value={win} onChange={(e) => setWin(e.target.value)} />
      <button onClick={getDataByWin}>Get Data By Win</button>

      {/* Get Data By Goals For */}
      <button onClick={getDataByGoalsFor}>Get Data By Goals For</button>

      <div>
      <h1>Football Data</h1>

      {/* Team selection dropdown */}
      <select value={selectedTeam} onChange={handleTeamSelect}>
        <option value="">Select Team</option>
        {/* Populate options with teams from fetched data */}
        {teamData.map((team, index) => (
          <option key={index} value={team.Team}>
            {team.Team}
          </option>
        ))}
      </select>

      {/* Display Team Stats */}
      <div>
        {selectedTeam && (
          <div>
            <h2>Team: {selectedTeam}</h2>
            <p>Total Games Played: {teamStats.totalGamesPlayed || 0}</p>
            <p>Total Draws: {teamStats.totalDraws || 0}</p>
            <p>Total Wins: {teamStats.totalWins || 0}</p>
          </div>
        )}
      </div>
    </div>

      {/* Display Data */}
      <div>
        {Object.keys(teamData).length > 0 && (
          <table>
            <thead>
              <tr>
                {/* Adjust these headers based on your data */}
                <th>Team</th>
                <th>Wins</th>
                {/* ... Other necessary columns */}
              </tr>
            </thead>
            <tbody>
              {teamData.map((team, index) => (
                <tr key={index}>
                  <td>{team.Team}</td>
                  <td>{team.Win}</td>
                  {/* ... Render other necessary data */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FootballApp;