import React from "react";
import Main from "./Component/Main";
import Login from "./Component/Login";
import WithAuth from "./Component/WithAuth";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  useHistory
} from "react-router-dom";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  state = {
    login: false
  };

  history() {
    let history = useHistory();
  }

  handleLogin(e) {
    console.log(e);
    e.preventDefault();
    this.setState({
      login: true
    });
  }

  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route exact path="/">
              <Login handleLogin={this.handleLogin} history={this.history} />
            </Route>
            <Route path="/main" component={WithAuth(Main)} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
