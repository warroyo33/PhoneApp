/**
 * Created by Desar_6 on 04/08/2014.
 */
Ext.define('Ext.ux.Msg.DetailBubble',{
    extend:'Ext.ux.callout.Callout',
    xtype: 'detailBubbleCallout',
    initComponent: function(){
        var me = this,
            Ex= Ext,
            ExLocale= Ext.localization,
            ExArray= Ex.Array;
        Ex.applyIf(me,{
            type: 'error',
            form: null,
            data: null,
            message:ExLocale.detailBubble.defaultTitle
        });
        var typeCls;
        switch(me.type){
            case 'error':
                typeCls='red';
                break;
        }



        Ex.define('bubbleDetailModel',{
            extend: 'Ext.data.Model',
            fields: ['text', 'group']
        });
        var detailStore= Ext.create('Ext.data.Store',{
            model: 'bubbleDetailModel',
            groupers: ['group'],
            proxy: {
                type: 'memory',
                reader: 'json'
            }
        });
        if (!me.data){
            if (me.form){
                Ex.suspendLayouts();
                var invalid = me.form.getFields().filterBy(function(field) {
                    return !field.validate();
                });
                Ex.resumeLayouts(true);
                var errorData= [];
                if (invalid.length){
                    ExArray.each(invalid.items, function(item){
                        ExArray.each(item.activeErrors,function(error){
                            ExArray.push(errorData, {
                                text: error,
                                group: item.fieldLabel});
                        });
                    });
                    detailStore.loadData(errorData);
                }
            }else{
                detailStore.loadData([{group:ExLocale.detailBubble.errorGroup.default,text:ExLocale.detailBubble.msgText.noDataToDisplay}]);
            }

        }else{
            detailStore.loadData(me.data);
        }
        function columnWrap(val){
            return '<div style="white-space:normal !important;">'+ val +'</div>';
        }
        var contentGrid = Ext.create('Ext.grid.Panel',{
            //title: 'The following errors prevent to continue the process',
            store: detailStore,
            region: 'center',
            features: [{ftype:'grouping'}],
            width: 200,
            height: 275,
            columns: [{
                text: 'Description',
                dataIndex: 'text',
                flex: 1,
                renderer: columnWrap
            }]
        });

        var headerMessage = Ext.create('Ext.container.Container',{
            region: 'north',
            //heigth: 40,
            html: '<table style="width:100%" border=0>' +
                '<tr>' +
                '<td style="width: 34px">' +
                '<img src= "js/lib/resources/images/monitorLogoHD.png" class ="monitorLogoHD" />'+
                '</td>'+
                '<td >' +
                //'<b>' + t + '</b>' +
                '<p>' + me.message + '</p>' +
                '</td>' +
                '<td style="width:20px" align="right">' +

                '</td>' +
                '</tr>' +
                '</table>'
        });

        var contentBody = Ext.create('Ext.panel.Panel',{
            border: 0,
            //title: Ext.localization.apiName+" - "+Ext.localization.msgText.errorHeader,
            layout: 'border',
            bodyCls: 'jumerror',
            items:[headerMessage,contentGrid],
            width: 400,
            height: 300
        });

        Ext.applyIf(me,{
            //cls: 'red',
            items: [contentBody]
        });
        me.callParent(arguments);
    }
});