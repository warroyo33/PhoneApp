/**
 * Created by Desar_6 on 12/06/2014.
 */
Ext.define('Ext.ux.form.field.CanvasPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.canvaspanel',
    uses: ['Ext.ux.form.field.ColorUtils'],
    border: false,
    defaultGradientDirection: 'vertical',
    initialFillColor: 'ff0000',
    cursor1Base64: 'data:image/png;base64,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', cursor2Base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFRJREFUeNpi/P//PwMMMDIyIjhQAJRnhLFZkBV+fPsIXS1YHK4BajJIIUiQAR2DxCHKIJbiVIiugYmBBDBIFJMUGoywIMEVzvzCcvCIYSQlBgECDAB/anr+Hp+qLwAAAABJRU5ErkJggg==', blankCursorBase64: 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    initComponent: function () {
        var me = this;

        me.pickerCursor1 = 'url(' + me.cursor1Base64 + ') 4 28, auto';
        me.pickerCursor2 = 'url(' + me.cursor2Base64 + ') 5 5, auto';
        me.blankCursor = 'url(' + me.blankCursorBase64 + ') 5 5, auto';

        me.childEls = ['body', 'canvas'];

        me.renderTpl = [
            '{% this.renderDockedItems(out,values,0); %}',
            '<div id="{id}-body" class="{baseCls}-body">',
            '{%this.renderContainer(out,values);%}',
            '<canvas id="{id}-canvas" style="height:100%;width:100%;"></canvas>',
            '</div>',
            '{% this.renderDockedItems(out,values,1); %}'
        ];

        me.on('render', function () {
            me.context = me.canvas.dom.getContext('2d');

            if (!Ext.isEmpty(me.initialFillColor)) {
                me.fillColor(me.initialFillColor);
            }
        }, me);

        me.callParent(arguments);
    }, getCanvasWidth: function () {
        return this.canvas.dom.width;
    }, getCanvasHeight: function () {
        return this.canvas.dom.height;
    }, getCanvasSize: function () {
        var me = this;
        return [me.canvas.dom.width, me.canvas.dom.height];
    }, clearCanvas: function () {
        var me = this
            , size = me.getCanvasSize();

        me.context.clearRect(0, 0, size[0], size[1]);
    }, fillColor: function (color) {
        var me = this
            , size = me.getCanvasSize();

        me.context.fillStyle = color;
        me.context.fillRect(0, 0, size[0], size[1]);
        return me;
    }, fillLinearGradient: function (stops, dir) {
        var me = this
            , stops = Ext.Array.from(stops)
            , dir = dir || me.defaultGradientDirection
            , size = me.getCanvasSize()
            , deg, gradient, pct;

        if (Ext.isString(dir)) {
            dir = (dir === 'horizontal') ? 270 : 0;
        }
        if (Ext.isNumber(dir)) {
            if (dir === 360) {
                dir = 0;
            }
            deg = Ext.Number.constrain(dir, 0, 359);

            dir = {
                startX: me.getLinearX(deg), endX: me.getLinearX(deg, true), startY: me.getLinearY(deg), endY: me.getLinearY(deg, true)
            };
        }

        gradient = me.context.createLinearGradient(dir.startX, dir.startY, dir.endX, dir.endY);

        Ext.each(stops, function (stopObj) {
            Ext.Object.each(stopObj, function (key, val, o) {
                pct = Ext.Number.constrain((parseInt(key)), 0, 100) / 100;
                gradient.addColorStop(pct, val);
            });
        });

        me.context.fillStyle = gradient;
        me.context.fillRect(0, 0, size[0], size[1]);
    }, getLinearX: function (deg, opposite) {
        var x
            , deg = (opposite === true) ? ((deg > 180) ? deg - 180 : deg + 180) : deg
            , bodyWidth = this.canvas.dom.width
            , hInc = bodyWidth / 90;

        if (deg >= 0 && deg < 135) {
            x = bodyWidth / 2 + hInc * Ext.Number.constrain(deg, 0, 45);
        } else if (deg >= 135 && deg < 315) {
            x = bodyWidth / 2 + hInc * Ext.Number.constrain(180 - deg, -45, 45);
        } else {
            x = hInc * Ext.Number.constrain(deg - 315, 0, 45);
        }

        return x;
    }, getLinearY: function (deg, opposite) {
        var y
            , deg = (opposite === true) ? ((deg > 180) ? deg - 180 : deg + 180) : deg
            , bodyHeight = this.canvas.dom.height
            , vInc = bodyHeight / 90;

        if ((deg >= 0 && deg < 45) || deg >= 315) {
            y = 0;
        } else if (deg >= 45 && deg < 135) {
            y = (deg - 45) * vInc;
        } else if (deg >= 135 && deg < 225) {
            y = bodyHeight;
        } else {
            y = (90 - (deg - 225)) * vInc;
        }

        return y;
    }
});