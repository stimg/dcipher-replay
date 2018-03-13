import React from "react";
import FileLoader from "./FileLoader";

export default class FrameManager {

    constructor(dataSet) {
        this.state = {
            currentFrame: 0,
            scaleFactor: 1,
            isDataSetReady: false
        };
        this.fileLoader = new FileLoader(dataSet)
    }

    get dataSetReady() {
        return this.state.isDataSetReady;
    }

    resetState() {
        this.fileLoader.loadEventData().then(eventData => {
            this.setState({
                isDataSetReady: true
            });
        });
    }

}