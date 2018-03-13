import React from 'react';
import './App.css';

import OpenFileButton from './components/OpenFileButton';
import FileLoader from "./components/FileLoader";
import FrameManager from "./components/FrameManager";
import Viewport from "./components/Viewport";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.handleFilesDrop = this.handleFilesDrop.bind(this);
        this.handleFilesDrag = this.handleFilesDrag.bind(this);
        this.state = {
            eventList: null
        }
    }

    handleFilesDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        this.dataSet = event.dataTransfer.files;
        this.fileLoader = new FileLoader(this.dataSet);
        this.fileLoader.loadEventData().then(events => {
            this.setState({
                eventList: events
            });
        });
    }

    handleFilesDrag(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    render() {
        return (
            <div className="App" onDragOver={this.handleFilesDrag} onDrop={this.handleFilesDrop}>
                {/*<OpenFileButton/>*/}
                <Viewport eventList={this.state.eventList}/>
            </div>
        );
    }
}

App.config = {};

export default App;
