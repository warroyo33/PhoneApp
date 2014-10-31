/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 9/08/13
 * Time: 03:40 PM
 * Container Dialog that renders a sort of forms depending of the type of connection
 * that the user selects from the ComboBox
 */
Ext.define('Ext.ux.datamanager.config.NewConnectionDialog', {
    extend: 'Ext.container.Container',
    layout: 'fit',
    //frame:'true',
    padding: '2px 2px 2px 2px',
    model: null,
    initComponent: function () {
        var me = this,
            Ex = Ext,
            ExLocale = Ex.localization;
        me.connectionTested = false;
        me.addEvents("confirmchange");
        /**
         *  ComboBox that allows the user to select the connection type of the new proxy
         * @type {Ext.form.field.ComboBox}
         */
        var connectionCombo = me.getConnectionCombo();

        var MPAConnectionDialogForm = Ex.widget('container',{
            region: 'north',
            //xtype: 'container',
            //id: 'MPAConnectionDialogForm',
            //height: 42,
            //bodyPadding: 5,
            border: 0,
            //frame: true,
            layout: {
                type: 'anchor'
            },
            defaults: {
                anchor: "100%"
            },
            items: [
                connectionCombo
            ]

        });

        var MPANewConnectionDialogBodyPanel= Ex.create('Ext.form.Panel',{
            layout: 'border',
            //frame: true,
            border: 0,
            items: [
                MPAConnectionDialogForm
            ]
        });
        /**
         * When the connectionCombo and the typeCombo, gets value the dialog show the configuration dialog for the
         * selection given.
         */
        me.initConfigPanel = function () {
            //var me = scope;
            var value = connectionCombo.getValue();
            var settingsContainer;
            if (value.indexOf('SQL')>-1)
                settingsContainer = Ex.create('Ext.ux.datamanager.config.connectiontype.SqlOracle', {
                    //connectionProxy: connectionCombo.getSelectedValue(),
                    region: 'center',
                    model: me.model
                });
            var bodyPanel = MPANewConnectionDialogBodyPanel;
            me.clearCanvas();
            bodyPanel.add(settingsContainer);
            bodyPanel.doLayout();

        };
        /**
         * listener to the connectionTypeCombo selection change to display the proper configuration
         * form
         */
        connectionCombo.on("select", function (combo) {
           // combo.setDisabled(true);
           // clearConnectionButton.setVisible(true);
            me.initConfigPanel();
        });
        connectionCombo.on("clearselection",function(){
            //connectionCombo.clearValue();
            //connectionCombo.setDisabled(false);
            //clearConnectionButton.setVisible(false);
            me.clearCanvas();
            Ex.getCmp('MPATestStatus').setIconCls('icon-connection-not-tested');
            me.connectionTested = false;
            me.connectionData = {};
        });



        Ext.applyIf(me, {
            items:[
                MPANewConnectionDialogBodyPanel
            ],
            listeners: {
                afterrender: function(){
                    if (!me.model)
                        connectionCombo.loadStore();
                }
            }
        });
        me.setConfigData= function(){
            var model = me.model;
            connectionCombo.loadStore(function(){
                connectionCombo.clearValue();
                connectionCombo.select(connectionCombo.getStore().findRecord('type', model.data.type, 0, false, false, true));
                connectionCombo.onTrigger2();
                //connectionCombo.setDisabled(true);
                //clearConnectionButton.setVisible(true);
                //me.model = model;
                me.initConfigPanel();
            });

        };
        me.isValid= function(){
            return MPANewConnectionDialogBodyPanel.getForm().isValid();
        };
        me.getBodyPanel = function(){
            return MPANewConnectionDialogBodyPanel.down('container[region=center]');
        };
        me.getConnectionType= function(){
            return connectionCombo.findRecord('type', connectionCombo.getValue()).data.type;
        };
        me.getContentForm = function(){
            return me.down('form').getForm();
        };
        /**
         * Removes the configuration panel from the dialog, this to prevent wrong results form the instruction
         * form.isValid()
         */
        me.clearCanvas= function () {
            var bodyPanel = MPANewConnectionDialogBodyPanel;
            if (bodyPanel.down('container[region=center]'))
                bodyPanel.remove(bodyPanel.down('container[region=center]'), true);
        };
        me.callParent(arguments);


    },

    /**
     * Creates the selection combobox of the connection types for this proxy configuration.
     * @returns {Ext.form.field.ComboBox}
     */
    getConnectionCombo: function () {
        Ext.define('DataConnectionTypeModel',{
            extend: 'Ext.data.Model',
            fields: ['description', 'type']
        })
        var me = this,
            requestType = me.requestType||'getConnectionTypes',


        connectionTypeStore = Ext.create("Ext.data.Store",{
            model: 'DataConnectionTypeModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: Ext.handler.connectionUtil,
                actionMethods: {create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
                extraParams: {
                    requestType : requestType
                },
                reader: {
                    type: 'json'
                }
            }
        });

        //connectionTypeStore.load();
        return Ext.create('Ext.ux.form.field.ClearSelectionCombo', {
            fieldLabel: Ext.localization.connection.fieldLabel.connectionType,
            displayField: 'description',
            valueField: 'type',
            allowBlank: false,
            confirmClearText:  Ext.localization.connection.msgText.clearConnectionConfirm,
            flex: 1,
            // labelWidth: 134,
            store: connectionTypeStore,
            queryMode: 'local',
            editable: false,
            loadStore: function (callback) {
                connectionTypeStore.load({
                    scope: me,
                    callback: callback
                });
            },
            getSelectedRecord: function () {
                var record = this.store.query('type', this.getValue(), false, false, true);
                if (record) {
                    return record.items[0].data;
                }
                return null;
            }

        });
    }

});