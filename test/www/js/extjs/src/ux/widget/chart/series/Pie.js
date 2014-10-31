/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 10/07/13
 * Time: 11:44 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define("Ext.ux.widget.chart.series.Pie", {
    extend: "Ext.container.Container",
    //alias: "widget.piechart",
    width: 504,
    height: 304,
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
            series: [
                {
                    type: 'pie',
                    angleField: 'data',
                    showInLegend: true,
                    tips: {
                        trackMouse: true,
                        width: 140,
                        height: 28,
                        renderer: function (storeItem, item) {
                            var total = 0;
                            store.each(function (rec) {
                                total += rec.get('data');
                            });
                            this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data') / total * 100) + '%');
                        }
                    },
                    highlight: {
                        segment: {
                            margin: 20
                        }
                    },
                    label: {
                        field: 'name',
                        display: 'rotate',
                        contrast: true,
                        font: '18px Arial'
                    }
                }
            ]
        });
        Ext.applyIf(me, {
            items: chart
        })
        me.callParent(arguments);
    }
})