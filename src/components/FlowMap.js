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

const EVENTS_TO_DRAW = [
    'START',
    'STOP',

    'LB_CLICK',
    'LB_DBL_CLICK',
    'LB_DRAG_START',
    'LB_DRAG_END',

    'MB_CLICK',
    'MB_DBL_CLICK',
    'MB_DRAG_START',
    'MB_DRAG_END',

    'RB_CLICK',
    'RB_DBL_CLICK',
    'RB_DRAG_START',
    'RB_DRAG_END',

    'MOUSE_WHEEL_START_SCROLL',
    'MOUSE_WHEEL',
    'MOUSE_WHEEL_END_SCROLL',
    'KEYPRESS'
];

export default class FlowMap extends React.Component {

    constructor(props) {
        super(props);
        this.lineWidth = 2;
    }

    componentDidUpdate() {
        this.drawFlowMap();
    }

    drawFlowMap() {

        const pars = this.props.pars;
        if (!pars.eventList.length) return;

        const data = pars.eventList.slice(0, pars.currentFrame + 1);
        const scale = pars.scaleFactor;
        const canvas = this.refs.flowMap;
        const context = canvas.getContext('2d');

        context.lineWidth = this.lineWidth;
        context.fillStyle = 'white';
        context.strokeStyle = 'magenta';
        context.lineCap = 'square';
        context.lineJoin = 'miter';
        context.miterLimit = 4.0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 3.0;
        context.shadowBlur = 4.0;
        context.shadowColor = 'rgba(0, 0, 0, 0.3)';

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();

        // Draw lines
        data.forEach((row, index, events) => {

            const x = row.X * scale;
            const y = row.Y * scale;

            if (row.Event === 'START') {

                context.moveTo(x, y);

            } else {

                const prevRow = events[index - 1];
                const prevX = prevRow.X * scale;
                const prevY = prevRow.Y * scale;

                if (row.Event.match('_DRAG_END')) {

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

        });
        context.stroke();

        // Draw event icons
        context.setLineDash([]);
        context.lineWidth = this.lineWidth * 2;
        context.beginPath();

        data.forEach((row) => {
            const x = row.X * scale;
            const y = row.Y * scale;

            this.drawEventPict(context, row.Event, x, y);
        });

        context.stroke();
        context.fill();

    };

    drawEventPict(ctx, type, x, y) {

        if (EVENTS_TO_DRAW.indexOf(type) > -1) {

            const endAngle = 2 * Math.PI;
            const scale = 2;
            const lineFix = this.lineWidth / 2;
            const d = 6;

            if (type === 'START') {

                ctx.moveTo(x + lineFix, y - 3 * scale);
                ctx.lineTo(x + lineFix, y + 3 * scale);
                ctx.lineTo(x + lineFix + 4 * scale, y);
                ctx.lineTo(x + lineFix, y - 3 * scale);

            } else if (type === 'STOP') {

                ctx.moveTo(x - lineFix, y - 3 * scale);
                ctx.lineTo(x - lineFix, y + 3 * scale);
                ctx.lineTo(x - lineFix - 4 * scale, y);
                ctx.lineTo(x - lineFix, y - 3 * scale);

            } else if (type.match('_CLICK')) {

                ctx.moveTo(x + d, y);
                ctx.arc(x, y, d, 0, endAngle, true);

            } else if (type.match('_DBL_CLICK')) {

                const r = d;
                ctx.moveTo(x + 2 * r, y);
                ctx.arc(x, y, 2 * r, 0, endAngle, true);
                ctx.stroke();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.arc(x, y, r, 0, endAngle, true);

            } else if (type.match('_DRAG_START')) {

                ctx.moveTo(x + 3 * scale, y - 2 * scale);
                ctx.lineTo(x, y + 3 * scale);
                ctx.lineTo(x - 3 * scale, y - 2 * scale);
                ctx.lineTo(x + 3 * scale, y - 2 * scale);

            } else if (type.match('_DRAG_END')) {

                ctx.moveTo(x - 3 * scale, y + 2 * scale);
                ctx.lineTo(x, y - 3 * scale);
                ctx.lineTo(x + 3 * scale, y + 2 * scale);
                ctx.lineTo(x - 3 * scale, y + 2 * scale);

            } else if (type.match('MOUSE_WHEEL_END_SCROLL')) {

                ctx.moveTo(x - 4 * scale, y - 3 * scale);
                ctx.lineTo(x - 4 * scale, y + 3 * scale);
                ctx.lineTo(x, y);
                ctx.lineTo(x - 4 * scale, y - 3 * scale);

                ctx.moveTo(x + 4 * scale, y - 3 * scale);
                ctx.lineTo(x + 4 * scale, y + 3 * scale);
                ctx.lineTo(x, y);
                ctx.lineTo(x + 4 * scale, y - 3 * scale);

            } else if (type.match('KEYPRESS')) {

                ctx.moveTo(x - 2 * scale, y - 2 * scale);
                ctx.lineTo(x - 2 * scale, y + 2 * scale);
                ctx.lineTo(x + 2 * scale, y + 2 * scale);
                ctx.lineTo(x + 2 * scale, y - 2 * scale);
                ctx.lineTo(x - 2 * scale, y - 2 * scale);
            }

        }

    };

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