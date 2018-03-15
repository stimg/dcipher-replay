import React from 'react';
import IconDrawer from '../classes/IconDrawer';

const TIMELINE_HEIGHT = 52;
const LINE_WIDTH = 4;
const LINE_WIDTH_CURRENT = 6;
const ICON_STROKE = 2;
const ICON_STROKE_CURRENT = 3;
const FILL_STYLE = '#ffffff';
const STROKE_STYLE_PREV = '#0073ff';
const STROKE_STYLE_CURRENT = '#ff0000';
const STROKE_STYLE_NEXT = '#f732b3';

export default class Timeline extends React.Component {

    componentDidUpdate() {
        this.drawTimeline();
    }

    drawTimeline() {
        const pars = this.props.pars;
        const events = pars.eventList;
        const currentFrame = pars.currentFrame;
        const duration = events[events.length - 1].Time;
        const timeUnit = pars.originalViewportWidth * pars.scaleFactor / duration;
        const y = TIMELINE_HEIGHT / 2;

        const canvas = this.refs.timelineCanvas;
        const context = canvas.getContext('2d');

        context.font = 'bold 14px Helvetica';
        context.lineWidth = LINE_WIDTH;
        context.fillStyle = FILL_STYLE;
        context.lineCap = 'square';
        context.lineJoin = 'miter';
        context.miterLimit = 4.0;

        context.clearRect(0, 0, canvas.width, canvas.height);


        if (currentFrame) {
            // Previous path
            context.beginPath();
            context.moveTo(0, y);
            for (let i = 1; i < currentFrame; i++) {
                this.drawTimePath(context, i, STROKE_STYLE_PREV);
            }
            context.stroke();

            // Current path
            context.beginPath();
            context.moveTo(events[currentFrame - 1].Time * timeUnit, y);
            this.drawTimePath(context, currentFrame, STROKE_STYLE_CURRENT, LINE_WIDTH_CURRENT);
            context.stroke();
        }

        // Next path
        context.beginPath();
        context.moveTo(events[currentFrame].Time * timeUnit, y);
        for (let i = currentFrame + 1; i < events.length; i++) {
            this.drawTimePath(context, i, STROKE_STYLE_NEXT);
        }
        context.stroke();

        const iconDrawer = new IconDrawer();
        events.forEach((row, index) => {
            const x = row.Time * timeUnit;
            iconDrawer.setLineWidth(index === currentFrame ? ICON_STROKE_CURRENT : ICON_STROKE);
            iconDrawer.setStrokeStyle(index < currentFrame ? STROKE_STYLE_PREV : index === currentFrame ? STROKE_STYLE_CURRENT : STROKE_STYLE_NEXT);
            iconDrawer.drawEventIcon(context, row.Event, x, y);
        });
    }

    drawTimePath(context, index, lineColor, lineWidth = LINE_WIDTH) {

        const y = TIMELINE_HEIGHT / 2;
        const pars = this.props.pars;
        const events = pars.eventList;
        const duration = events[events.length - 1].Time;
        const timeUnit = pars.originalViewportWidth * pars.scaleFactor / duration;
        const row = events[index];
        const x = row.Time * timeUnit;
        const prevX = events[index - 1].Time * timeUnit;

        context.strokeStyle = lineColor;
        context.lineWidth = lineWidth;

        if (row.Event.match('_DRAG_END')) {

            context.stroke();
            context.save();

            context.beginPath();
            context.setLineDash([lineWidth / 2, lineWidth * 2]);
            context.moveTo(prevX, y);
            context.lineTo(x, y);
            context.stroke();
            context.restore();

            // Begin new path and move start to current mouse position
            context.beginPath();
            context.moveTo(x, y);

        } else context.lineTo(x, y);
    }

    render() {
        const pars = this.props.pars;
        const scale = pars.scaleFactor;
        const w = pars.originalViewportWidth * scale;
        const h = pars.originalViewportHeight * scale;

        return (
            <div id="timeline" style={{width: w + 'px', height: TIMELINE_HEIGHT + 'px', top: h - 1 + 'px'}}>
                <canvas ref="timelineCanvas" className='timeline' width={w} height={TIMELINE_HEIGHT}></canvas>
            </div>
        );
    }
}