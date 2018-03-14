import React from 'react';
import './App.css';

import DataProvider from './components/DataProvider';
import Viewport from './components/Viewport';

class App extends React.Component {

    winResizeTID = null;

    constructor(props) {
        super(props);

        this.state = {
            eventList: [],
            scaleFactor: 1,
            currentFrame: 0,
            originalViewportWidth: 0,
            originalViewportHeight: 0
        };

        this.handleFilesDrop = this.handleFilesDrop.bind(this);
        this.handleFilesDrag = this.handleFilesDrag.bind(this);
        this.keyInputHandler = this.keyInputHandler.bind(this);

        window.onkeydown = this.keyInputHandler;
        window.onresize = this.handleWindowResize.bind(this);
    }

    get scaleFactor() {
        return this.state.scaleFactor;
    }

    handleWindowResize() {
        if (this.winResizeTID) {
            clearTimeout(this.winResizeTID);
        }
        this.winResizeTID = setTimeout(() => this.setViewportSize(), 500);
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

    setViewportSize() {
        this.getViewportSize().then(vpSize => {
            this.setState({
                scaleFactor: this.getScaleFactor(vpSize),
                originalViewportWidth: vpSize.w,
                originalViewportHeight: vpSize.h
            });
        });
    }

    handleFilesDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        DataProvider.fileList = event.dataTransfer.files;
        DataProvider.loadEventData().then(events => {
            this.setState({
                eventList: events,
            });
            this.setViewportSize();
        });
    }

    handleFilesDrag(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    render() {
        return (
            <div className='App' onDragOver={this.handleFilesDrag} onDrop={this.handleFilesDrop}>
                <Viewport pars={this.state} />
            </div>
        );
    }

    keyInputHandler(event) {

        const keyCode = event.keyCode;
        const cFrame = this.state.currentFrame;
        const eLen = this.state.eventList.length - 1;

        switch (keyCode) {
            case 37:
                this.setState({
                    currentFrame: cFrame > 1 ? cFrame - 1 : 0
                });
                break;
            case 39:
                this.setState({
                    currentFrame: cFrame < eLen ? cFrame + 1 : eLen
                });
                break;
        }
    }
}

App.config = {};

export default App;
