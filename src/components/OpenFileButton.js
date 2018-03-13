import React from 'react';

export default class OpenFileButton extends React.Component {

    constructor(props) {
        super(props);

        this.loadFile = this.loadFile.bind(this);
    }

    loadFile(event) {
        const file = event.target.files[0];
        const url = window.URL.createObjectURL(file);
        console.log(url);
    };

    render() {
        return (
            <label for="openFileInput" className="open-file-button"> Open
                <input id="openFileInput" type="file" accept=".csv, .png, .jpg" multiple onChange={this.loadFile}></input>
            </label>
        );
    }
}