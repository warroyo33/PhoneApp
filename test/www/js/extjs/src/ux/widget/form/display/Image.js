/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 5/08/13
 * Time: 08:17 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.form.display.Image', {
    extend: 'Ext.Component', // subclass Ext.Component
    //alias: 'widget.customimage',
    //src : 'images/no_image.gif',
    autoEl: {
        tag: 'img',
        //tag: 'div',
        cls: 'my-managed-image',
        src: Ext.BLANK_IMAGE_URL,
        style: 'width:150px; height:150px; border: 1px solid black;'
    },
    initComponent: function () {
        var me = this;

        if(me.initialConfig){
            delete me.initialConfig.__JSON__configData;
            delete me.initialConfig.__JSON__extraFeatures;
        }
        me.configData = me.configData|| {};
        Ext.applyIf(me.configData,{
            styleData:{ }, sourceConfig:{ }, extraFeatures: { }
        });
        Ext.applyIf(me.configData.styleData,{
            width: 400,
            height: 400,
            border: false,
            borderSize: 1,
            borderStyle: 'solid',
            borderColor: '000000'
        });
        //me.autoEl.src=(this.initialConfig.src ||  'images/no_image.gif');
        //me.src = (me.src || 'images/no_image.gif');
        me.on("afterrender",function(){
            //alert(me.configData.extraFeatures.hidden)
            me.hidden=  !Ext.isEditMode? (me.configData.extraFeatures.hidden||false) : false;
        }, me, {single: true});
        me.initialConfig.height = parseInt(me.configData.styleData.height) || 100;
        me.initialConfig.width = parseInt(me.configData.styleData.width) || 100;
        me.initialConfig.configData = me.configData;
        //me.hidden= !Ext.isEditMode ? me.configData.extraFeatures.hidden: false;
        me.border = me.configData.styleData.border;
        me.borderSize= parseInt(me.configData.styleData.borderSize) || 1;
        me.borderStyle= me.configData.styleData.borderStyle || 'solid';
        me.autoEl.style = (me.border === true ? ' border: '+me.borderSize+'px '+me.borderStyle+" #"+me.configData.styleData.borderColor+' !important;' : '');/*'width:' + me.width + 'px; height:' + me.height + 'px;' + */
        me.addEvents(
            /**
             * @event firedbutton fires when configuration button in the property grid was clicked
             * this event can change the layout border initial configuration.
             */
            "firedbutton",
            /**
             * @event fires redrawElement function in MasterPlugin class.
             */
            "updatedobject"
        )

        me.callback = function(cfg){
            me.fireEvent("updatedobject");
        };
        me.callParent(arguments);

        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        this.callParent(arguments);
    },
    onRender: function () {
        this.callParent(arguments);
        this.el.on('load', this.onLoad, this);
    },

    onLoad: function () {
        this.fireEvent('load', this);
    },

    setSrc: function (src) {
        if (this.rendered) {
            this.el.dom.src = src;
        } else {
            this.src = src;
        }
    },

    getSrc: function (src) {
        return this.el.dom.src || this.src;
    }
});