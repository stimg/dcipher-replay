import React from "react";
import FrameManager from "./FrameManager";

export default class Viewport extends React.Component {

    constructor(props) {
        super(props);
        this.frameManager = new FrameManager(props.dataSet);
        this.state = {
            isReady: false,
            isLoading: false,
            eventList: props.eventList
        };
    }


    render() {
        return (
            <div id="viewport">
                <div className={this.isReady ? "hidden" : "drag-files-msg"}>[ + ] To OPEN project <br /> please select ALL files in the project folder and drag them here</div>
            </div>
        );
    }
}