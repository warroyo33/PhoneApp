/**
 * Container **Form** which implements a custom scroll-bar to be used in form designer
 * @removed
 */
Ext.define("Ext.ux.widget.form.Panel", {
    extend: "Ext.form.Panel",
    //alias: "widget.customform",
    layout:"form",
    initComponent: function(){
        Ext.applyIf(this,{
            interface: [
                {
                    name: "title",
                    value: "panel"
                },
                {
                    name: "autoScroll",
                    value: false
                },{
                    name: "title",
                    value: "panel"
                },
                {
                    name: "autoScroll",
                    value: false
                },{
                    name: "title",
                    value: "panel"
                },
                {
                    name: "autoScroll",
                    value: false
                },{
                    name: "title",
                    value: "panel"
                },
                {
                    name: "autoScroll",
                    value: false
                },{
                    name: "title",
                    value: "panel"
                },
                {
                    name: "autoScroll",
                    value: false
                }
            ]});
        this.callParent(arguments);
    }
});