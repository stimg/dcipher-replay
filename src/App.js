import React from 'react';
import './App.css';

import OpenFileButton from './components/OpenFileButton';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleFilesDrop = this.handleFilesDrop.bind(this);
        this.handleFilesDrag = this.handleFilesDrag.bind(this);
    }

    handleFilesDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        const files = event.dataTransfer.files;
    }

    handleFilesDrag(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    render() {
        return (
            <div className="App" onDragOver={this.handleFilesDrag} onDrop={this.handleFilesDrop}>
                <OpenFileButton/>
            </div>
        );
    }
}

export default App;
