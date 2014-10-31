/**
 * Created by Desar_6 on 16/01/14.
 */
Ext.define('Ext.ux.thumbnail.IconBrowser', {
    extend: 'Ext.view.View',
    alias: 'widget.mpagiconbrowser',
    iconSize: 100,
    uses: 'Ext.data.Store',
    cls: 'img-chooser-view',
    singleSelect: true,
    trackOver: true,
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    autoScroll: true,
    initComponent: function () {
        var tplCreator = this.createTemplate(this.getSize());
        this.tpl = tplCreator;
        //this.store = Ext.StoreManager.lookup('MainGridDataStore')
        this.callParent(arguments);
        this.store.sort();
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
        var tplCreator = new Ext.XTemplate(
            /*'<tpl for=".">',
             '<div class="thumb-wrap">',
             '<div class="thumb">',
             (!Ext.isIE6 ? '<img src="{thumb}" style="width:' + size + 'px; height:' + size + 'px;"/>' :
             '<div style="width:' + size + 'px;height:' + size + 'px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{thumb}\')"></div>'),
             '</div>',
             '<tpl if="' + size + '==75">',
             '<tpl if="'+me.nameField+'.length<14">',
             '<b><span style="width:' + size + 'px; height:15px">{'+me.nameField+'}</span></b>',
             '<tpl else>',
             '<b><span style="width:' + size + 'px; height:15px">{% out.push(values.'+me.nameField+'.toString().trim().substring(0,10)) %}...</span></b>',
             '</tpl>',
             '<tpl elseif= "' + size + '==100">',
             '<tpl if="'+me.nameField+'.length<17">',
             '<b><span style="width:' + size + 'px; height:15px">{'+me.nameField+'}</span></b>',
             '<tpl else>',
             '<b><span style="width:' + size + 'px; height:15px">{% out.push(values.'+me.nameField+'.toString().trim().substring(0,13)) %}...</span></b>',
             '</tpl>',
             '<tpl elseif= "' + size + '==125">',
             '<tpl if="'+me.nameField+'.length<22">',
             '<b><span style="width:' + size + 'px; height:15px">{'+me.nameField+'}</span></b>',
             '<tpl else>',
             '<b><span style="width:' + size + 'px; height:15px">{% out.push(values.'+me.nameField+'.toString().trim().substring(0,18)) %}...</span></b>',
             '</tpl>',
             '</tpl>',
             '</div>',
             '</tpl>'*/
                '<ul class="x-list-plain">' +
                '{% var lastRegion, region, countRegion,itemLabel; %}' +
                '<tpl for=".">' +
                    '{% region = values.' + me.groupField + ';' +
                ' countRegion = -1;' +
                    ' itemLabel = this.reformatItemName(values.' + me.nameField + '.toString());' +


                // Only show region headers when there are more than 10 choices
                'if (region !== lastRegion) {' +
                'lastRegion = region;' +
                'countRegion = countRegion +1;' +

                'if (countRegion > 0){%}'+

                '</div>' +
                '</div>' +
                '</li>' +
                '{%}%}' +

                '<li class="x-grid-group-hd x-grid-group-title">' +
                '<table style="width: 100%"><tr>' +
                '<td style="width: 18px">' +
                    '<button class="{' + me.groupField + ':this.reformatName}-groupExpander sourceexpand-menuicon" ' + me.nameField + ' = "expanderButton" title="Preview Layout" style="width:16px; font-size:11px; height:16px; border:0;background-color: transparent " value="Show More" >' +
                //'Show More' +
                '</button>' +
                '</td>' +
                    '<td>{' + me.groupField + '}</td>' +
                '</tr>' +
                '</table>' +
                '</li>' +

                '<li class="x-boundlist-item">' +

                '<div class="group-wrapper">' +
                    '<div class="group-view" id = "{' + me.groupField + ':this.reformatName}-containerWrapper" style ="height: ' + size + 'px !important; width: {' + me.groupField + ':this.estimateGroupSize}px;">' +
                '{%}%}' +
                    '<div class="thumb-wrap" title="{' + me.nameField + '}">' +
                '<div class="thumb">' +
                    (!Ext.isIE6 ? '<img src="{' + me.thumbnailField + '}" style="border:1px solid #00a2dc; width:' + size + 'px; height:' + size + 'px;"/>' :
                        '<div style="border:1px solid #00a2dc; width:' + size + 'px;height:' + size + 'px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{' + me.thumbnailField + '}\')"></div>') +
                '</div>' +
                '<tpl if="' + size + '==75">' +
                    '<tpl if="this.reformatItemName(' + me.nameField + '.toString()).length<12">' +
                '<b><span style="width:' + size + 'px; height:15px">{% out.push(itemLabel)%}</span></b>' +
                '<tpl else>' +
                '<b><span style="width:' + size + 'px; height:15px">{% out.push(itemLabel.trim().substring(0,9)+"...") %}</span></b>' +
                '</tpl>' +
                '<tpl elseif= "' + size + '==100">' +
                    '<tpl if="this.reformatItemName(' + me.nameField + '.toString()).length<17">' +
                '<b><span style="width:' + size + 'px; height:15px">{% out.push(itemLabel)%}</span></b>' +
                '<tpl else>' +
                '<b><span style="width:' + size + 'px; height:15px">{% out.push(itemLabel.trim().substring(0,12)+"...") %}</span></b>' +
                '</tpl>' +
                '<tpl elseif= "' + size + '==125">' +
                    '<tpl if="this.reformatItemName(' + me.nameField + '.toString()).length<19">' +
                    '<b><span style="width:' + size + 'px; height:15px">{' + me.nameField + ':this.reformatItemName}</span></b>' +
                '<tpl else>' +
                '<b><span style="width:' + size + 'px; height:15px">{% out.push(itemLabel.trim().substring(0,17)+"...") %}</span></b>' +
                '</tpl>' +
                '</tpl>' +
                '</div>' +


                '</tpl>' +
                '</ul>',
            {
                estimateGroupSize: function(group,rows){
                    var collection = me.store.query(me.groupField, group, false, false, true);
                    var resize = (size * 1) + 16;
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
                }
            }
        );
        return tplCreator;
    }
});