/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 23/07/13
 * Time: 01:06 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define("Ext.ux.widget.chart.series.Area", {
    extend: "Ext.container.Container",
    //alias: "widget.areachart",
    width: 504,
    height: 304,
    blockedCls: 'blockDrop',
    style: "border: 2px solid black",
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
            data: [
                { 'name': 'metric one', 'data1': 10, 'data2': 12, 'data3': 14, 'data4': 8, 'data5': 13 },
                { 'name': 'metric two', 'data1': 7, 'data2': 8, 'data3': 16, 'data4': 10, 'data5': 3  },
                { 'name': 'metric three', 'data1': 5, 'data2': 2, 'data3': 14, 'data4': 12, 'data5': 7  },
                { 'name': 'metric four', 'data1': 2, 'data2': 14, 'data3': 6, 'data4': 1, 'data5': 23 },
                { 'name': 'metric five', 'data1': 27, 'data2': 38, 'data3': 36, 'data4': 13, 'data5': 33 }
            ]
        });
        var chart = Ext.create('Ext.chart.Chart', {
            width: 500,
            height: 300,
            animate: true,
            store: store,
            axes: [
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['data1', 'data2', 'data3', 'data4', 'data5'],
                    title: 'Sample Values',
                    grid: {
                        odd: {
                            opacity: 1,
                            fill: '#ddd',
                            stroke: '#bbb',
                            'stroke-width': 1
                        }
                    },
                    minimum: 0,
                    adjustMinimumByMajorUnit: 0
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['name'],
                    title: 'Sample Metrics',
                    grid: true,
                    label: {
                        rotate: {
                            degrees: 315
                        }
                    }
                }
            ],
            series: [
                {
                    type: 'area',
                    highlight: false,
                    axis: 'left',
                    xField: 'name',
                    yField: ['data1', 'data2', 'data3', 'data4', 'data5'],
                    style: {
                        opacity: 0.93
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