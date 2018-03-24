import React from 'react';
import './App.css';

import DataProvider from './classes/DataProvider';
import Viewport from './components/Viewport';
import OpenFileButton from './components/OpenFileButton';
import Timeline from './components/Timeline';

class App extends React.Component {

    winResizeTID = null;

    constructor(props) {
        super(props);

        this.config = {
            timelineHeight: 52,
            timeCursorWidth: 2
        };

        this.state = {
            stateChangeType: '', // TODO: make enum state update type
            eventList: [],
            scaleFactor: 1,
            currentFrame: 0,
            timeBrackets: [0, 0],
            originalViewportWidth: window.innerWidth,
            originalViewportHeight: window.innerHeight
        };

        this.handleFilesDrop = this.handleFilesDrop.bind(this);
        this.handleFilesDrag = this.handleFilesDrag.bind(this);
        this.handleOpenFiles = this.handleOpenFiles.bind(this);
        this.handleTimeBracketsUpdate = this.handleTimeBracketsUpdate.bind(this);
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
            const url = DataProvider.getFrameImageUrl(0);
            if (url) {
                image.src = url;
                image.addEventListener('load', () => {
                    resolve({
                        w: image.naturalWidth,
                        h: image.naturalHeight
                    });
                })
            } else reject();
        });
    }

    getScaleFactor(vpSize) {
        const w = window.innerWidth;
        const h = window.innerHeight - this.config.timelineHeight;
        return Math.min(w / vpSize.w, h / vpSize.h );
    }

    setViewportSize() {
        this.getViewportSize().then(vpSize => {
            this.setState({
                stateChangeType: 'viewportSizeChanged',
                scaleFactor: this.getScaleFactor(vpSize),
                originalViewportWidth: vpSize.w,
                originalViewportHeight: vpSize.h
            });
        });
    }

    handleFilesDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.initDataSet(event.dataTransfer.files);
    }

    handleOpenFiles(event) {
        this.initDataSet(event.target.files);
    }

    handleTimeBracketsUpdate(timeBrackets) {
        this.setState({
            stateChangeType: 'timeBracketsUpdated',
            timeBrackets: timeBrackets
        });
    }

    initDataSet(files) {
        DataProvider.fileList = files;
        DataProvider.loadEventData().then(events => {
            this.getViewportSize().then(vpSize => {
                this.setState({
                    stateChangeType: 'newDataSetLoaded',
                    eventList: events,
                    currentFrame: 0,
                    scaleFactor: this.getScaleFactor(vpSize),
                    originalViewportWidth: vpSize.w,
                    originalViewportHeight: vpSize.h,
                    timeBrackets: [0, parseInt(events[events.length - 1].Time)]
                });
            });
        });
    }

    handleFilesDrag(event) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
    }

    render() {
        return (
            <div className='App' onDragOver={this.handleFilesDrag} onDrop={this.handleFilesDrop}>
                <OpenFileButton action={this.handleOpenFiles}/>
                <Viewport pars={this.state} config={this.config} timeBracketsUpdated={this.handleTimeBracketsUpdate} />
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
                    stateChangeType: 'timeFrameChanged',
                    currentFrame: cFrame > 1 ? cFrame - 1 : 0
                });
                break;
            case 39:
                this.setState({
                    stateChangeType: 'timeFrameChanged',
                    currentFrame: cFrame < eLen ? cFrame + 1 : eLen
                });
                break;
        }
    }
}

export default App;
