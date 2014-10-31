/**
 * Created by Desar_6 on 12/06/2014.
 */
Ext.define('Ext.ux.form.field.ColorUtils', {
    singleton: true, splitColorString: function (str) {
        var colorO = {}
            , str = str.toLowerCase()
            , temp;

        if (str.indexOf('(') > -1) {
            temp = str.substring(str.indexOf('(') + 1).substring(0, str.substring(str.indexOf('(') + 1).lastIndexOf(')'));
            temp = temp.split(',');

            colorO.a = parseFloat(temp[0], 10);
            colorO.b = parseFloat(temp[1], 10);
            colorO.c = parseFloat(temp[2], 10);
            colorO.d = temp[3] && parseFloat(temp[3], 10);
        } else {
            str = str.replace(/#/g, '');
            colorO.a = str;
        }

        return colorO;
    }, normalizeColorArgs: function (args) {
        'use strict';
        var me = this,
            colorO = {
                a: args[0],
                b: args[1],
                c: args[2],
                d: args[3]
            },
            temp;

        if (Ext.isString(colorO.a)) {
            colorO = me.splitColorString(colorO.a);
        }

        if (Ext.isArray(colorO.a)) {
            temp = colorO.a;
            colorO.a = temp[0];
            colorO.b = temp[1];
            colorO.c = temp[2];
            colorO.d = temp[3];
        }
        return colorO;
    }, hexToRgb: function (hex, alpha, asString) {
        var rgb = {}
            , hex = Ext.isString(hex) ? { hex: hex } : hex
            , aValue = ''
            , asValue = ''
            , tempHex;

        if (Ext.isEmpty(hex.alpha)) {
            hex.alpha = alpha;
        }
        if (Ext.isEmpty(hex.asString)) {
            hex.asString = asString;
        }

        hex.hex = hex.hex.replace(/#/g, '');
        if (hex.hex.length === 3) {
            tempHex = hex.hex.split('');
            hex.hex = tempHex[0] + tempHex[0] + tempHex[1] + tempHex[1] + tempHex[2] + tempHex[2];
        }

        rgb.r = parseInt(hex.hex.substr(0, 2), 16);
        rgb.g = parseInt(hex.hex.substr(2, 2), 16);
        rgb.b = parseInt(hex.hex.substr(4, 2), 16);

        if (!Ext.isEmpty(hex.alpha)) {
            rgb.alpha = Ext.Number.constrain(hex.alpha, 0, 1);
            aValue = 'a';
            asValue = ',' + rgb.alpha;
        }

        if (hex.asString) {
            rgb = 'rgb' + aValue + '(' + rgb.r + ',' + rgb.g + ',' + rgb.b + asValue + ')';
        }

        return rgb;
    }, rgbToHex: function (r, g, b) {
        var me = this
            , str = Ext.String
            , rgb = {}
            , hex, temp;

        if (Ext.isObject(r)) {
            rgb = r;
        } else {
            temp = me.normalizeColorArgs(arguments);
            rgb.r = temp.a;
            rgb.g = temp.b;
            rgb.b = temp.c;
        }

        rgb.r = Ext.String.leftPad(rgb.r.toString(16), 2, '0');
        rgb.g = Ext.String.leftPad(rgb.g.toString(16), 2, '0');
        rgb.b = Ext.String.leftPad(rgb.b.toString(16), 2, '0');

        return hex = rgb.r + rgb.g + rgb.b;
    }, rgbToHsl: function (r, g, b, alpha, asString) {
        var me = this
            , rgb = {}
        //, asString = r.asString || asString
            , aValue = ''
            , asValue = ''
            , hsl = {}
            , max, min, h, s, l, d;

        if (Ext.isObject(r)) {
            rgb = r;
        } else {
            temp = me.normalizeColorArgs(arguments);
            rgb.r = temp.a;
            rgb.g = temp.b;
            rgb.b = temp.c;
            rgb.alpha = temp.d;
        }

        if (Ext.isEmpty(rgb.alpha)) {
            rgb.alpha = alpha;
        }
        if (Ext.isEmpty(rgb.asString)) {
            rgb.asString = asString;
        }

        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;
        max = Math.max(rgb.r, rgb.g, rgb.b);
        min = Math.min(rgb.r, rgb.g, rgb.b);
        l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case rgb.r:
                    h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
                    break;
                case rgb.g:
                    h = (rgb.b - rgb.r) / d + 2;
                    break;
                case rgb.b:
                    h = (rgb.r - rgb.g) / d + 4;
                    break;
            }
            h /= 6;
        }

        hsl.h = h;
        hsl.s = s;
        hsl.l = l;
        hsl.alpha = rgb.alpha;
        hsl.asString = rgb.asString;

        if (!Ext.isEmpty(hsl.alpha)) {
            hsl.alpha = Ext.Number.constrain(hsl.alpha, 0, 1);
            aValue = 'a';
            asValue = ',' + hsl.alpha;
        }

        if (hsl.asString) {
            hsl = 'hsl' + aValue + '(' + hsl.h + ',' + hsl.s + ',' + hsl.l + asValue + ')';
        }

        return hsl;
    }, rgbToHsv: function (r, g, b, alpha) {
        var me = this
            , rgb = {}
            , aValue = ''
            , max, min, h, s, v, d;

        if (Ext.isObject(r)) {
            rgb = r;
        } else {
            temp = me.normalizeColorArgs(arguments);
            rgb.r = temp.a;
            rgb.g = temp.b;
            rgb.b = temp.c;
            rgb.alpha = temp.d;
        }

        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;
        var max = Math.max(rgb.r, rgb.g, rgb.b), min = Math.min(rgb.r, rgb.g, rgb.b);
        v = max;

        d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case rgb.r:
                    h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
                    break;
                case rgb.g:
                    h = (rgb.b - rgb.r) / d + 2;
                    break;
                case rgb.b:
                    h = (rgb.r - rgb.g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return { h: h, s: s, v: v };
    }, hslToRgb: function (h, s, l, alpha, asString) {
        var me = this
            , hsl = {}
            , rgb = {}
        //, asString = h.asString || asString
            , aValue = ''
            , asValue = ''
            , temp, q, p;

        if (Ext.isObject(h)) {
            hsl = h;
        } else {
            temp = me.normalizeColorArgs(arguments);
            hsl.h = temp.a;
            hsl.s = temp.b;
            hsl.l = temp.c;
            hsl.alpha = temp.d;
        }

        if (Ext.isEmpty(hsl.alpha)) {
            hsl.alpha = alpha;
        }
        if (Ext.isEmpty(hsl.asString)) {
            hsl.asString = asString;
        }

        if (hsl.s == 0) {
            rgb.r = rgb.g = rgb.b = hsl.l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            q = hsl.l < 0.5 ? hsl.l * (1 + hsl.s) : hsl.l + hsl.s - hsl.l * hsl.s;
            p = 2 * hsl.l - q;

            rgb.r = hue2rgb(p, q, hsl.h + 1 / 3);
            rgb.g = hue2rgb(p, q, hsl.h);
            rgb.b = hue2rgb(p, q, hsl.h - 1 / 3);
        }

        //rgb.r *= 255;
        //rgb.g *= 255;
        //rgb.b *= 255;
        rgb.r = Ext.Number.snap(Ext.Number.snap(rgb.r, 1 / 255, 0, 1) * 255, 1, 0, 255);
        rgb.g = Ext.Number.snap(Ext.Number.snap(rgb.g, 1 / 255, 0, 1) * 255, 1, 0, 255);
        rgb.b = Ext.Number.snap(Ext.Number.snap(rgb.b, 1 / 255, 0, 1) * 255, 1, 0, 255);


        if (!Ext.isEmpty(hsl.alpha)) {
            rgb.alpha = Ext.Number.constrain(hsl.alpha, 0, 1);
            aValue = 'a';
            asValue = ',' + rgb.alpha;
        }

        if (asString) {
            rgb = 'rgb' + aValue + '(' + rgb.r + ',' + rgb.g + ',' + rgb.b + asValue + ')';
        }

        return rgb;
    }, hsvToRgb: function (h, s, v, alpha, asString) {
        var me = this
            , hsv = {}
            , rgb = {}
            , aValue = ''
            , asValue = ''
            , r, g, b;

        if (Ext.isObject(h)) {
            hsv = h;
        } else {
            temp = me.normalizeColorArgs(arguments);
            hsv.h = temp.a;
            hsv.s = temp.b;
            hsv.v = temp.c;
        }

        if (Ext.isEmpty(hsv.alpha)) {
            hsv.alpha = alpha;
        }
        if (Ext.isEmpty(hsv.asString)) {
            hsv.asString = asString;
        }

        /*var i = Math.floor(hsv.h * 6);
         var f = hsv.h * 6 - i;
         var p = hsv.v * (1 - hsv.s);
         var q = hsv.v * (1 - f * hsv.s);
         var t = hsv.v * (1 - (1 - f) * hsv.s);

         switch(i % 6){
         case 0: r = hsv.v, g = t, b = p; break;
         case 1: r = q, g = hsv.v, b = p; break;
         case 2: r = p, g = hsv.v, b = t; break;
         case 3: r = p, g = q, b = hsv.v; break;
         case 4: r = t, g = p, b = hsv.v; break;
         case 5: r = hsv.v, g = p, b = q; break;
         }*/

        if (s == 0) {
            rgb.r = rgb.g = rgb.b = Math.round(hsv.v * 255);
        } else {
            // h must be < 1
            var var_h = hsv.h * 6;
            if (var_h === 6) var_h = 0;
            //Or ... var_i = floor( var_h )
            var var_i = Math.floor(var_h);
            var var_1 = hsv.v * (1 - hsv.s);
            var var_2 = hsv.v * (1 - hsv.s * (var_h - var_i));
            var var_3 = hsv.v * (1 - hsv.s * (1 - (var_h - var_i)));
            if (var_i === 0) {
                var_r = hsv.v;
                var_g = var_3;
                var_b = var_1;
            } else if (var_i === 1) {
                var_r = var_2;
                var_g = hsv.v;
                var_b = var_1;
            } else if (var_i === 2) {
                var_r = var_1;
                var_g = hsv.v;
                var_b = var_3
            } else if (var_i === 3) {
                var_r = var_1;
                var_g = var_2;
                var_b = hsv.v;
            } else if (var_i === 4) {
                var_r = var_3;
                var_g = var_1;
                var_b = hsv.v;
            } else {
                var_r = hsv.v;
                var_g = var_1;
                var_b = var_2
            }
        }

        rgb.r = Math.round(var_r * 255);
        rgb.g = Math.round(var_g * 255);
        rgb.b = Math.round(var_b * 255);
        //rgb.r = r * 255;
        //rgb.g = g * 255;
        //rgb.b = b * 255;
        //rgb.r = Ext.Number.snap(Ext.Number.snap(rgb.r, 1/255, 0, 1) * 255, 1, 0, 255);
        //rgb.g = Ext.Number.snap(Ext.Number.snap(rgb.g, 1/255, 0, 1) * 255, 1, 0, 255);
        //rgb.b = Ext.Number.snap(Ext.Number.snap(rgb.b, 1/255, 0, 1) * 255, 1, 0, 255);

        if (!Ext.isEmpty(hsv.alpha)) {
            rgb.alpha = Ext.Number.constrain(hsv.alpha, 0, 1);
            aValue = 'a';
            asValue = ',' + rgb.alpha;
        }

        if (hsv.asString) {
            rgb = 'rgb' + aValue + '(' + rgb.r + ',' + rgb.g + ',' + rgb.b + asValue + ')';
        }

        return rgb;
    }, rgbToCmyk: function (r, g, b) {
        var me = this
            , result = {
                c: 0, m: 0, y: 0, k: 0
            }
            , rgb = {};

        if (Ext.isObject(r)) {
            rgb = r;
        } else {
            temp = me.normalizeColorArgs(arguments);
            rgb.r = temp.a;
            rgb.g = temp.b;
            rgb.b = temp.c;
        }

        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;

        result.k = Math.min(1 - rgb.r, 1 - rgb.g, 1 - rgb.b);
        result.c = ( 1 - rgb.r - result.k ) / ( 1 - result.k );
        result.m = ( 1 - rgb.g - result.k ) / ( 1 - result.k );
        result.y = ( 1 - rgb.b - result.k ) / ( 1 - result.k );

        result.c = Math.round(result.c * 100);
        result.m = Math.round(result.m * 100);
        result.y = Math.round(result.y * 100);
        result.k = Math.round(result.k * 100);

        return result;
    }, cmykToRgb: function (c, m, y, k, alpha, asString) {
        var me = this
            , aValue = ''
            , asValue = ''
            , result = {
                r: 0, g: 0, b: 0
            }
            , cmyk = {};

        if (Ext.isObject(c)) {
            cmyk = c;
        } else {
            temp = me.normalizeColorArgs(arguments);
            cmyk.c = temp.a;
            cmyk.m = temp.b;
            cmyk.y = temp.c;
            cmyk.k = temp.d;
        }

        if (Ext.isEmpty(cmyk.alpha)) {
            cmyk.alpha = alpha;
        }
        if (Ext.isEmpty(cmyk.asString)) {
            cmyk.asString = asString;
        }

        cmyk.c /= 100;
        cmyk.m /= 100;
        cmyk.y /= 100;
        cmyk.k /= 100;

        result.r = 1 - Math.min(1, cmyk.c * ( 1 - cmyk.k ) + cmyk.k);
        result.g = 1 - Math.min(1, cmyk.m * ( 1 - cmyk.k ) + cmyk.k);
        result.b = 1 - Math.min(1, cmyk.y * ( 1 - cmyk.k ) + cmyk.k);

        result.r = Math.round(result.r * 255);
        result.g = Math.round(result.g * 255);
        result.b = Math.round(result.b * 255);

        if (!Ext.isEmpty(cmyk.alpha)) {
            result.alpha = Ext.Number.constrain(cmyk.alpha, 0, 1);
            aValue = 'a';
            asValue = ',' + result.alpha;
        }

        if (cmyk.asString) {
            result = 'rgb' + aValue + '(' + result.r + ',' + result.g + ',' + result.b + asValue + ')';
        }

        return result;
    }, hslToHsv: function (h, s, l) {
        var me = this
            , rgb;

        rgb = me.hslToRgb(h, s, l);
        return me.rgbToHsv(rgb);
    }, hsvToHsl: function (h, s, v, alpha, asString) {
        var me = this
            , rgb;

        rgb = me.hsvToRgb(h, s, v);
        if (Ext.isString(rgb)) {
            rgb = me.objectifyColorString(rgb);
        }
        if (Ext.isEmpty(rgb.alpha)) {
            rgb.alpha = alpha;
        }
        if (Ext.isEmpty(rgb.asString)) {
            rgb.asString = !Ext.isEmpty(h.asString) ? h.asString : asString;
        }
        return me.rgbToHsl(rgb);
    }, hslToHex: function (h, s, l) {
        var me = this
            , rgb;

        rgb = me.hslToRgb(h, s, l);
        return me.rgbToHex(rgb);
    }, hsvToHex: function (h, s, v) {
        var me = this
            , rgb;

        rgb = me.hsvToRgb(h, s, v);
        return me.rgbToHex(rgb);
    }, hexToHsl: function (hex, alpha, asString) {
        var me = this
            , rgb;

        rgb = me.hexToRgb(hex);
        if (Ext.isString(rgb)) {
            rgb = me.objectifyColorString(rgb);
        }
        if (Ext.isEmpty(rgb.alpha)) {
            rgb.alpha = alpha;
        }
        if (Ext.isEmpty(rgb.asString)) {
            rgb.asString = !Ext.isEmpty(hex.asString) ? hex.asString : asString;
        }
        return me.rgbToHsl(rgb);
    }, hexToHsv: function (hex) {
        var me = this
            , rgb;

        rgb = me.hexToRgb(hex);
        return me.rgbToHsv(rgb);
    }, hexToCmyk: function (hex) {
        var me = this
            , rgb;

        rgb = me.hexToRgb(hex);
        return me.rgbToCmyk(rgb);
    }, hslToCmyk: function (h, s, l) {
        var me = this
            , rgb;

        rgb = me.hslToRgb(h, s, l);
        return me.rgbToCmyk(rgb);
    }, hsvToCmyk: function (h, s, v) {
        var me = this
            , rgb;

        rgb = me.hsvToRgb(h, s, v);
        return me.rgbToCmyk(rgb);
    }, cmykToHex: function (c, m, y, k) {
        var me = this
            , rgb;

        rgb = me.cmykToRgb(c, m, y, k);
        return me.rgbToHex(rgb);
    }, cmykToHsl: function (c, m, y, k, alpha, asString) {
        var me = this
            , rgb;

        rgb = me.cmykToRgb(c, m, y, k);
        if (Ext.isString(rgb)) {
            rgb = me.objectifyColorString(rgb);
        }
        if (Ext.isEmpty(rgb.alpha)) {
            rgb.alpha = alpha;
        }
        if (Ext.isEmpty(rgb.asString)) {
            rgb.asString = !Ext.isEmpty(c.asString) ? c.asString : asString;
        }
        return me.rgbToHsl(rgb);
    }, cmykToHsv: function (c, m, y, k) {
        var me = this
            , rgb;

        rgb = me.cmykToRgb(c, m, y, k);
        return me.rgbToHsv(rgb);
    }, rgbToRgb: function (arg, alpha, asString) {
        var me = this, temp;

        temp = me.rgbToHsl(arg);

        if (Ext.isString(temp)) {
            temp = me.objectifyColorString(temp);
        }
        if (Ext.isEmpty(temp.alpha)) {
            temp.alpha = alpha;
        }
        if (Ext.isEmpty(temp.asString)) {
            temp.asString = !Ext.isEmpty(arg.asString) ? arg.asString : asString;
        }

        return me.hslToRgb(temp);
    }, hexToHex: function (arg) {
        var me = this, temp;

        temp = me.hexToRgb(arg);
        return me.rgbToHex(temp);
    }, hslToHsl: function (arg, alpha, asString) {
        var me = this, temp;

        temp = me.hslToRgb(arg);
        if (Ext.isString(temp)) {
            temp = me.objectifyColorString(temp);
        }
        if (Ext.isEmpty(temp.alpha)) {
            temp.alpha = alpha;
        }
        if (Ext.isEmpty(temp.asString)) {
            temp.asString = !Ext.isEmpty(arg.asString) ? arg.asString : asString;
        }

        return me.rgbToHsl(temp);
    }, hsvToHsv: function (arg) {
        var me = this, temp;

        temp = me.hsvToRgb(arg);
        return me.rgbToHsv(temp);
    }, cmykToCmyk: function (arg) {
        var me = this, temp;

        temp = me.cmykToRgb(arg);
        return me.rgbToCmyk(temp);
    }, objectifyColorString: function (str) {
        str = str.toLowerCase()

        var me = this
            , hsl = (str.indexOf('hsl') > -1)
            , rgb = (str.indexOf('rgb') > -1)
            , output = {}
            , temp = me.splitColorString(str);

        output.alpha = temp.d;
        if (hsl === true) {
            output.h = temp.a;
            output.s = temp.b;
            output.l = temp.c;
        } else if (rgb === true) {
            output.r = temp.a;
            output.g = temp.b;
            output.b = temp.c;
        } else {
            output.hex = temp.a;
        }

        return output;
    }, isRgb: function (arg) {
        var temp;

        if (Ext.isString(arg)) {
            arg = this.objectifyColorString(arg);
        }

        return !Ext.isEmpty(arg.r) && !Ext.isEmpty(arg.g) && !Ext.isEmpty(arg.b);
    }, isHsl: function (arg) {
        var temp;
        if (Ext.isString(arg)) {
            arg = this.objectifyColorString(arg);
        }
        return !Ext.isEmpty(arg.h) && !Ext.isEmpty(arg.s) && !Ext.isEmpty(arg.l);
    }, isHsv: function (arg) {
        return !Ext.isEmpty(arg.h) && !Ext.isEmpty(arg.s) && !Ext.isEmpty(arg.v);
    }, isCmyk: function (arg) {
        return !Ext.isEmpty(arg.c) && !Ext.isEmpty(arg.m) && !Ext.isEmpty(arg.y) && !Ext.isEmpty(arg.k);
    }, isHex: function (arg) {
        var temp;
        if (Ext.isString(arg)) {
            temp = this.objectifyColorString(arg);
            arg = {
                hex: temp.hex
            };
        }
        return !Ext.isEmpty(arg.hex);
    }, getColorType: function (arg) {
        var me = this, type;

        if (me.isRgb(arg)) {
            type = 'rgb';
        }
        if (me.isHsl(arg)) {
            type = 'hsl';
        }
        if (me.isHsv(arg)) {
            type = 'hsv';
        }
        if (me.isCmyk(arg)) {
            type = 'cmyk';
        }
        if (me.isHex(arg)) {
            type = 'hex';
        }

        return type;
    }, toOutputType: function (arg, alpha, asString, outputType) {
        var me = this
            , inputType = me.getColorType(arg)
            , output;

        if (Ext.isString(arg)) {
            arg = me.objectifyColorString(arg);
        }
        if (Ext.isEmpty(arg.alpha)) {
            arg.alpha = alpha;
        }
        if (Ext.isEmpty(arg.asString)) {
            arg.asString = asString;
        }

        output = me[inputType + 'To' + Ext.String.capitalize(outputType)](arg, alpha, asString);

        return output;
    }, toRgb: function (arg, alpha, asString) {
        return this.toOutputType(arg, alpha, asString, 'rgb');
    }, toHex: function (arg) {
        return this.toOutputType(arg, null, null, 'hex');
    }, toHsl: function (arg, alpha, asString) {
        return this.toOutputType(arg, alpha, asString, 'hsl');
    }, toHsv: function (arg) {
        return this.toOutputType(arg, null, null, 'hsv');
    }, toCmyk: function (arg) {
        return this.toOutputType(arg, null, null, 'cmyk');
    }, getHue: function (arg) {
        return this.toHsv(arg).h;
    }, getSaturation: function (arg) {
        return this.toHsv(arg).s;
    }, getBrightness: function (arg) {
        return this.toHsv(arg).v;
    }, getLuminosity: function (arg) {
        return this.toHsl(arg).l;
    }
});