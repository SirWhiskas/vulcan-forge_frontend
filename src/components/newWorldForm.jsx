import React, { Component } from "react";

import moment from 'moment';

import { toast } from "react-toastify";

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { saveWorld } from '../services/worldService';
import VFTextEditor from './common/vfTextEditor';
import NewAssetForm from './newAssetForm';

class NewWorldForm extends Component {
    state = {
        worldName: "",
        currentText: "",
        savedText: "",
        quillValue: "",
        showNeWAssetForm: false,
        newAssetFormContent: ""
    };

    handleSubmit = event => {
        event.preventDefault();
        const worldName = event.currentTarget.worldName.value;

        toast.success('Saved!');

        const savedText = this.state.currentText;

        const worldDataObj = {
            "worldName": worldName,
            "description": savedText
        };

        saveWorld(worldDataObj);

        this.setState({ worldName, savedText });
    };

    saveEditor = (e, ed, d) => {
        const currentText = d;
        this.setState({ currentText });
    };

    onEditorChange = quillValue => {
        this.setState({ quillValue });
    };

    handleNewMonster = newAssetFormContent => {
        const showNeWAssetForm = true;
        this.setState({ newAssetFormContent,  showNeWAssetForm});
    };

    handleNewAssetFormClose = () => {
        const showNeWAssetForm = false;
        this.setState({ showNeWAssetForm});
    };

    render() {
        return (
            <React.Fragment>
                <NewAssetForm content={this.state.newAssetFormContent} show={this.state.showNeWAssetForm} handleClose={this.handleNewAssetFormClose} />
                <Form onSubmit={this.handleSubmit}>
                    <Form.Row>
                        <Col xs={3}>
                            <Form.Control type="text" name="worldName" id="worldName" placeholder="Enter world name..." />
                        </Col>
                        <Col xs="auto">
                            <Button type="submit" className="mb-2">
                                Save changes
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>
                <VFTextEditor handleNewMonster={this.handleNewMonster} />
            </React.Fragment>
        );
    }
}

export default NewWorldForm;