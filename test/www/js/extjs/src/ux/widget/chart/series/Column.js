/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 23/07/13
 * Time: 11:53 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define("Ext.ux.widget.chart.series.Column", {
    extend: "Ext.container.Container",
    //alias: "widget.columnchart",
    width: 504,
    height: 304,
    blockedCls: 'blockDrop',
    blockedCls: 'blockDrop',
    style: "border: 2px solid black",
    initComponent: function () {
        var me = this;
        /*var store = Ext.create('Ext.data.JsonStore', {
         fields: ['name', 'data'],
         data: [
         { 'name': 'metric one',   'data':10 },
         { 'name': 'metric two',   'data': 7 },
         { 'name': 'metric three', 'data': 5 },
         { 'name': 'metric four',  'data': 2 },
         { 'name': 'metric five',  'data':27 }
         ]
         });*/
        var store = Ext.data.StoreManager.lookup('chartStore');


        var chart = Ext.create('Ext.chart.Chart', {
            width: 500,
            height: 300,
            animate: true,
            store: store,
            axes: [
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['data'],
                    label: {
                        renderer: Ext.util.Format.numberRenderer('0,0')
                    },
                    title: 'Sample Values',
                    grid: true,
                    minimum: 0
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['name'],
                    title: 'Sample Metrics'
                }
            ],
            series: [
                {
                    type: 'column',
                    axis: 'left',
                    highlight: true,
                    tips: {
                        trackMouse: true,
                        width: 140,
                        height: 28,
                        renderer: function (storeItem, item) {
                            this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data') + ' $');
                        }
                    },
                    label: {
                        display: 'insideEnd',
                        'text-anchor': 'middle',
                        field: 'data',
                        renderer: Ext.util.Format.numberRenderer('0'),
                        orientation: 'vertical',
                        color: '#333'
                    },
                    xField: 'name',
                    yField: 'data'
                }
            ]
        });
        Ext.applyIf(me, {
            items: chart
        })
        me.callParent(arguments);
    }
})