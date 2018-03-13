import React from 'react';
import FileLoader from "./FileLoader";

export default class OpenFileButton extends React.Component {

    constructor(props) {
        super(props);

        this.loadEventData = FileLoader.loadEventData.bind(this);
    }

    render() {
        return (
            <label for="openFileInput" className="open-file-button"> Open
                <input id="openFileInput" type="file" accept=".csv, .jpg" multiple onChange={this.loadEventData}></input>
            </label>
        );
    }
}