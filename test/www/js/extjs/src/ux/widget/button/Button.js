/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 30/07/13
 * Time: 04:07 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define("Ext.ux.widget.button.Button", {
    extend: "Ext.button.Button",
    //alias: "widget.custombutton",
    //isDesign: false,
    text: "button",
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
    }
});