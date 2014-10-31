/**
 * Created by Desar_6 on 27/10/2014.
 */
Ext.define('Ext.ux.notification.TableView', {
    extend: 'Ext.view.View',
    xtype: 'notificationTableView',
    iconSize: 50,
    uses: 'Ext.data.Store',
    cls: 'img-chooser-view',
    singleSelect: true,
    trackOver: true,
    overItemCls: 'x-view-over',
    itemSelector:  'li.'+Ext.baseCSSPrefix + 'tagfield-item',
    displayField: 'text',
    titleField: 'title',
    thumbnailField: 'thumbnail',
    autoScroll: true,
    initComponent: function () {
        var me = this;
        var tplCreator = this.createTemplate(this.getSize());
        me.tpl = tplCreator;
        /***
         * custom method to remove an assert item from the expression by clicking the X button
         */
        me.on('itemclick', function (view, record, item, index, e) {
            if (typeof e.target !== 'undefined' && e.target.className === Ext.baseCSSPrefix + 'tagfield-item-close')
                me.store.remove(record);
        });
        //me.store = Ext.create('DataFormatter.store.ExpressionMaker');
        //me.store.load();
        me.callParent(arguments);
//        me.store.sort();
    },
    getSize: function () {
        ////console.log();
        var size = this.iconSize.toString();
        //console.log(size);
        return size;
    },
    createTemplate: function (size) {
        var me = this;
        me.itemSize = size;
        var cmpId= Ext.id(null, 'AssertView'),
            ui= me.ui||'default';
        if (!me.labelTpl) {
            me.labelTpl = '<table style="width: 100%"> ' +
            '<tr>' +
            '<td style=" width:50px; height: 50px;">' +
            (!Ext.isIE6 ? '<img src="{' + me.thumbnailField + '}" style="border:0px solid #00a2dc; width:' + size + 'px; height:' + size + 'px;"/>' :
            '<div style="border:0px solid #00a2dc; width:' + size + 'px;height:' + size + 'px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{' + me.thumbnailField + '}\')"></div>') +
            '</td>' +
            '<td>' +
            '<div style="white-space: normal;"><b>{'+me.titleField+'}</b></div>' +
            '<div style="white-space: normal;">' +
            '{' + me.displayField + '}'+
            '</div>'+
            '</td>' +
            '</tr>' +
            '</table>'
            ;
        }
        me.labelTpl = me.getTpl('labelTpl');

        var tplCreator = new Ext.XTemplate(
            '<ul class="x-list-plain">' +
            '{% var lastRegion, region, countRegion; ' +
            'countRegion = -1;%}' +

            '<tpl for=".">' +
            '{% region = values.assertItem;' +

                //' itemLabel = this.reformatItemName(values.name.toString());' +


                // Only show region headers when there are more than 10 choices
            'if (region !== lastRegion) {' +
            'lastRegion = region;' +
            'countRegion = countRegion +1;' +
            'if (countRegion > 0){%}'+
            '</ul>'+
            /*'</td>' +
            '</tr>' +
            '</table>' +*/
            '</div>'+
            '</li>' +
            '{%}%}' +
            '<li class="x-boundlist-item">' +
            '<div id="'+cmpId+'-listWrapper" data-ref="listWrapper" class="' + Ext.baseCSSPrefix + 'tagfield ">',

            //'<li >' +
            /*'<table style="width: 100%"><tr>' +

            '<td style="width: 110px !important;" class="x-grid-group-hd x-grid-group-title">' +*/
            /*'<li style="width: 100% !important;" class="x-grid-group-hd x-grid-group-title"> ' +
            '{group}' +
            '</li>'+*/

            /*'</td>' +
            '<td>' +*/
            '<ul style="width: 99%;" id="'+cmpId+'-itemList" data-ref="itemList" class="' + Ext.baseCSSPrefix + 'tagfield-list">',

            //'</li>' +



            '{%}%}' +
            '<li style="left: 5px; width: 98%" class="    ' + Ext.baseCSSPrefix + 'tagfield-item ',
            '<tpl if="this.isSelected(values)">',
            ' selected',
            '</tpl>',
            '" qtip="{' + me.displayField + '}">' ,
            '<div style="width:100%" class="' + Ext.baseCSSPrefix + 'tagfield-item-text">{[this.getItemLabel(values)]}</div>',
            '<div class="' + Ext.baseCSSPrefix + 'tagfield-item-close"></div>',
            '</li>' ,
            '</tpl>' +
            '</ul>',
            {
                estimateGroupSize: function(group,rows){
                    var collection= me.store.query('designGroup', group, false, false, true );
                    var resize = (size*1)+16
                    var returnSize= collection.length ? resize * collection.length: resize * collection.items.length;
                    console.log(returnSize);
                    return (returnSize*1)+100;
                },
                reformatName : function (name ){
                    return name.replace('/','slh')
                },

                reformatItemName: function(name){
                    var tokens = name.split('/');
                    //console.log(tokens);
                    //console.log(tokens[tokens.length-1]);
                    return tokens[tokens.length-1];
                },
                isSelected: function(rec) {
                    return me.selectionModel?me.selectionModel.isSelected(rec): false;
                },
                getItemLabel: function(values) {
                    return me.labelTpl.apply(values);
                }
            }
        );
        return tplCreator;
    }
});