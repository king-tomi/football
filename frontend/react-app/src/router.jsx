import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import FootballApp from './FootballApp'; // Assume this is your main component
import AddTeamComponent from './AddTeamComponent'; // Your Add Team component
import UpdateTeamComponent from './UpdateTeamComponent'; // Your Update Team component
import TeamStatsComponent from './TeamStatsComponent'; // Component to show team stats
import NotFound from './NotFound'; // A component for 404 routes

function App() {
  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add-team">Add Team</Link>
            </li>
            <li>
              <Link to="/update-team">Update Team</Link>
            </li>
            <li>
              <Link to="/team-stats">Team Stats</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Switch>
          <Route exact path="/">
            {/* Your FootballApp component */}
            <FootballApp />
          </Route>
          <Route path="/add-team">
            {/* Your Add Team component */}
            <AddTeamComponent />
          </Route>
          <Route path="/update-team">
            {/* Your Update Team component */}
            <UpdateTeamComponent />
          </Route>
          <Route path="/team-stats">
            {/* Your Team Stats component */}
            <TeamStatsComponent />
          </Route>
          <Route>
            {/* 404 Not Found */}
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;