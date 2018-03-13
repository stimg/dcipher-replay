import React from "react";
import DataProvider from "./DataProvider";

export default class Viewport extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let element;
        if (this.props.isReady) {
            const url = "url('" + DataProvider.getFrameImageUrl(this.props.currentFrame); + "')";
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