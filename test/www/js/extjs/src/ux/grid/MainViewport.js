/**
 * Created by Desar_6 on 05/08/2014.
 */
/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 6/11/13
 * Time: 02:48 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.grid.MainViewport',{
    extend:'Ext.panel.Panel',
    //xtype:'maingridviewport',
    requires: ['Ext.ux.grid.factory.GridPanel','Ext.ux.thumbnail.View'],
    layout: 'border',
    header: false,
    activeItem: 0,
    readOnly:false,
    initComponent: function(){
        var me = this;
        me.onItemContextMenu = function (grid, record, item, index, e, eOpts) {
            //var me = this;
            e.preventDefault();
            var menuItems = me.readOnly ? [] :
                [
                    {
                        text: Ext.localization.mainGridFactory.text.newFile,
                        iconCls: 'icon-reset',
                        action: 'createNewRecord'
                    },
                    {
                        text: Ext.localization.mainGridFactory.text.editFile,
                        iconCls: 'icon-editDesign',
                        action: 'editCurrentRecord'
                    },
                    {
                        text: Ext.localization.mainGridFactory.text.removeFile,
                        iconCls: 'icon-removeDesign',
                        action: 'removeCurrentRecord'
                    }
                ];
            if (me.open)
                Ext.Array.push(menuItems,
                    '-', {
                        text: Ext.localization.mainGridFactory.text.openFile,
                        iconCls: 'icon-openrecord',
                        action: 'openCurrentRecord'
                    });
            Ext.create('Ext.menu.Menu', {
                items: menuItems,
                listeners: {
                    hide: function () {
                        Ext.get(this.el.id).remove();
                    }
                }
            }).showAt(e.xy);
        };
        var toolbar = me.readOnly ? []:
            [{
                tooltip: Ext.localization.mainGridFactory.tooltip.CreateNewRecord,
                text: Ext.localization.mainGridFactory.text.newFile,
                iconCls: 'icon-reset',
                action: 'createNewRecord'
            },{
                tooltip: Ext.localization.mainGridFactory.tooltip.EditCurrentRecord,
                text: Ext.localization.mainGridFactory.text.editFile,
                iconCls: 'icon-editDesign',
                action: 'editCurrentRecord'
            },{
                tooltip: Ext.localization.mainGridFactory.tooltip.removeFile,
                text: Ext.localization.mainGridFactory.text.removeFile,
                iconCls: 'icon-removeDesign',
                action: 'removeCurrentRecord'
            },'-'],
            items = me.readOnly ? []:[{
                xtype: 'container',
                region: 'south',
                html: '<div align="center" style="width:100%">'+Ext.localization.apiFooter+' </div>'
            }],
            store = me.store,
            gridPanel= Ext.widget('maingridfactory',{
                store: me.store,
                groupDescriptionPrefix: me.groupDescriptionPrefix,
                groupDescriptionPostfix: me.groupDescriptionPostfix,
                groupEnabled: me.groupEnabled,
                columnItems: me.gridColumns,
                readOnly: me.readOnly,
                contextMenu: me.onItemContextMenu
            }),
            thumbnailPanel = Ext.widget('mpagthumbnailview',{
                store: me.store,
                border: false,
                id : 'ThumbnailDataViewport',
                readOnly: me.readOnly,
                contextMenu: me.onItemContextMenu,
                groupField: me.groupField,
                nameField: me.nameField,
                thumbnailField: me.thumbnailField
            }),
            thumbnailViewButton = Ext.widget('button',{
                tooltip: Ext.localization.mainGridFactory.tooltip.ThumbnailView,
                text: Ext.localization.mainGridFactory.text.thumbnailView,
                iconCls: 'thumbnailview-icon',
                action: 'thumbnailView'
            }),
            bodyItems = [gridPanel],
            dockedBottomBarItems= [
                Ext.create('Ext.toolbar.Paging', {
                    store: store,
                    border:0
                }),
                '->',
                {
                    tooltip: Ext.localization.mainGridFactory.tooltip.GridView,
                    text: Ext.localization.mainGridFactory.text.gridView,
                    iconCls: 'gridview-icon',
                    disabled: true,
                    action: 'gridView'
                }
            ];
        if (me.open)
            Ext.Array.push(toolbar,
                {
                    tooltip: Ext.localization.mainGridFactory.tooltip.openCurrentRecord,
                    text: Ext.localization.mainGridFactory.text.openFile,
                    iconCls: 'icon-openrecord',
                    action: 'openCurrentRecord'
                });

        if (me.thumbnailViewEnabled) {
            Ext.Array.push(bodyItems, thumbnailPanel);
            Ext.Array.push(dockedBottomBarItems, thumbnailViewButton);
        }
        var contentPanel = Ext.widget('panel', {
            //id:'mainGridViewport',
            layout: 'card',
            region: 'center',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    items: toolbar
                },
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: dockedBottomBarItems
                }
            ],
            items: bodyItems
        });
        Ext.Array.push(items,contentPanel);

        Ext.apply(me, {
            items: items
        });

        /**
         * Public Method definition
         */
        me.getContentPanel = function(){
            return contentPanel;
        };
        me.getGridPanel= function(){
            return gridPanel;
        };
        me.callParent(arguments)
    },
    refresh: function(){
        this.store.load();
    },
    initDefaultConfiguration: function(){
        var me = this,
            defaultConfig = me.defaultConfig;
        Ext.applyIf(defaultConfig,{

        });
    }
});