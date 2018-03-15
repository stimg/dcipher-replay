import React from 'react';

export default class Timeline extends React.Component {

    componentDidUpdate() {
        // this.drawTimeline();
    }

/*
    clearTimeline = function clearTimeline() {

        var cw = window.innerWidth,
            $tl = $(this.getDomElement('timeline')),
            cnv = $('canvas', $tl)[0],
            ctx = cnv.getContext('2d'),
            tlh = $tl.height();

        ctx.clearRect(0, 0, cw, tlh);

    };

    resetTimeline = function () {

        this.timeBrackets = [];
        this.startEventIndex = 0;
        this.endEventIndex = this.timeLineEvents.length - 1;
        if (this.activeSession) {

            this.drawTimeline(this.activeSession);

        }

    };

    drawTimeline = function drawTimeline(session) {

        this.showTimelineStat(session);

        var self = this,
            events = session.events,
            $tl = $(this.getDomElement('timeline')),
            cnv = $('canvas', $tl)[0],
            ctx = cnv.getContext('2d'),
            cw = window.innerWidth,
            ch = $tl.height(),
            offsetRight = $(this.getDomElement('timelineInfo')).width(),
            offsetLeft = this.timeLineOffsetLeft,
            offsetTop = ch / 2,
            cy = window.innerHeight - ch + offsetTop,
            width = cw - offsetLeft - offsetRight,
            pxs = width / session.duration,
            posx = offsetLeft,
            posx0, pe,
            showTaskNumber = session.testCaseId !== '',
            taskNr = 1;

        this.timeLineEvents = [];
        cnv.width = cw;
        cnv.height = ch;
        $(cnv).width(cw);
        $(cnv).height(ch);

        if (this.endEventIndex) {

            this.drawTLCursor(events[this.endEventIndex].time, session.duration);

        }
        /!*else {

         this.drawTLCursor(rec.duration, rec.duration);

         }
         *!/
        this.drawTLBrackets();

        ctx.lineWidth = 2.0;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = session.color;
        ctx.font = "bold 14px 'Helvetica Neue'";
        ctx.clearRect(0, 0, cw, ch);
        ctx.moveTo(offsetLeft, offsetTop);
        self.drawEventPict(ctx, 'start', offsetLeft, offsetTop);
        ctx.stroke();

        events.forEach(function (e, i, arr) {

            //console.debug('---> posx:', posx);
            //console.debug('---> e.time:', e.time);

            if (e.eventNo) {

                pe = arr[i - 1];
                posx0 = posx;
                posx = offsetLeft + pxs * e.time;

                self.timeLineEvents.push({

                    type: 'timeline',
                    clientX: posx,
                    clientY: cy,
                    target: $('canvas', '#' + self.domId.timeline)[0],
                    x: posx,
                    y: offsetTop,
                    event: e

                });

                // Draw task number
                if (showTaskNumber && e.testTaskId !== '' && e.firstInTask) {

                    //var tx = e.testTask.step ? posx : posx0;
                    var tx = posx;
                    ctx.save();
                    ctx.fillStyle = 'gray';
                    ctx.strokeStyle = 'gray';
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    ctx.moveTo(tx, 0);
                    ctx.lineTo(tx, ch);
                    ctx.stroke();
                    ctx.fillText(taskNr++, tx + 5, ch - 10);
                    ctx.restore();

                }

                ctx.beginPath();
                ctx.moveTo(posx0, offsetTop);
                if (e.drag) {

                    ctx.setLineDash([3, 3]);

                }
                if (i && e.type.match(/wheel|scroll/i) && pe.type.match(/wheel|scroll/i)) {

                    ctx.setLineDash([1, 2]);

                }
                ctx.lineTo(posx, offsetTop);
                ctx.stroke();
                ctx.setLineDash([]);

                if (i) {

                    ctx.beginPath();
                    self.drawEventPict(ctx, pe.type, posx0, offsetTop);
                    ctx.stroke();
                    ctx.fill();

                }

            }
        });

        // Draw last task line
        ctx.save();
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'gray';
        ctx.beginPath();
        ctx.moveTo(posx, 0);
        ctx.lineTo(posx, ch);
        ctx.stroke();
        ctx.restore();

        // Draw last event pict
        ctx.beginPath();
        self.drawEventPict(ctx, events[events.length - 1].type, posx, offsetTop);
        ctx.stroke();
        ctx.fill();

        $tl.show();

    };

    drawTLCursor = function (pos, total) {

        var pars = this.getTimeLineCursorPars(pos, total);

        $(this.getDomElement('timelineCursor')).css(pars).show();

    };

    drawTLBrackets = function (time1, time2) {

        var t1 = time1 !== undefined ? time1 : this.timeBrackets[0] !== undefined ? this.timeBrackets[0] : 0,
            t2 = time2 !== undefined ? time2 : this.timeBrackets[1] !== undefined ? this.timeBrackets[1] : this.activeSession.duration,
            pars = this.getTimeLineBracketsPars(t1, t2);

        $(this.getDomElement('timelineBrackets')).css(pars).show();

    };

    showTimelineStat = function (session) {

        var loc = this.loc,
            html = Math.round(session.duration / 1000) + '<span>' + loc.sec + '</span> '
                   + ((session.eventsStat.click || 0) + (session.eventsStat.drag || 0) + (session.eventsStat.wheel || 0)) + '<span>' + loc.evs + '</span>'
                   + session.mouseMilesTotal.toFixed(1) + '<span>' + loc.mm + '</span>'
                   + session.kpi.toFixed(1) + '<span>' + loc.kpi + '</span>';

        $(this.getDomElement('timelineInfo')).html(html);

    };
*/

    render () {
        const th = 52;
        const pars = this.props.pars;
        const scale = pars.scaleFactor;
        const w = pars.originalViewportWidth * scale;
        const h = pars.originalViewportHeight * scale;

        return (
            <div id="timeline" style={{width: w+'px', height: th + 'px', top: h - 1 + 'px'}}>
                <canvas ref="timelineCanvas" className='timeline' width={w} height={th}></canvas>
            </div>
        );
    }
}