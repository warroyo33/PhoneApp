/**
 * @class MPA.widget.config.form.display.InfoPanel
 * @extends Ext.panel.Panel
 * @author Walter Arroyo
 *
 * Este panel tiene como función mostrar la información extra asociada a cada icono en la seccion de iconBrowser, esta información
 * forma parte del DataStore del iconbrowser, este panel solo hace uso de esa información ya cargada.
 */
Ext.define('Ext.ux.widget.config.form.display.InfoPanel', {
    extend: 'Ext.panel.Panel',
    //alias: 'widget.infopanel',
    //id: 'img-detail-panel',

    width: 150,
    minWidth: 150,
    title: 'Panel de Información',
    header: false,
    collapsible: true,
    tpl: [
        '<div class="details">',
        '<tpl for=".">',
        '<div class="details-info">',
        '<table style="width:100%">',
        '<tr>',
        '<td align = "left">',
        (!Ext.isIE6 ? '<img src="MuestraImagen.aspx?UUID={thumb}&EXT=PNG" style="width:128px; height: 128px;" />' :
            '<div style="width:128px;height:128px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'Images/{thumb}\')"></div>'),
        '</td></tr>',
        '<tr><td>',
        '<b>Example Name:</b> <br />',
        '<span>{name}</span>',
        '</td></tr>',
        '<tr><td>',
        '<b>Example URL:</b><br />',
        '<span><a href="http://dev.sencha.com/deploy/touch/examples/{url}" target="_blank">{url}.html</a></span>',
        '</td><tr>',
        '<tr><td>',
        '<b>Type:</b> <br />',
        '<span>{type}</span>',
        '</td>',
        '</tr>',
        '</table>',
        '</div>',
        '</tpl>',
        '</div>'
    ],

    afterRender: function () {
        this.callParent();
        if (!Ext.isWebKit) {
            this.el.on('click', function () {
                alert('The Sencha Touch examples are intended to work on WebKit browsers. They may not display correctly in other browsers.');
            }, this, { delegate: 'a' });
        }
    },

    /**
     * Muestra con una transición la información cargada sobre un icono seleccionado.
     */
    loadRecord: function (image) {
        this.body.hide();
        this.tpl.overwrite(this.body, image.data);

        this.body.slideIn('l', {
            duration: 550,
            easing: 'bounceOut'

        });
    },

    clear: function () {
        this.body.update('');
    }
});
