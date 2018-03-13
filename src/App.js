import React from 'react';
import './App.css';

import OpenFileButton from './components/OpenFileButton';
import DataProvider from "./components/DataProvider";
import FrameManager from "./components/FrameManager";
import Viewport from "./components/Viewport";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.handleFilesDrop = this.handleFilesDrop.bind(this);
        this.handleFilesDrag = this.handleFilesDrag.bind(this);
        this.state = {
            eventList: []
        }
    }

    handleFilesDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        DataProvider.fileList = event.dataTransfer.files;
        // this.dataProvider = new DataProvider(this.dataSet);
        DataProvider.loadEventData().then(events => {
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
                <Viewport eventList={this.state.eventList} isReady={this.state.eventList.length}/>
            </div>
        );
    }
}

App.config = {};

export default App;
