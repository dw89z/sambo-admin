import React from "react";
import Main from "./component/Main";
import Login from "./component/Login";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Private } from "./component/Private";

class App extends React.Component {
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Private exact path="/main" component={Main} />
            <Route path="*" component={Login} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
