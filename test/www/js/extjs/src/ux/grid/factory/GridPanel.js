/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 6/11/13
 * Time: 03:20 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.grid.factory.GridPanel', {
    requires: [
        'Ext.toolbar.Paging',
        'Ext.ux.grid.AutoResizer',
        'Ext.ux.grid.FilterBar'
    ],
    extend: 'Ext.grid.Panel',
    xtype: 'maingridfactory',

    initComponent: function () {
        var me = this;

        var Ex = Ext,
            store = me.store,
            ExLocale = Ex.localization,
            columnItems = me.columnItems ||
                [{dataIndex: 'description',text: ExLocale.mainGridFactory.columnText.description}];

        if (!store){
            store = Ext.create('Ext.data.Store',{
                fields: ['description'],
                proxy:{
                    type: 'memory',
                    reader: 'json'
                }
            })
        }
        Ext.applyIf(me, {
            stateful: true,
            emptyText: Ext.localization.mainGridFactory.text.empty,
            stateId: 'stateful-filter-grid',
            border: false,
            store: store,
            columns: {
                plugins: [
                    {
                        ptype: 'gridautoresizer'
                    }
                ],
                defaults: {
                    filter: true,
                    flex: 1
                },
                items: columnItems
            },
            loadMask: true,

            plugins: [
                {
                    ptype: 'filterbar',
                    renderHidden: false,
                    showShowHideButton: true,
                    showClearAllButton: true
                }
            ],
            listeners: {
                itemcontextmenu: me.contextMenu
            },
            emptyText: Ext.localization.mainGridFactory.text.emptyGridText
        });
        if(me.groupEnabled)
            Ext.applyIf(me,{
                features: [
                    {
                        ftype: 'grouping',
                        groupHeaderTpl: '{name} ({rows.length} ' + me.groupDescriptionPrefix + '{[values.rows.length > 1 ? "' + me.groupDescriptionPostfix + '" : ""]})',
                        hideGroupedHeader: true,
                        startCollapsed: false,
                        enableGroupingMenu: false
                    }
                ]
            });
        me.callParent(arguments);

        //store.load();
    },
    getStore: function () {
        return this.store;
    }
});