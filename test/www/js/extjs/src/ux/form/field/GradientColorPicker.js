/**
 * Created by Desar_6 on 12/06/2014.
 */
Ext.define('Ext.ux.form.field.GradientColorPicker', {
    extend: 'canvaspanel',
    alias: 'widget.colorpicker',
    uses: ['Ext.ux.form.field.ColorUtils'],
    pickerType: 'color',
    defaultBackgroundColor: 'ff0000',
    xPosMax: 100,
    xPosMin: 0,
    yPosMax: 100,
    yPosMin: 0,
    forceXEdgePos: true,
    forceYEdgePos: true,
    orientation: 'vertical',
    useSliders: true,
    currentHue: undefined,
    hueEnd: 360,
    selectionPosition: [100, 0],
    hueGradient1: {
        '0%': "rgb(255, 0, 0)", '15%': "rgb(255, 0, 255)", '33%': "rgb(0, 0, 255)", '49%': "rgb(0, 255, 255)", '67%': "rgb(0, 255, 0)", '84%': "rgb(255, 255, 0)", '100%': "rgb(255, 0, 0)"
    },
    initComponent: function () {
        var me = this;

        if (me.pickerType === 'hue') {
            me.xPosMax = me.hueEnd;
            me.yPosMax = me.hueEnd;
        }

        me.callParent(arguments);
    },
    onBoxReady: function () {
        var me = this
            , width = me.canvas.getWidth()
            , height = me.canvas.getHeight();

        me.callParent(arguments);

        if (me.pickerType === 'color') {
            me.setColorPickerBackground(me.defaultBackgroundColor);
        } else {
            if (me.pickerType === 'hue') {
                me.fillLinearGradient(me.hueGradient1, me.orientation === 'vertical' ? 0 : 90);
            }
        }

        me.initTracker();

        me.canvas.on('mouseover', function () {
            if (me.pickerType === 'color' || me.pickerType === 'hue') {
                if (!me.tracker.active) {
                    me.canvas.applyStyles({
                        cursor: me.pickerCursor1
                    });
                }
            }
        });

        if (me.pickerType === 'color' || me.pickerType === 'hue') {
            me.canvas.on('mousedown', function (e) {
                me.el.unselectable();

                me.getCanvasXY(e);

                if (me.pickerType === 'color') {
                    me.getProxy().show();
                    me.setProxyLoc(e.getX() - 5, e.getY() - 5);
                }

                if (me.pickerType === 'hue') {
                    me.setSliders();
                }
            }, me);
        }

        if (me.pickerType === 'hue' && me.useSliders !== false) {
            me.addSliders();
            me.body.applyStyles({ padding: me.orientation === 'vertical' ? '7px 0' : '0 7px' });
        }
    },
    addSliders: function () {
        var me = this;

        function createSlider(pos) {
            return {
                xtype: 'slider', animate: false, minValue: me.orientation === 'vertical' ? me.yPosMin : me.xPosMin, maxValue: me.orientation === 'vertical' ? me.yPosMax : me.xPosMax, value: me.orientation === 'vertical' ? me.yPosMax : me.xPosMax, vertical: me.orientation === 'vertical', width: me.orientation === 'vertical' ? 12 : undefined, height: me.orientation === 'vertical' ? undefined : 12, padding: me.orientation === 'vertical' ? '0 0 3 0' : undefined, useTips: false, dock: pos, listeners: {
                    afterrender: function (slider) {
                        var dir = me.orientation === 'vertical' ? 'vert' : 'horz'
                            , thumb = slider.thumbs[0];

                        slider.innerEl.up('.x-slider-' + dir).applyStyles({ 'background-image': 'none' });
                        slider.innerEl.up('.x-slider-end').applyStyles({
                            'background-image': 'none', width: 'auto', height: 'auto'
                        });
                        slider.innerEl.applyStyles({
                            'background-image': 'none', width: 'auto', height: 'auto'
                        });

                        if (me.orientation === 'vertical') {
                            thumb.el.setHeight(5);
                        } else {
                            thumb.el.setWidth(5);
                        }

                        thumb.el.applyStyles({
                            'background-image': 'none', width: 0, height: 0, cursor: 'pointer', margin: me.orientation === 'vertical' ? undefined : '-3px 0 0 -5px'
                        });

                        if (pos === 'left') {
                            thumb.el.applyStyles({ 'border-left': '5px solid black' });
                        } else if (pos === 'right') {
                            thumb.el.applyStyles({ 'border-right': '5px solid black' });
                        } else if (pos === 'top') {
                            thumb.el.applyStyles({ 'border-top': '5px solid black' });
                        } else {
                            thumb.el.applyStyles({ 'border-bottom': '5px solid black' });
                        }

                        if (me.orientation === 'vertical') {
                            thumb.el.applyStyles({
                                'border-top': '5px solid transparent', 'border-bottom': '5px solid transparent'
                            });
                        } else {
                            thumb.el.applyStyles({
                                'border-left': '5px solid transparent', 'border-right': '5px solid transparent'
                            });
                        }
                    }, change: function (slider, newVal, thumb) {
                        var sliders = me.sliders
                            , oldHue = me.currentHue
                            , changed = newVal !== me.currentHue;

                        Ext.each(sliders, function (s) {
                            if (s !== slider) {
                                s.setValue(newVal, false);
                                me.currentHue = newVal < me.hueEnd ? newVal : 0;
                            }
                        });

                        if (changed) {
                            me.fireEvent('huechanged', me, oldHue, me.currentHue);
                        }
                    }
                }
            };
        }

        if (me.orientation === 'vertical') {
            me.sliders = me.addDocked([createSlider('left'), createSlider('right')]);
        } else {
            me.sliders = me.addDocked([createSlider('top'), createSlider('bottom')]);
        }
    },
    getProxy: function () {
        var me = this;

        if (!me.proxy) {
            me.proxy = me.el.createChild({
                tag: 'div'
            }).applyStyles({
                height: '11px', width: '11px'
                //, cursor: me.blankCursor
                , cursor: me.pickerCursor1, background: 'url(' + me.cursor2Base64 + ') no-repeat center center'
            });
        }
        return me.proxy;
    },
    setProxyLoc: function (x, y) {
        var me = this
            , xy = Ext.isArray(x) ? x : [x, y];

        me.getProxy().show().setLocation(xy[0], xy[1]);
    },
    initTracker: function () {
        var me = this;

        me.tracker = Ext.create('Ext.dd.DragTracker', {
            el: me.el, constrainTo: me.el, tolerance: 0, onBeforeStart: function () {
                return (me.pickerType === 'color' || me.pickerType === 'hue');
            }, onStart: function () {
                if (me.pickerType === 'color') {
                    me.getProxy().applyStyles({ cursor: me.blankCursor }).show();
                    me.canvas.applyStyles({ cursor: me.blankCursor });
                }
            }, onDrag: function (e) {
                var dt = this
                    , cursorOffset = dt.getOffset('point')
                    , hueVal;

                me.getCanvasXY(e);

                if (me.pickerType === 'color') {
                    me.setProxyLoc(cursorOffset[0] + dt.startXY[0] - 5, cursorOffset[1] + dt.startXY[1] - 5);
                }

                if (me.pickerType === 'hue') {
                    me.setSliders();
                }
            }, onEnd: function () {
                var dt = this;

                if (me.pickerType === 'color') {
                    me.getProxy().applyStyles({ cursor: me.pickerCursor1 });
                }
            }
        });
    },
    setSliders: function (val, pauseEvents) {
        var me = this, tempVal, hueVal;

        if (me.selectionPosition && me.selectionPosition[0] && me.selectionPosition[1]) {
            tempVal = me.orientation === 'horizontal' ? me.selectionPosition[0] : Math.abs(me.selectionPosition[1] - me.hueEnd);
        }

        hueVal = val || tempVal;

        Ext.each(me.sliders, function (s) {
            if (pauseEvents === true) {
                s.suspendEvents(false);
            }
            s.setValue(hueVal, false);
            if (pauseEvents === true) {
                s.resumeEvents();
            }
        });
        me.currentHue = hueVal < me.hueEnd ? hueVal : 0;
    }, getCanvasXY: function (e) {
        var me = this
            , x = e.getX()
            , y = e.getY()
            , bodyLeft = me.canvas.getX() + 1
            , bodyRight = bodyLeft + me.canvas.getWidth() - 3
            , bodyWidth = bodyRight - bodyLeft
            , bodyTop = me.canvas.getY()
            , bodyBottom = bodyTop + me.canvas.getHeight() - 1
            , bodyHeight = bodyBottom - bodyTop
            , isLeftEdge = (x - bodyLeft) <= 1 ? true : false
            , isRightEdge = (bodyRight - x) <= 1 ? true : false
            , isTopEdge = y === bodyTop
            , isBottomEdge = (bodyBottom - y) <= 1 ? true : false
            , xPos = Ext.Number.toFixed(Ext.Number.snap((e.getX() - bodyLeft) / bodyWidth * me.xPosMax, 1, me.xPosMin, me.xPosMax), 0)
            , yPos = Ext.Number.toFixed(Ext.Number.snap((e.getY() - bodyTop) / bodyHeight * me.yPosMax, 1, me.yPosMin, me.yPosMax), 0)
            , selectionPosition = Ext.Array.from(me.selectionPosition);

        if (me.forceXEdgePos === true) {
            xPos = isLeftEdge ? me.xPosMin : isRightEdge ? me.xPosMax : Ext.Number.from(xPos);
        }
        if (me.forceYEdgePos === true) {
            yPos = isTopEdge ? me.yPosMin : isBottomEdge ? me.yPosMax : Ext.Number.from(yPos);
        }

        if (selectionPosition[0] !== xPos || selectionPosition[1] !== yPos) {
            me.selectionPosition = [xPos, yPos];
            me.fireEvent('selectionchanged', me, xPos, yPos);
        }
    },
    setColorPickerBackground: function (color) {
        var me = this;

        me.clearCanvas();
        me.currentBackgroundColor = colorutils.toHex(color);
        me.fillColor(me.currentBackgroundColor);
        me.paintPickerSatBrightOverlay();
    },
    paintPickerSatBrightOverlay: function () {
        var me = this;

        // gray from the let
        me.fillLinearGradient({
            '0%': 'rgba(192, 192, 192, .5)', '80%': 'rgba(192, 192, 192, 0)'
        }, 225);
        // white bit from the top left
        me.fillLinearGradient({
            '0%': 'rgba(255, 255, 255, 1)', '80%': 'rgba(255, 255, 255, 0)'
        }, 315);
        // down to black
        me.fillLinearGradient({
            '0%': 'rgba(0, 0, 0, 0)', '100%': 'rgba(0, 0, 0, 1)'
        });
    }
});