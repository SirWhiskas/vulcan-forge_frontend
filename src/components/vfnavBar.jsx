import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

const VFNavBar = ({ user }) => {
    return (
        <Navbar bg="light" variant="light">
            <Navbar.Brand href="/">VulcanForge</Navbar.Brand>
            <Nav className="mr-auto">

            </Nav>
            <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-primary">Search</Button>
            </Form>
      </Navbar> 
    );
};

export default VFNavBar;