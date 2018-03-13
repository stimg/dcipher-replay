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
            eventList: [],
            scaleFactor: 1
        };
    }

    getViewportSize() {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = DataProvider.getFrameImageUrl(0);
            image.addEventListener('load', () => {
                resolve({
                    w: image.naturalWidth,
                    h: image.naturalHeight
                });
            })
        });
    }

    getScaleFactor(vpSize) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        return Math.min(w / vpSize.w, h / vpSize.h);
    }

    handleFilesDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        DataProvider.fileList = event.dataTransfer.files;
        // this.dataProvider = new DataProvider(this.dataSet);
        DataProvider.loadEventData().then(events => {
            this.getViewportSize().then(vpSize => {
                const scaleFactor = this.getScaleFactor(vpSize);
                this.setState({
                    eventList: events,
                    scaleFactor: scaleFactor
                });
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
                <Viewport eventList={this.state.eventList} isReady={this.state.eventList.length} scaleFactor={this.getScaleFactor} />
            </div>
        );
    }
}

App.config = {};

export default App;
