import React, { Component } from "react";

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';

class Dashboard extends Component {
    state = {};

    render() {
        const { user } = this.props;
        console.log(user);

        return (
            <React.Fragment>
                {user && (
                    <h1>Welcome, {user.name}</h1>
                )}
                <Tabs defaultActiveKey="worlds">
                    <Tab eventKey="worlds" title="Worlds">
                        <div className="mb-2">
                            <Button variant="primary" size="lg" value="world" href="/create-new-world">
                                Create a new world!
                            </Button>
                        </div>
                    </Tab>
                    <Tab eventKey="monsters" title="Monsters">
                      
                    </Tab>
                    <Tab eventKey="locations" title="Locations">
                     
                    </Tab>
                    <Tab eventKey="npcs" title="NPCs">
                     
                    </Tab>
                    <Tab eventKey="items" title="Items">
                     
                    </Tab>
                </Tabs>
            </React.Fragment>
        );
    }
}

export default Dashboard;