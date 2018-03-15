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

        context.font = 'bold 14px Helvetica';
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

        data.forEach((row) => {
            const x = row.X * scale;
            const y = row.Y * scale;

            // Draw icons separately to avoid path merge
            this.drawEventPict(context, row.Event, x, y);
        });

    };

    drawEventPict(context, type, x, y) {

        if (EVENTS_TO_DRAW.indexOf(type) > -1) {

            const endAngle = 2 * Math.PI;
            const scale = 2;
            const lineFix = this.lineWidth / 2;
            const d = 6;

            if (type === 'START') {

                context.beginPath();
                context.moveTo(x + lineFix, y - 3 * scale);
                context.lineTo(x + lineFix, y + 3 * scale);
                context.lineTo(x + lineFix + 4 * scale, y);
                context.lineTo(x + lineFix, y - 3 * scale);
                context.stroke();
                context.fill();

            } else if (type === 'STOP') {

                context.beginPath();
                context.moveTo(x - lineFix, y - 3 * scale);
                context.lineTo(x - lineFix, y + 3 * scale);
                context.lineTo(x - lineFix - 4 * scale, y);
                context.lineTo(x - lineFix, y - 3 * scale);
                context.stroke();
                context.fill();

            } else if (type.match('B_CLICK')) {

                context.beginPath();
                context.moveTo(x + d, y);
                context.arc(x, y, d, 0, endAngle, true);
                context.stroke();
                context.fill();

            } else if (type.match('B_DBL_CLICK')) {

                // Outer circle
                context.beginPath();
                context.moveTo(x + d, y);
                context.arc(x, y, d, 0, endAngle, true);
                context.stroke();
                context.fill();

                // Inner circle
                context.shadowColor = 'rgba(0, 0, 0, 0)';
                context.beginPath();
                context.moveTo(x + lineFix, y);
                context.arc(x, y, lineFix, 0, endAngle, true);
                context.stroke();
                context.shadowColor = 'rgba(0, 0, 0, 0.3)';

            } else if (type.match('_DRAG_START')) {

                context.beginPath();
                context.moveTo(x + 3 * scale, y - 2 * scale);
                context.lineTo(x, y + 3 * scale);
                context.lineTo(x - 3 * scale, y - 2 * scale);
                context.lineTo(x + 3 * scale, y - 2 * scale);
                context.stroke();
                context.fill();

            } else if (type.match('_DRAG_END')) {

                context.beginPath();
                context.moveTo(x - 3 * scale, y + 2 * scale);
                context.lineTo(x, y - 3 * scale);
                context.lineTo(x + 3 * scale, y + 2 * scale);
                context.lineTo(x - 3 * scale, y + 2 * scale);
                context.stroke();
                context.fill();

            } else if (type.match('MOUSE_WHEEL_START_SCROLL')) {

                context.beginPath();
                context.moveTo(x - 4 * scale, y - 3 * scale);
                context.lineTo(x - 4 * scale, y + 3 * scale);
                context.lineTo(x, y);
                context.lineTo(x - 4 * scale, y - 3 * scale);

                context.moveTo(x + 4 * scale, y - 3 * scale);
                context.lineTo(x + 4 * scale, y + 3 * scale);
                context.lineTo(x, y);
                context.lineTo(x + 4 * scale, y - 3 * scale);
                context.stroke();
                context.fill();

            } else if (type.match('KEYPRESS')) {

                context.beginPath();
                context.moveTo(x - 4 * scale, y - 4 * scale);
                context.lineTo(x - 4 * scale, y + 4 * scale);
                context.lineTo(x + 4 * scale, y + 4 * scale);
                context.lineTo(x + 4 * scale, y - 4 * scale);
                context.lineTo(x - 4 * scale, y - 4 * scale);
                context.stroke();
                context.fill();
            }

            // Draw button text
            if (type.match('_CLICK')) {
                context.save();
                context.fillStyle = 'black';
                context.strokeStyle = 'white';
                context.lineWidth = 1;
                context.strokeText(type[0], x + 4 * scale, y - 4 * scale);
                context.fillText(type[0], x + 4 * scale, y - 4 * scale);
                context.restore();
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