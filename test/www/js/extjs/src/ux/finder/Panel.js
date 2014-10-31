/**
 * Created by Desar_6 on 11/09/2014.
 */
Ext.define('Ext.ux.finder.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'exFinder',
    requires: ['Ext.ux.finder.view.coverflow.View'],
    /*<defaults>*/
    store: Ext.create('Ext.data.TreeStore', {
            root: {
                text: 'Folders',
                id: 'home',
                expanded: true
            },
            proxy: {
                type: 'memory'
            }
        }
    ),
    columns: [],
    currentNodeId: 'ROOT',
    backList: [],
    //title: 'ROOT',
    forwardList: [],
    /*</defaults>*/
    initComponent: function () {
        var me = this,
            Ex = Ext,
            coverflow= Ext.widget('coverFlowView',{
                region:'north',
                autoScroll: true,
                height: 210
            }),
            gridPanel = Ext.create('Ext.ux.finder.view.TreeGrid',{
                region:'center'
            }),
            finderContainer= Ext.create("Ext.container.Container",{

                layout: 'border',
                items: [coverflow,gridPanel]
            }),
            backButton = Ext.widget('button', {
                iconCls: 'mpaUI-back',
                text: 'back',
                disabled: true,
                style: "font-size: 16px !important;",
                handler: function () {
                    var lastId = Ext.Array.splice(me.backList, me.backList.length - 1, 1);
                    Ext.Array.push(me.forwardList, me.currentNodeId);
                    me.currentNodeId = lastId[0];
                    if (!me.backList.length)
                        backButton.setDisabled(true);
                    forwardButton.setDisabled(false);
                    console.log(me.backList);
                    console.log(me.forwardList);
                    gridPanel.loadFromNodeId(me.currentNodeId);
                }
            }),
            forwardButton = Ext.widget('button', {
                iconCls: 'mpaUI-forward',
                text: 'forward',
                disabled: true,
                style: "font-size: 16px !important;",
                handler: function () {
                    var lastId = Ext.Array.splice(me.forwardList, me.forwardList.length - 1, 1);
                    Ext.Array.push(me.backList, me.currentNodeId);
                    me.currentNodeId = lastId[0];
                    if (!me.forwardList.length)
                        forwardButton.setDisabled(true);
                    backButton.setDisabled(false);
                    console.log(me.backList);
                    console.log(me.forwardList);
                    gridPanel.loadFromNodeId(me.currentNodeId);
                }
            }),
            configButton = Ext.widget('button', {
                iconCls: 'mpaUI-config',
                text: 'Settings',
                style: "font-size: 16px !important;",
                menu: [
                    {
                        text: "New Folder"
                    }
                ]

            });
        /**
         * add Custom events to interact with others widgets
         */
        me.addEvents('itemdblclick', 'itemcontextmenu')
        /**
         * interactions for both views grid view and icon view
         */
        gridPanel.on('itemdblclick', function (tableView, record) {
            var isLeaf = record.get('leaf');
            if (isLeaf)
                me.fireEvent('itemdblclick', record);
            else {
                backButton.setDisabled(false);
                Ext.Array.push(me.backList, me.currentNodeId);
                me.forwardList = [];
                me.currentNodeId = record.get('uuid');
                gridPanel.loadFromNodeId(me.currentNodeId);

                forwardButton.setDisabled(true);
                console.log(me.backList);
                console.log(me.forwardList);
            }
        });
        gridPanel.view.on('allrowsrendered', function(rows){

            var data = [];
            Ex.Array.each(rows, function(record){
                Ex.Array.push(data,{
                    id: record.get('id'),
                    text: record.get('text'),
                    thumbnail: record.get('thumbnail')
                });
            });
            Ex.CoverFlowStore.loadData(data);
        });
        gridPanel.on('itemcontextmenu', function (grid, record, item, index, e) {
            var isLeaf = record.get('leaf');
            if (isLeaf)
                me.onItemContextMenu(grid, record, item, index, e);
            else {
                me.onFolderContextMenu(grid, record, item, index, e);
            }
        });

        /**
         * default values for this view
         */
        Ex.apply(me, {
            tbar: [
                backButton,
                forwardButton,
                '-',
                configButton
            ],
            layout: 'card',
            items: [finderContainer],
            getSelectedRecord: function () {
                var selectedRecord = gridPanel.getView.getSelectionModel().getSelection();
                return selectedRecord
            }
        });
        me.callParent(arguments);
        /*gridPanel.loadFromNodeId(me.currentNodeId,function(){
         Ext.Array.push(me.historyList,me.currentNodeId)
         });*/
    },
    onItemContextMenu: function (grid, record, item, index, e, eOpts) {
        var me = this;
        e.preventDefault();
        var menuItems = me.readOnly ? [] :
            [
                {
                    text: Ext.localization.mainGridFactory.text.newFile,
                    iconCls: 'mpaUI-new3',
                    action: 'createNewRecord',
                    iconStyle: "color: #000 !important; font-size: 15px !important;"
                },
                {
                    text: Ext.localization.mainGridFactory.text.editFile,
                    iconCls: 'mpaUI-pen1',
                    style: 'color:green',
                    action: 'editCurrentRecord',
                    iconStyle: "color: green !important; font-size: 15px !important;"
                },
                {
                    text: Ext.localization.mainGridFactory.text.removeFile,
                    iconCls: 'mpaUI-cancelFilled',
                    iconStyle: "color: red !important; font-size: 15px !important;",
                    action: 'removeCurrentRecord'
                },
                '-'
            ];
        Ext.Array.push(menuItems, {
            text: Ext.localization.mainGridFactory.text.openFile,
            iconCls: 'icon-openrecord',
            iconStyle: "color: #000 !important; font-size: 15px !important;",
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
    },
    onFolderContextMenu: function (grid, record, item, index, e, eOpts) {
        var me = this;
        e.preventDefault();
        var exFinder = Ext.localization.exFinder;
        var menuItems = me.readOnly ? [] :
            [
                {
                    text: exFinder.text.newFile,
                    iconCls: 'mpaUI-new3',
                    iconStyle: "color: #000 !important;",
                    action: 'createNewRecord'
                },
                '-'
            ];
        Ext.Array.push(menuItems, {
                text: exFinder.text.newFolder,
                iconCls: 'mpaUI-folderNew',
                action: 'openCurrentRecord',
                iconStyle: "color: #000 !important;"
            }, {
                text: exFinder.text.openFolder,
                iconCls: 'mpaUI-folderOpen2',
                action: 'editCurrentRecord',
                iconStyle: "color: #000 !important;"
            },
            {
                text: exFinder.text.renameFolder,
                iconCls: 'icon-removeDesign',
                iconStyle: "color: #000 !important;",
                action: 'removeCurrentRecord'
            });
        Ext.create('Ext.menu.Menu', {
            items: menuItems,
            listeners: {
                hide: function () {
                    Ext.get(this.el.id).remove();
                }
            }
        }).showAt(e.xy);
    }
});