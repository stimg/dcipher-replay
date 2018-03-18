import React from 'react';
import IconDrawer from '../classes/IconDrawer';

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
        this.bracketsState = {
            leftBracketX: 0,
            rightBracketX: 0,
            selectedBracket: '',
            timeCursorX: 0
        };
        this.iconDrawer = new IconDrawer();
        this.handleTimelineMouseDown = this.handleTimelineMouseDown.bind(this);
        this.handleTimelineMouseUp = this.handleTimelineMouseUp.bind(this);
        this.handleTimelineMouseMove = this.handleTimelineMouseMove.bind(this);
    }

    componentDidUpdate() {
        this.drawTimeline();
        this.moveTimeCursor();
        this.resetTimeBracketUI();
    }

    drawTimeline() {
        const pars = this.props.pars;
        const events = pars.eventList;
        const currentFrame = pars.currentFrame;
        const duration = parseFloat(events[events.length - 1].Time);
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

    drawTimePath(context, index) {

        const pars = this.props.pars;
        const events = pars.eventList;
        const duration = parseFloat(events[events.length - 1].Time);
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

    moveTimeCursor() {
        const pars = this.props.pars;
        const currentFrame = pars.currentFrame;
        const events = pars.eventList;
        const duration = parseInt(events[events.length - 1].Time);
        const timeUnit = (pars.originalViewportWidth * pars.scaleFactor) / duration;
        const x = events[currentFrame].Time * timeUnit;

        this.refs.timeCursor.style.left = x + 'px';
        this.bracketsState.timeCursorX = x;

        if (x > this.bracketsState.rightBracketX) this.moveBracket(x, 'right');
        if (x < this.bracketsState.leftBracketX) this.moveBracket(x, 'left');
    }

    resetTimeBracketUI() {
        const pars = this.props.pars;
        if (pars.stateChangeType !== 'newDataSetLoaded') return;

        const timeBracketsRef = this.refs.timeBrackets;
        const right = Math.floor(pars.originalViewportWidth * pars.scaleFactor);

        timeBracketsRef.style.left = 0;
        timeBracketsRef.style.width = right + 'px';
        this.bracketsState.leftBracketX = 0;
        this.bracketsState.rightBracketX = right;
    }

    moveBracket(x, bracket = this.bracketsState.selectedBracket) {
        const pars = this.props.pars;
        const events = pars.eventList;
        const duration = parseInt(events[events.length - 1].Time);
        const pixelTime = duration / (pars.originalViewportWidth * pars.scaleFactor);
        const timeBrackets = document.getElementById('timeBrackets');
        const right = this.bracketsState.rightBracketX;
        const left = this.bracketsState.leftBracketX;

        if (bracket === 'left') {
            timeBrackets.style.left = x + 'px';
            timeBrackets.style.width = right - x + 'px';
            this.bracketsState.leftBracketX = x;
            this.props.timeBracketsUpdated([Math.floor(x * pixelTime), Math.ceil(right * pixelTime)]);
        }
        if (bracket === 'right') {
            timeBrackets.style.width = x - left + 'px';
            this.bracketsState.rightBracketX = x;
            this.props.timeBracketsUpdated([Math.floor(left * pixelTime), Math.ceil(x * pixelTime)]);
        }
    }

    getBracketUnderMouse(x) {
        const delta = 10;
        const timeBrackets = document.getElementById('timeBrackets');
        const bracketsRect = timeBrackets.getBoundingClientRect();

        if (Math.abs(x - bracketsRect.left) < delta) return 'left';
        else if (Math.abs(x - bracketsRect.right) < delta) return 'right';
        return '';
    }

    handleTimelineMouseDown(event) {
        this.bracketsState.selectedBracket = this.getBracketUnderMouse(event.clientX);
    }

    handleTimelineMouseUp() {
        this.bracketsState.selectedBracket = '';
    }

    handleTimelineMouseMove(event) {
        const delta = 10;
        const timeline = event.target;
        const x = event.clientX;
        const right = this.bracketsState.rightBracketX;
        const left = this.bracketsState.leftBracketX;

        if (this.getBracketUnderMouse(x)) timeline.style.cursor = 'ew-resize';
        else timeline.style.cursor = 'default';

        if ((x < right - delta && x < this.bracketsState.timeCursorX) || (x > left + delta && x > this.bracketsState.timeCursorX)) {
            this.moveBracket(x);
        }
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
            <div
                id="timeline"
                className={isReady ? '' : 'hidden'}
                style={{width: w + 'px', height: th + 'px', top: h - 1 + 'px'}}
                onMouseDown={this.handleTimelineMouseDown}
                onMouseUp={this.handleTimelineMouseUp}
                onMouseMove={this.handleTimelineMouseMove}>

                <canvas ref="timelineCanvas" className='timeline' width={w} height={th}></canvas>
                <div ref="timeBrackets" id="timeBrackets" className='time-brackets' style={{height: th + 'px', width: w + 'px'}}></div>
                <div ref="timeCursor" className="time-cursor" style={{width: tcw + 'px', height: th + 'px'}}></div>
            </div>
        );
    }
}