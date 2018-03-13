import React from 'react';
import './App.css';

import OpenFileButton from './components/OpenFileButton';
import DataProvider from "./components/DataProvider";
import Viewport from "./components/Viewport";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            eventList: [],
            scaleFactor: 1,
            currentFrame: 0
        };

        this.handleFilesDrop = this.handleFilesDrop.bind(this);
        this.handleFilesDrag = this.handleFilesDrag.bind(this);
        this.keyInputHandler = this.keyInputHandler.bind(this);

        window.onkeydown = this.keyInputHandler;
    }

    get scaleFactor() {
        return this.state.scaleFactor;
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
                <Viewport eventList={this.state.eventList} isReady={this.state.eventList.length} currentFrame={this.state.currentFrame} />
            </div>
        );
    }

    keyInputHandler(event) {

        const keyCode = event.keyCode;
        const cFrame = this.state.currentFrame;
        const eLen = this.state.eventList.length;

        switch (keyCode) {
            case 37:
                this.setState({
                    currentFrame: cFrame > 1 ? cFrame - 1 : 0
                });
                break;
            case 39:
                this.setState({
                    currentFrame: cFrame < eLen - 1 ? cFrame + 1 : eLen
                });
                break;
        }
    }
}

App.config = {};

export default App;
