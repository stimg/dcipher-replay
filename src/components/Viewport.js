import React from "react";
import FrameManager from "./FrameManager";

export default class Viewport extends React.Component {

    constructor(props) {
        super(props);
        this.frameManager = new FrameManager();
    }

    render() {

        let element;
        if (this.props.isReady) {
            const url = "url('" + this.frameManager.getFrameImageUrl() + "')";
            element = <div className="frame-image" style={{backgroundImage: url}}/>
        } else {
            element = <div className="drag-files-msg">[ + ] To OPEN project <br /> please select ALL files in the project folder and drag them here</div>
        }

        return (
            <div id="viewport">
                {element}
            </div>
        );
    }
}