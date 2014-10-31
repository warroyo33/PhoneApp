/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 10/10/13
 * Time: 02:25 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.grid.Panel',{
    extend: 'Ext.grid.Panel',
    requires: ['Ext.ux.exporter.Exporter'],
    //alias: 'widget.customgridpanel',
    blockedCls: 'blockDrop',
    exportEnabled: true,
    initComponent: function(){
        var me = this,
            Ex= Ext,
            ExLocale= Ex.localization;
            //id= !me.id?Ext.id(): me.id;
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
        );
        if(me.initialConfig){
            delete me.initialConfig.__JSON__configData;
            delete me.initialConfig.__JSON__;
            delete me.initialConfig.__JSON__viewConfig;
        }
        /*me.on("firedbutton", function(){
         var w = new Ext.create('MPA.widget.config.grid.Panel',{callback: me.callback, myConfig : me.initialConfig}).show();
         w.on("confirmchange",function(){
         me.fireEvent("confirmchange");
         });
         }, me);*/
        me.callback = function(){
            me.fireEvent("updatedobject");
        };
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
            borderColor: '99CCFF'
        });
        var store;
        //Ext.coreGlobals.getScope().addActionToQueue({id:me.id});

        if (typeof me.configData !== 'undefined' && me.configData.name){
            //store = Ext.StoreManager.lookup (me.configData.name)
            try {
                var record=Ex.SourceStore.findRecord('name',me.configData.name,0,false,false,true);
                if(record){
                    store= record.data.source;
                    record.data.gridBinding= me.id;
                }
                else
                    store= null;
            }catch (e){
                store= null;
            }
        }
        var columns= store? me.configData.columns : [{text: 'Description',flex:1, dataIndex: 'description'}];
        if (!store){
            store = Ex.create('Ext.data.Store',{
                fields: ['description'],
                data: [{ description: ExLocale.gridPanel.msgText.noSourceMessage}],
                proxy: {
                    type: 'memory'
                }
            });
        }
        if (me.configData.sortArray.length>0)
            store.sort(me.configData.sortArray);

        me.configData.styleData = me.configData.styleData || {};
        var panelStyle;
        if (me.configData.styleData.border)
            panelStyle = " border: "+me.configData.styleData.borderSize+"px "+me.configData.styleData.borderStyle+" #"+me.configData.styleData.borderColor+"!important; "+me.style;
        me.on("afterrender",function(){
            me.hidden=  !Ext.isEditMode? (me.configData.extraFeatures.hidden||false) : false;
            me.collapsed= !Ext.isEditMode? (me.configData.extraFeatures.collapsed||false): false;
        }, me, {single: true});
        Ex.apply(me,{

            /*bbar: [exportButton,{
             text:'test'
             }],*/
           // id: id,
            width: parseInt(me.configData.styleData.width) || 400,
            height: parseInt(me.configData.styleData.height) || 200,
            border: me.configData.styleData.border || true,
            style : panelStyle || "",
            store: store,
            columns: columns,
            viewConfig: {
                emptyText: Ex.isEditMode? ExLocale.gridPanel.msgText.noDataInEditMode:ExLocale.gridPanel.msgText.noDataToDisplay,
                deferEmptyText: false
            }
        });
        if (me.configData.extraFeatures.exportData){
            var exportButton =new Ext.ux.exporter.Button({
                component: me,
                store: store,
                text     : ExLocale.gridPanel.buttons.downloadXLS
            });
            //if (me.exportEnabled){
            Ext.applyIf(me,{
                tbar:[exportButton]
            });
            //}
        }
        if (me.configData.extraFeatures.pagingToolbar){
            /**
             * DYNAMIC PAGE SIZE
             * @type {number}
             */

            store.pageSize = me.configData.extraFeatures.pageSize;
            store.params.paging= true;
            store.proxy.reader.root = 'rows';
            store.proxy.reader.totalProperty= 'results';
            //if (me.exportEnabled){
            Ex.applyIf(me,{
                dockedItems: [{
                    xtype: 'pagingtoolbar',
                    store: store,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true
                }]
            });
            //}
        }else{
            store.pageSize = 25;
            delete store.params.paging;
            delete store.proxy.reader.root ;
            delete store.proxy.reader.totalProperty ;
        }



        me.callParent(arguments);

    }
});