const END_ANGLE = 2 * Math.PI;
const SCALE = 2;
const CLICK_DIAMETER = 6;
const FONT = 'bold 14px Helvetica';

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

export default class IconDrawer {

    constructor(lineWidth = 2, strokeStyle = '#f732b3', fillStyle = '#ffffff') {
        this.lineWidth = lineWidth * 2;
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
    }

    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth * 2;
    }

    setStrokeStyle(strokeStyle) {
        this.strokeStyle = strokeStyle;
    }

    setFillStyle(fillStyle) {
        this.fillStyle = fillStyle;
    }

    drawStartIcon(context, type, x, y) {
        const lineFix = this.lineWidth / 2;

        context.beginPath();
        context.moveTo(x + lineFix, y - 2.5 * SCALE);
        context.lineTo(x + lineFix, y + 2.5 * SCALE);
        context.lineTo(x + lineFix + 3 * SCALE, y);
        context.closePath();
        context.stroke();
        context.fill();
    }

    drawStopIcon(context, type, x, y) {
        const lineFix = this.lineWidth / 2;

        context.beginPath();
        context.moveTo(x - lineFix, y - 2 * SCALE);
        context.lineTo(x - lineFix, y + 2 * SCALE);
        context.lineTo(x - lineFix - 3 * SCALE, y);
        context.closePath();
        context.stroke();
        context.fill();
    }

    drawClickIcon(context, type, x, y) {
        const d = CLICK_DIAMETER;

        context.beginPath();
        context.moveTo(x + d, y);
        context.arc(x, y, d, 0, END_ANGLE, true);
        context.stroke();
        context.fill();
        this.drawMouseButtonLetter(context, type, x, y);
    }

    drawDblClickIcon(context, type, x, y) {
        const d = CLICK_DIAMETER;

        // Outer circle
        context.beginPath();
        context.moveTo(x + d, y);
        context.arc(x, y, d, 0, END_ANGLE, true);
        context.stroke();
        context.fill();

        // Inner circle
        context.lineWidth = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0)';
        context.beginPath();
        context.moveTo(x + 2, y);
        context.arc(x, y, 2, 0, END_ANGLE, true);
        context.stroke();
        context.shadowColor = 'rgba(0, 0, 0, 0.3)';

        this.drawMouseButtonLetter(context, type, x, y);
    }

    drawDragStartIcon(context, type, x, y) {
        context.beginPath();
        context.moveTo(x + 3 * SCALE, y - 2 * SCALE);
        context.lineTo(x, y + 3 * SCALE);
        context.lineTo(x - 3 * SCALE, y - 2 * SCALE);
        context.closePath();
        context.stroke();
        context.fill();
        this.drawMouseButtonLetter(context, type, x, y);
    }

    drawDragEndIcon(context, type, x, y) {
        context.beginPath();
        context.moveTo(x - 3 * SCALE, y + 2 * SCALE);
        context.lineTo(x, y - 3 * SCALE);
        context.lineTo(x + 3 * SCALE, y + 2 * SCALE);
        context.closePath();
        context.stroke();
        context.fill();
        this.drawMouseButtonLetter(context, type, x, y);
    }

    drawMouseWheelStartIcon(context, type, x, y) {
        const lineFix = this.lineWidth / 2;

        context.beginPath();
        context.moveTo(x + lineFix + 3 * SCALE, y - 2.5 * SCALE);
        context.lineTo(x + lineFix + 3 * SCALE, y + 2.5 * SCALE);
        context.lineTo(x + lineFix, y);
        context.closePath();
        context.stroke();
        context.fill();
    }

    drawMouseWheelEndIcon(context, type, x, y) {
        const lineFix = this.lineWidth / 2;

        context.beginPath();
        context.moveTo(x - lineFix - 3 * SCALE, y - 2.5 * SCALE);
        context.lineTo(x - lineFix - 3 * SCALE, y + 2.5 * SCALE);
        context.lineTo(x - lineFix, y);
        context.closePath();
        context.stroke();
        context.fill();
    }

    drawKeyPressIcon(context, type, x, y, counter) {
        if (counter > 1) {
            // draw text
            context.shadowColor = 'rgba(0, 0, 0, 0)';
            context.fillRect(x - 3 * SCALE, y - 3 * SCALE, 6 * SCALE, 6 * SCALE);
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = '12px Helvetica';
            context.fillText(counter, x, y);

        } else {
            // draw icon
            context.beginPath();
            context.moveTo(x - 3 * SCALE, y - 3 * SCALE);
            context.lineTo(x - 3 * SCALE, y + 3 * SCALE);
            context.lineTo(x + 3 * SCALE, y + 3 * SCALE);
            context.lineTo(x + 3 * SCALE, y - 3 * SCALE);
            context.closePath();
            context.stroke();
            context.fill();
        }
    }

    drawMouseButtonLetter(context, type, x, y) {
        if (type.match(/^LB/)) return;

        context.fillStyle = 'black';
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        context.strokeText(type[0], x + 4 * SCALE, y - 4 * SCALE);
        context.fillText(type[0], x + 4 * SCALE, y - 4 * SCALE);
    }

    drawEventIcon(context, type, x, y, counter = 1) {
        if (EVENTS_TO_DRAW.indexOf(type) === -1) return;

        context.save();

        context.setLineDash([]);
        context.font = FONT;
        context.lineWidth = this.lineWidth;
        context.fillStyle = this.fillStyle;
        context.strokeStyle = this.strokeStyle;

        if (type === 'START') this.drawStartIcon(context, type, x, y);
        else if (type === 'STOP') this.drawStopIcon(context, type, x, y);
        else if (type.match('B_CLICK')) this.drawClickIcon(context, type, x, y);
        else if (type.match('B_DBL_CLICK')) this.drawDblClickIcon(context, type, x, y);
        else if (type.match('_DRAG_START')) this.drawDragStartIcon(context, type, x, y);
        else if (type.match('_DRAG_END')) this.drawDragEndIcon(context, type, x, y);
        else if (type.match('MOUSE_WHEEL_START_SCROLL')) this.drawMouseWheelStartIcon(context, type, x, y, counter);
        else if (type.match('MOUSE_WHEEL_END_SCROLL')) this.drawMouseWheelEndIcon(context, type, x, y, counter);
        else if (type.match('KEYPRESS')) this.drawKeyPressIcon(context, type, x, y, counter);

        context.restore();
    };

}