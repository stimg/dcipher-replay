import React from 'react';
import IconDrawer from '../classes/IconDrawer';
import Draggable from 'react-draggable';

const LINE_WIDTH_BEFORE = 4;
const LINE_WIDTH_AFTER = 4;
const LINE_WIDTH_CURRENT = 6;
const ICON_STROKE = 2;
const ICON_STROKE_CURRENT = 3;
const FILL_STYLE = '#ffffff';
const STROKE_STYLE_BEFORE = '#f732b3';
const STROKE_STYLE_CURRENT = '#ff0000';
const STROKE_STYLE_AFTER = '#0073ff';

export default class Timeline extends React.Component {

    constructor(props) {
        super(props);
        this.config = props.config;
        this.iconDrawer = new IconDrawer();
        this.handleBracketDrag = this.handleBracketDrag.bind(this);
    }

    componentDidUpdate() {
        this.drawTimeline();
        this.moveTimeCursor();
    }

    drawTimeline() {
        const pars = this.props.pars;
        const events = pars.eventList;
        const currentFrame = pars.currentFrame;
        const duration = events[events.length - 1].Time;
        const timeUnit = pars.originalViewportWidth * pars.scaleFactor / duration;
        const y = this.config.timelineHeight / 2;

        const canvas = this.refs.timelineCanvas;
        const context = canvas.getContext('2d');

        context.font = 'bold 14px Helvetica';
        context.fillStyle = FILL_STYLE;
        context.lineCap = 'butt';
        context.lineJoin = 'miter';
        context.miterLimit = 4.0;

        context.clearRect(0, 0, canvas.width, canvas.height);


        if (currentFrame) {
            // Previous path
            context.lineWidth = LINE_WIDTH_BEFORE;
            context.strokeStyle = STROKE_STYLE_BEFORE;
            context.beginPath();
            context.moveTo(0, y);
            for (let i = 1; i < currentFrame; i++) {
                this.drawTimePath(context, i);
            }
            context.stroke();

            // Current path
            context.beginPath();
            context.lineWidth = LINE_WIDTH_CURRENT;
            context.strokeStyle = STROKE_STYLE_CURRENT;
            context.moveTo(events[currentFrame - 1].Time * timeUnit, y);
            this.drawTimePath(context, currentFrame);
            context.stroke();
        }

        // Next path
        context.beginPath();
        context.lineWidth = LINE_WIDTH_AFTER;
        context.strokeStyle = STROKE_STYLE_AFTER;
        context.moveTo(events[currentFrame].Time * timeUnit, y);
        for (let i = currentFrame + 1; i < events.length; i++) {
            this.drawTimePath(context, i);
        }
        context.stroke();

        events.forEach((row, index) => {
            const x = row.Time * timeUnit;
            this.iconDrawer.setLineWidth(index === currentFrame ? ICON_STROKE_CURRENT : ICON_STROKE);
            this.iconDrawer.setStrokeStyle(index < currentFrame ? STROKE_STYLE_BEFORE : index === currentFrame ? STROKE_STYLE_CURRENT : STROKE_STYLE_AFTER);
            this.iconDrawer.drawEventIcon(context, row.Event, x, y);
        });
    }

    moveTimeCursor() {
        const pars = this.props.pars;
        const currentFrame = pars.currentFrame;
        const events = pars.eventList;
        const duration = events[events.length - 1].Time;
        const timeUnit = (pars.originalViewportWidth * pars.scaleFactor - this.config.timeCursorWidth) / duration;
        const x = events[currentFrame].Time * timeUnit;

        this.refs.timeCursor.style.left = x + 'px';
    }

    drawTimePath(context, index) {

        const pars = this.props.pars;
        const events = pars.eventList;
        const duration = events[events.length - 1].Time;
        const timeUnit = pars.originalViewportWidth * pars.scaleFactor / duration;
        const row = events[index];
        const x = row.Time * timeUnit;
        const y = this.config.timelineHeight / 2;
        const prevX = events[index - 1].Time * timeUnit;
        const lineWidth = context.lineWidth;

        if (row.Event.match(/_DRAG_END|MOUSE_WHEEL_END/)) {

            context.stroke();
            context.save();

            context.beginPath();
            context.setLineDash([lineWidth, lineWidth]);
            context.moveTo(prevX, y);
            context.lineTo(x, y);
            context.stroke();
            context.restore();

            // Begin new path and move start to current mouse position
            context.beginPath();
            context.moveTo(x, y);

        } else context.lineTo(x, y);
    }

    handleBracketDrag(e, ui) {
        const timeBrackets = this.refs.timeBrackets;
        const rect = this.refs.leftBracket.getBoundingClientRect();
        const left = rect.x;
        const width = this.refs.rightBracket.getBoundingClientRect().x - left;

        timeBrackets.style.left = left + rect.width / 2 + 'px';
        timeBrackets.style.width = width + 'px';
    }

    render() {
        const pars = this.props.pars;
        const isReady = pars.eventList.length > 0;
        const scale = pars.scaleFactor;
        const w = pars.originalViewportWidth * scale;
        const h = pars.originalViewportHeight * scale;
        const th = this.config.timelineHeight;
        const tcw = this.config.timeCursorWidth;

        return (
            <div id="timeline" className={isReady ? '' : 'hidden'} style={{width: w + 'px', height: th + 'px', top: h - 1 + 'px'}}>
                <canvas ref="timelineCanvas" className='timeline' width={w} height={th}></canvas>
                <div ref="timeBrackets" className='time-brackets' style={{width: tcw + 'px', height: th + 'px', width: w}}></div>
                <Draggable
                    axis="x"
                    bounds="#timeline"
                    handle=".left-bracket"
                    defaultPosition={{x: 0, y: 0}}
                    position={null}
                    grid={[1, 1]}
                    onStart={this.handleStart}
                    onDrag={this.handleBracketDrag}
                    onStop={this.handleStop}>
                    <div ref="leftBracket" className="left-bracket"></div>
                </Draggable>
                <Draggable
                    axis="x"
                    bounds="#timeline"
                    handle=".right-bracket"
                    defaultPosition={{x: 0, y: 0}}
                    position={null}
                    grid={[1, 1]}
                    onStart={this.handleStart}
                    onDrag={this.handleBracketDrag}
                    onStop={this.handleStop}>
                    <div ref="rightBracket" className="right-bracket" style={{left: w - 10}}></div>
                </Draggable>
                <div ref="timeCursor" className="time-cursor"  style={{width: tcw + 'px', height: th + 'px'}}></div>
            </div>
        );
    }
}