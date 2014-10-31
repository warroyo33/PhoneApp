/**
 * Created by Desar_6 on 07/10/2014.
 */
Ext.define("Ext.ux.finder.view.coverflow.View",{
    extend: 'Ext.view.View',
    xtype: 'coverFlowView',
    iconSize: 100,
    uses: 'Ext.data.Store',
    cls: 'main-container',
    singleSelect: true,
    trackOver: true,
    overItemCls: 'x-view-over',
    itemSelector: 'li.thumb-wrap',
    autoScroll: true,
    initComponent: function () {
        var me = this;
        var tplCreator = this.createTemplate();
        me.tpl = tplCreator;
        me.store = Ext.StoreManager.lookup('CoverFlowThumbnail')
        me.callParent(arguments);
        //me.store.sort();
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
             '<tpl if="name.length<14">',
             '<b><span style="width:' + size + 'px; height:15px">{name}</span></b>',
             '<tpl else>',
             '<b><span style="width:' + size + 'px; height:15px">{% out.push(values.name.toString().trim().substring(0,10)) %}...</span></b>',
             '</tpl>',
             '<tpl elseif= "' + size + '==100">',
             '<tpl if="name.length<17">',
             '<b><span style="width:' + size + 'px; height:15px">{name}</span></b>',
             '<tpl else>',
             '<b><span style="width:' + size + 'px; height:15px">{% out.push(values.name.toString().trim().substring(0,13)) %}...</span></b>',
             '</tpl>',
             '<tpl elseif= "' + size + '==125">',
             '<tpl if="name.length<22">',
             '<b><span style="width:' + size + 'px; height:15px">{name}</span></b>',
             '<tpl else>',
             '<b><span style="width:' + size + 'px; height:15px">{% out.push(values.name.toString().trim().substring(0,18)) %}...</span></b>',
             '</tpl>',
             '</tpl>',
             '</div>',
             '</tpl>'*/
                //'<div class="main-container">' +
                '<div class="coverflow-container">' +
                '<ol class="coverflow-list">' +

                '<tpl for=".">' +
                    '{%var coverId = this.getId(values.id),' +
                    'itemLabel = this.reformatItemName(values.text.toString());%}'+
                    '<input type="radio" name="cover-item" id="{[coverId]}">'+
                        '<li class="coverflow-item">'+
                            '<label for="{[coverId]}">'+
                                '<figure class="album-cover">'+
                                    '<img src="{thumbnail:this.getThumbnail}">'+
                                        '<figcaption class="album-name">{% out.push(itemLabel)%}</figcaption>'+
                                    '</figure>'+
                                '</label>'+
                            '</li>'+
                '</tpl>' +
                '</ol>' +
                '</div>',
            {
                getId:function(name){
                    return Ext.id(null,name);
                },
                estimateGroupSize: function(group,rows){
                    var collection= me.store.query('designGroup', group, false, false, true );
                    var resize = (size*1)+16
                    var returnSize= collection.length ? resize * collection.length: resize * collection.items.length;
                    console.log(returnSize);
                    return (returnSize*1)+100;
                },
                getThumbnail : function (thumbnail ){
                    return thumbnail!==""?thumbnail:'images/GenericFolder.png'
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