import React from "react";
import DataProvider from "./DataProvider";

export default class FrameManager {

    constructor() {
        this.currentFrame = 0;
        this.scaleFactor = 1;
    }

    getFrameImageUrl() {
        return DataProvider.getFrameImageUrl(this.currentFrame);
    }

}