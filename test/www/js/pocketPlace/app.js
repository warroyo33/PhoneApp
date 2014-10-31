/**
 * Created by Desar_6 on 21/10/2014.
 */
Ext.application({
    requires: [
        'Ext.container.Viewport'
    ],
    name: 'M5',

    appFolder: 'js/pocketPlace/app',

    controllers: [

    ],

    launch: function () {
        /*some constant values*/
        var me = this;
        //initCoreGlobals();
        me.initArrayIndexOf();
        me.initTrim();
        me.initIsArray();
        //me.dynamicallyLoadController(['MPAG.controller.GridPrincipal','MPA.controller.FlowView'])
        var forceCompressed = true;
        Ext.SSL_SECURE_URL = 'resources/s.gif';
        Ext.BLANK_IMAGE_URL = 'resources/s.gif';
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            id: 'ContainerViewPort',
            items: [{
                xtype:'panel',
                id: 'mainViewPort',
                title: 'helloWorld',
                html: 'this is a test'
            }]
        });
        setTimeout(function () {

            Ext.get('panelLoadPage').fadeOut({
                remove: true
            });
        }, 150);
    },
    initArrayIndexOf: function () {
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (obj) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == obj) {
                        return i;
                    }
                }
                return -1;
            }
        }
    },
    initTrim: function () {
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, "");
            }
        }
        if (!String.prototype.ltrim) {
            String.prototype.ltrim = function () {
                return this.replace(/^\s+/, "");
            }
        }
        if (!String.prototype.rtrim) {
            String.prototype.rtrim = function () {
                return this.replace(/\s+$/, "");
            }
        }
    },
    initIsArray: function () {
        if (!Array.isArray) {
            Array.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]' ? true : false;
            }
        }
    }

});

