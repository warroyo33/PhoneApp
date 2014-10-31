/**
 * @class MPA.widget.config.form.display.IconBrowser
 * @extends Ext.view.View
 * @author Walter Arroyo
 *
 * Esta clase extiende de la clase de Sencha "VIEW" y utiliza una plantilla simple de html junto a un dataStore en formato
 * JSON el cual puede ser accedido desde otra pagina, el array de JSON debe tener como minimo los campos "nombre", "imagen",
 * "url" y "tipo".
 */
Ext.define('Ext.ux.widget.config.form.display.IconBrowser', {
    extend: 'Ext.view.View',
    //alias: 'widget.iconbrowser',
    iconSize: 100,
    uses: 'Ext.data.Store',
    cls: 'img-chooser-view',
    singleSelect: true,
    trackOver: true,
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    initComponent: function () {
        var tplCreator = this.createTemplate(this.getSize());
        this.tpl = tplCreator;
        this.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['name', 'thumb', 'url', 'type'],
            proxy: {
                type: 'ajax',
                url: 'handler/image/repository.aspx?action=getFiles',
                //url: 'guidesigner/data/Data.json',
                reader: {
                    type: 'json',

                    root: ''
                }
            }
        });


        this.callParent(arguments);
        this.store.sort();
    },
    getSize: function () {
        //console.log();
        var size = this.iconSize.toString();
        console.log(size);
        return size;
    },
    createTemplate: function (size) {
        var tplCreator = new Ext.XTemplate(
            '<tpl for=".">',
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
            '</tpl>'
        );
        return tplCreator;
    }
});