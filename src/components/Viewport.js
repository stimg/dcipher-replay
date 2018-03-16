import React from 'react';
import DataProvider from '../classes/DataProvider';
import FlowMap from './FlowMap';
import FrameImage from './FrameImage';
import Timeline from './Timeline';

export default class Viewport extends React.Component {

    constructor(props) {
        super(props);
        this.config = props.config;
    }

    render() {
        const pars = this.props.pars;
        const isReady = !!pars.eventList.length;
        const scale = pars.scaleFactor;

        let element;
        if (isReady) {
            const url = 'url(' + DataProvider.getFrameImageUrl(pars.currentFrame) + ')';
            element = <div className='frame-image' style={{backgroundImage: url, width: pars.originalViewportWidth * scale, height: pars.originalViewportHeight * scale}}/>
        } else {
            element = <div className='drag-files-msg'>[ + ] To OPEN project <br/> please select ALL files in the project folder and drag them here</div>
        }

        return (
            <div id='viewport' style={{width: pars.originalViewportWidth * scale || '100%', height: pars.originalViewportHeight * scale || '100%'}}>
                <div className={isReady ? 'hidden' : 'drag-files-msg'}>[ + ] To OPEN project <br/> please select ALL files in the project folder and drag them here</div>
                <FrameImage pars={pars} />
                <FlowMap pars={pars} config={this.config} />
                <Timeline pars={pars} config={this.config} />
            </div>
        );
    }
}