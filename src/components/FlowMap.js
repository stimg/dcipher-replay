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
    }

    drawFlowMap() {

        const pars = this.props.pars;
        if (!pars.eventList.length || !pars.currentFrame) return;

        const data = pars.eventList.slice(0, pars.currentFrame);
        const scale = pars.scaleFactor;
        const canvas = this.refs.flowMap;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        // Draw lines
        data.forEach((row, index, events) => {

            if (row.Event === 'START') return;

            const prevRow = events[index - 1];
            const prevX = prevRow.X * scale;
            const prevY = prevRow.Y * scale;
            const x = row.X * scale;
            const y = row.Y * scale;

            if (row.Event === 'LB_DRAG_START') {

                // Draw line to last mouse down position
                ctx.stroke();
                ctx.save();

                // Draw dashed line from last mouse down position
                ctx.beginPath();
                ctx.setLineDash([5, 5]);
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.restore();

                // Begin new path and move start to current mouse position
                ctx.beginPath();
                ctx.moveTo(x, y);

            } else if ((prevRow && !prevRow.Event.match(/wheel|scroll/i)) || !row.Event.match(/wheel|scroll/i) || row.index) {

                ctx.lineTo(x, y);

            }

        });
        ctx.stroke();

        // Draw event pictograms
        ctx.setLineDash([]);
        ctx.beginPath();
        data.forEach((row, index, events) => {

            const prevRow = index ? events[index - 1] : null;
            const x = row.X * scale;
            const y = row.Y * scale;

            if (!row.Event.match(/wheel|scroll/i)) {

                this.drawEventPict(ctx, row.Event, x, y);

            } else if (!prevRow || !prevRow.Event.match(/wheel|scroll/i)) {

                this.drawEventPict(ctx, 'wheel', x, y);

            }

        });

        ctx.stroke();
        ctx.fill();

    };

    drawEventPict (ctx, type, x, y) {

        if (EVENTS_TO_DRAW.indexOf(type) > -1) {

            const endAngle = 2 * Math.PI, d = 3;

            if (type.match('_CLICK')) {

                ctx.moveTo(x - 1, y - 3);
                ctx.lineTo(x - 1, y + 3);

            } else if (type === 'click') {

                ctx.moveTo(x + d, y);
                ctx.arc(x, y, d, 0, endAngle, true);

            } else if (type.match('_DBL_CLICK')) {

                const r = d - 1;
                ctx.moveTo(x + 2 * r, y);
                ctx.arc(x, y, 2 * r, 0, endAngle, true);
                ctx.stroke();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.arc(x, y, r, 0, endAngle, true);

            } else if (type.match('_DRAG_START')) {

                ctx.moveTo(x + 3, y - 2);
                ctx.lineTo(x, y + 3);
                ctx.lineTo(x - 3, y - 2);
                ctx.lineTo(x + 3, y - 2);

            } else if (type.match('_DRAG_END')) {

                ctx.moveTo(x - 3, y + 2);
                ctx.lineTo(x, y - 3);
                ctx.lineTo(x + 3, y + 2);
                ctx.lineTo(x - 3, y + 2);

            }  else if (type.match('MOUSE_WHEEL')) {

                ctx.moveTo(x - 3, y - 1);
                ctx.lineTo(x, y - 4);
                ctx.lineTo(x + 3, y - 1);
                ctx.closePath();

                ctx.moveTo(x - 3, y + 1);
                ctx.lineTo(x, y + 4);
                ctx.lineTo(x + 3, y + 1);
                ctx.closePath();

            } else if (type.match('KEYPRESS')) {

            }

        }

    };

    render() {
        const pars = this.props.pars;
        const scale = pars.scaleFactor;
        const w = pars.originalViewportWidth * scale;
        const h = pars.originalViewportHeight * scale;
        this.drawFlowMap();

        return (
            <canvas ref="flowMap" className='flow-map' width={w} height={h}></canvas>
        );
    }
}