/**
 * Flow map class draws flow map
 *
 * CSV event data:
 * Time, Event, X, Y, Distance, EventWeight, Image, Bookmark, Taskmark
 *
 * Supported events:
 * START STOP
 * LB_CLICK
 * LB_DBL_CLICK
 * LB_DRAG_START
 * LB_DRAG_END
 * MB_CLICK
 * MB_DBL_CLICK
 * MB_DRAG_START
 * MB_DRAG_END
 * RB_CLICK
 * RB_DBL_CLICK
 * RB_DRAG_START
 * RB_DRAG_END
 * MOUSE_WHEEL_START_SCROLL
 * MOUSE_WHEEL
 * MOUSE_WHEEL_END_SCROLL
 * KEYPRESS
 */
import React from 'react';
import IconDrawer from '../classes/IconDrawer';

const LINE_WIDTH_BEFORE = 4;
const LINE_WIDTH_AFTER = 2;
const LINE_WIDTH_CURRENT = 6;
const ICON_STROKE = 2;
const ICON_STROKE_CURRENT = 4;
const FILL_STYLE = '#ffffff';
const STROKE_STYLE_BEFORE = '#f732b3';
const STROKE_STYLE_CURRENT = '#ff0000';
const STROKE_STYLE_AFTER = '#0073ff';

export default class FlowMap extends React.Component {

    constructor(props) {
        super(props);
        this.config = props.config;
        this.iconDrawer = new IconDrawer();
    }

    componentDidUpdate() {
        this.drawFlowMap();
    }

    drawFlowMap() {

        const pars = this.props.pars;
        if (!pars.eventList.length) return;

        const timeBrackets = pars.timeBrackets;
        const currentFrameIndex = pars.currentFrame;
        const curFrameTime = parseInt(pars.eventList[currentFrameIndex].Time);
        const scale = pars.scaleFactor;
        const events = pars.eventList;
        const canvas = this.refs.flowMap;
        const context = canvas.getContext('2d');

        context.font = 'bold 14px Helvetica';
        context.lineWidth = LINE_WIDTH_AFTER;
        context.fillStyle = FILL_STYLE;
        context.strokeStyle = STROKE_STYLE_BEFORE;

        context.lineCap = 'butt';
        context.lineJoin = 'miter';
        context.miterLimit = 4.0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 3.0;
        context.shadowBlur = 4.0;
        context.shadowColor = 'rgba(0, 0, 0, 0.3)';

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw path before
        context.lineWidth = LINE_WIDTH_BEFORE;
        context.strokeStyle = STROKE_STYLE_BEFORE;
        context.beginPath();
        events.filter(event => {

            const time = parseInt(event.Time);
            return time >= timeBrackets[0] && time <= curFrameTime;

        }).forEach((row, index, events) => this.drawPathChunk(row, index, events, context));
        context.stroke();

        // Draw current path
        if (currentFrameIndex) {
            context.lineWidth = LINE_WIDTH_CURRENT;
            context.strokeStyle = STROKE_STYLE_CURRENT;
            context.beginPath();
            const cPath = [events[currentFrameIndex - 1], events[currentFrameIndex]];
            cPath.forEach((row, index, events) => this.drawPathChunk(row, index, events, context));
            context.stroke();
        }

        // Draw path after
        context.lineWidth = LINE_WIDTH_AFTER;
        context.strokeStyle = STROKE_STYLE_AFTER;
        context.beginPath();
        events.filter(event => {

            const time = parseInt(event.Time);
            return time >= curFrameTime && time <= timeBrackets[1];

        }).forEach((row, index, events) => this.drawPathChunk(row, index, events, context));
        context.stroke();


        // Draw event icons
        let eType = '';
        let eCounter = 0;
        events.filter(event => {

            const time = parseInt(event.Time);
            return (time >= timeBrackets[0] && time <= timeBrackets[1]) || time === curFrameTime;

        }).forEach((row) => {
            const x = row.X * scale;
            const y = row.Y * scale;
            const time = parseInt(row.Time);

            // Count events
            if (row.Event === eType) eCounter++;
            else {
                eCounter = 1;
                eType = row.Event;
            }
            this.iconDrawer.setLineWidth(time === curFrameTimels
                                         ? ICON_STROKE_CURRENT : ICON_STROKE);
            this.iconDrawer.setStrokeStyle(time < curFrameTime ? STROKE_STYLE_BEFORE : time > curFrameTime ? STROKE_STYLE_AFTER : STROKE_STYLE_CURRENT);
            this.iconDrawer.drawEventIcon(context, row.Event, x, y, eCounter);
        });

    };

    drawPathChunk(row, index, events, context) {
        const scale = this.props.pars.scaleFactor;
        const x = row.X * scale;
        const y = row.Y * scale;

        if (row.Event === 'START') {

            context.moveTo(x, y);

        } else {

            const prevRow = events[index - 1];

            if (row.Event.match('_DRAG_END') && prevRow) {
                const prevX = prevRow.X * scale;
                const prevY = prevRow.Y * scale;

                // Draw line to last mouse down position
                context.stroke();
                context.save();

                // Draw dashed line from last mouse down position
                context.beginPath();
                context.setLineDash([5, 5]);
                context.moveTo(prevX, prevY);
                context.lineTo(x, y);
                context.stroke();
                context.restore();

                // Begin new path and move start to current mouse position
                context.beginPath();
                context.moveTo(x, y);

            } else {

                context.lineTo(x, y);

            }
        }
    }

    render() {
        const pars = this.props.pars;
        const scale = pars.scaleFactor;
        const w = pars.originalViewportWidth * scale;
        const h = pars.originalViewportHeight * scale;

        return (
            <canvas ref="flowMap" className='flow-map' width={w} height={h}></canvas>
        );
    }
}