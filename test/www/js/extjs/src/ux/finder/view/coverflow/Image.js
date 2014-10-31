/**
 * Created by Desar_6 on 07/10/2014.
 */
Ext.define('Ext.ux.finder.view.coverflow.Image', {
    extend: 'Ext.Component',
    alias: 'widget.coverflow-image',
    autoEl: {
        tag: 'img',
        //tag: 'div',
        cls: 'coverflow-image',
        src: Ext.BLANK_IMAGE_URL,
        style: 'width:150px; height:150px; border: 1px solid black;'
    },

    initComponent: function() {
        var me =this;
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        me.callParent(arguments);
       // this.imageId = this.initialConfig.imageId;
    },

   /* // add custom processing to the onRender phase
    onRender: function() {
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);

        this.callParent(arguments);
    },*/
    setSrc: function(src) {
        if (this.rendered) {
            this.el.dom.src = src;
        } else {
            this.src = src;
        }
    },

    getSrc: function(src) {
        return this.el.dom.src || this.src;
    }
});