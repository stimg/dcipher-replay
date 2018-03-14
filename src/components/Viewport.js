import React from 'react';
import DataProvider from './DataProvider';
import FlowMap from './FlowMap';

export default class Viewport extends React.Component {

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
                {element}
                <FlowMap pars={pars} />
            </div>
        );
    }
}