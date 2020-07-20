import React, { Component } from "react";

import moment from 'moment';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editor, EditorState } from 'draft-js';
import ReactQuill from 'react-quill';

import { toast } from "react-toastify";

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { saveWorld } from '../services/worldService';
import VFTextEditor from './common/vfTextEditor';

class NewWorldForm extends Component {
    state = {
        worldName: "",
        currentText: "",
        savedText: "",
        quillValue: ""
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

    render() {
        console.log(CKEditor);
        return (
            <React.Fragment>
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
                <VFTextEditor />
            </React.Fragment>
        );
    }
}

export default NewWorldForm;