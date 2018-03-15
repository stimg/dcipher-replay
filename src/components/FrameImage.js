import React from 'react';
import DataProvider from './DataProvider';

export default class FrameImage extends React.Component {

    componentDidUpdate() {
        const pars = this.props.pars;
        const container = this.refs.FrameImageContainer;
        const scale = pars.scaleFactor;
        const url = DataProvider.getFrameImageUrl(pars.currentFrame);
        const img = new Image();

        img.width = pars.originalViewportWidth * scale;
        img.height = pars.originalViewportHeight * scale;
        img.src = url;
        img.onload = () => {
            const children = container.childNodes;
            if (children.length) container.replaceChild(img, children[0]);
            else container.appendChild(img);
        }
    }

    render() {
        const pars = this.props.pars;const isReady = !!pars.eventList.length;

        return (
            <div ref="FrameImageContainer" className="frame-image-container"></div>
        );
    }
}