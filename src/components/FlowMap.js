import React from "react";

export default class FlowMap extends React.Component {

    constructor(props) {
        super(props);
        
    }

    drawSpiderGraph = function showSpiderGraph(sId, start, end) {

        const self = this,
            session = this.getSessionById(sId);

        if (!session) {

            return;

        }

        const cnvh = this.getDomElement('canvasHolder'),
            data = session.events.slice(start || 0, end || session.events.length),
            cnv = this.canvas,
            ctx = cnv.getContext('2d');

        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.beginPath();

        // Draw lines
        data.forEach(function (e, i, ea) {

            const pe = ea[i - 1],
                pos = self.getTargetScreenPars(e),
                ppos = pe ? self.getTargetScreenPars(pe) : {},
                ex = pos.x,
                ey = pos.y;

            if (e.type === 'start') {

            } else if (e.drag) {

                // Draw line to last mouse down position
                //ctx.lineTo(pe.x, pe.y);
                ctx.stroke();
                ctx.save();

                // Draw dashed line from last mouse down position
                ctx.beginPath();
                ctx.setLineDash([5, 5]);
                ctx.moveTo(ppos.x, ppos.y);
                ctx.lineTo(ex, ey);
                ctx.stroke();
                ctx.restore();

                // Begin new path and move start to current mouse position
                ctx.beginPath();
                ctx.moveTo(ex, ey);

            } else if ((pe && !pe.type.match(/wheel|scroll/i)) || !e.type.match(/wheel|scroll/i) || e.index) {

                ctx.lineTo(ex, ey);

            }

        });
        ctx.stroke();

        // Draw event pictograms
        ctx.setLineDash([]);
        ctx.beginPath();
        data.forEach(function (e, i, ea) {

            const pe = ea[i - 1],
                pos = self.getTargetScreenPars(e),
                ex = pos.x,
                ey = pos.y;

            if (!e.type.match(/wheel|scroll/i)) {

                self.drawEventPict(ctx, e.type, ex, ey);

            } else if (!pe || !pe.type.match(/wheel|scroll/i)) {

                self.drawEventPict(ctx, 'wheel', ex, ey);

            }

        });

        ctx.stroke();
        ctx.fill();

        if (start === undefined && end === undefined) {

            /*
             $(cnvh).show().on('mousemove', {self: this}, function (e) {

             self.showMouseTooltip(e);
             self.highlightTimeLineEvent(e);

             });
             */
            this.canvas.show();
            session.drawn = true;
            this.checkRecordCheckbox(sId);

        }

        return this;

    };

    drawEventPict = function (ctx, type, x, y) {

        if (this.drawEventList.indexOf(type) > -1) {

            const endAngle = 2 * Math.PI, d = 3;

            if (type === 'start') {

                ctx.moveTo(x - 1, y - 3);
                ctx.lineTo(x - 1, y + 3);

            } else if (type === 'click') {

                ctx.moveTo(x + d, y);
                ctx.arc(x, y, d, 0, endAngle, true);

            } else if (type === 'dblclick') {

                const r = d - 1;
                ctx.moveTo(x + 2 * r, y);
                ctx.arc(x, y, 2 * r, 0, endAngle, true);
                ctx.stroke();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.arc(x, y, r, 0, endAngle, true);

            } else if (type === 'mousedown') {

                ctx.moveTo(x + 3, y - 2);
                ctx.lineTo(x, y + 3);
                ctx.lineTo(x - 3, y - 2);
                ctx.lineTo(x + 3, y - 2);

            } else if (type === 'mouseup') {

                ctx.moveTo(x - 3, y + 2);
                ctx.lineTo(x, y - 3);
                ctx.lineTo(x + 3, y + 2);
                ctx.lineTo(x - 3, y + 2);

            } else if (type === 'mouseover' || type === 'mouseenter'/* || type === 'mouseout' || type === 'mouseleave'*/) {

                ctx.moveTo(x + 1, y);
                ctx.arc(x, y, 1, 0, endAngle, true);

            } else if (type.match(/wheel|scroll/i)) {

                ctx.moveTo(x - 3, y - 1);
                ctx.lineTo(x, y - 4);
                ctx.lineTo(x + 3, y - 1);
                //ctx.lineTo(x - 3, y - 1);
                ctx.closePath();

                /*
                 ctx.moveTo(x + 2, y);
                 ctx.arc(x, y, 2, 0, endAngle, true);
                 */

                ctx.moveTo(x - 3, y + 1);
                ctx.lineTo(x, y + 4);
                ctx.lineTo(x + 3, y + 1);
                //ctx.lineTo(x - 3, y + 1);
                ctx.closePath();

                /*
                 ctx.strokeRect(x - 3, y - 2, 1.5, 4);
                 ctx.fillRect(x - 3, y - 2, 1.5, 4);
                 ctx.strokeRect(x, y - 2, 1.5, 4);
                 ctx.fillRect(x, y - 2, 1.5, 4);
                 */

            }

        }

    };

    render() {
        const pars = this.props.pars;
        const scale = pars.scaleFactor;
        const w = pars.originalViewportWidth * scale;
        const h = pars.originalViewportHeight * scale;
        const canvas = <canvas className="flow-map" width={w} height={h}></canvas>;

        return canvas;
    }
}