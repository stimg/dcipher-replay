import React from 'react';
import DataProvider from "../classes/DataProvider";

export default class OpenFileButton extends React.Component {

    render() {
        return (
            <label for="openFileInput" className="open-file-button"> Open
                <input id="openFileInput" type="file" accept=".csv, .jpg" multiple onChange={this.props.action}></input>
            </label>
        );
    }
}