import React, { Component } from 'react';

// Navigation
import { Route, Redirect, Switch } from "react-router-dom";

// Components
import VFNavBar from "./components/vfnavBar";
import Dashboard from "./components/dashboard";
import NewWorldForm from "./components/newWorldForm";

import { ToastContainer } from "react-toastify";

// Services
import auth from "./services/authService";

class App extends Component {
    state = {};

    componentDidMount() {
        const user = auth.getCurrentUser();
        this.setState({ user });
    }
    render() {
        const { user } = this.state;
        return (
            <React.Fragment>
                <ToastContainer />
                <VFNavBar user={user} />
                <Switch>
                <Route
                    path="/dashboard"
                    render={props => <Dashboard {...props} user={this.state.user} />}
                />
                <Route 
                    path="/create-new-world"
                    render={props => <NewWorldForm {...props} user={this.state.user} />}
                />
                <Redirect from="/" exact to="/dashboard" />
                </Switch>
            </React.Fragment>
        );
    }
    
}

export default App;
