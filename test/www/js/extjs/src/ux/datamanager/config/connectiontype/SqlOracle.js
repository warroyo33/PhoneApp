/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 2/10/13
 * Time: 10:55 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.datamanager.config.connectiontype.SqlOracle',{
    extend: 'Ext.container.Container',

    alias: 'widget.connectiondefault',
    //frame: true,
    frameBorder: false,
    border: 0,
    bodyBorder: false,
    layout:'anchor',
    model: null,
    defaults: {
        anchor: '100%'
    },
    constructor: function () {
        this.callParent(arguments);
    },
    initComponent: function(){
        var me = this,
            Ex= Ext,
            ExLocale=Ex.localization,
            ExWidget = Ex.widget;
        var nameField= ExWidget('textfield',{
            name: 'name',
            maskRe:/\w/,
            //labelWidth: 134,
            allowBlank : false,
            disabled: me.model?true: false,
            fieldLabel: ExLocale.connection.fieldLabel.connectionName,
            emptyText:  ExLocale.connection.emptyText.name
        });
        var descriptionField= ExWidget('textfield',{
            name: 'description',
            //labelWidth: 134,
            allowBlank: false,
            fieldLabel: ExLocale.connection.fieldLabel.connectionDescription,
            emptyText: ExLocale.connection.emptyText.description
        });
        var userField= ExWidget('textfield',{
            name: 'user',
            //labelWidth: 134,
            allowBlank : false,
            fieldLabel: ExLocale.connection.fieldLabel.user,
            emptyText: ExLocale.connection.emptyText.user
        });
        var passwordField= ExWidget('textfield',{
            name: 'password',
            //labelWidth: 134,
            allowBlank : false,
            inputType: 'password',
            fieldLabel: ExLocale.connection.fieldLabel.password,
            emptyText: ExLocale.connection.emptyText.password
        });
        var initialCatalogField= ExWidget('textfield',{
            name: 'initialCatalog',
            //labelWidth: 134,
            allowBlank : false,
            fieldLabel: ExLocale.connection.fieldLabel.initialCatalog,
            emptyText: ExLocale.connection.emptyText.initialCatalog
        });
        var serverField = ExWidget('textfield',{
            name: 'server',
            //labelWidth: 134,
            allowBlank : false,
            fieldLabel: ExLocale.connection.fieldLabel.serverPath,
            emptyText: ExLocale.connection.emptyText.serverPath
        });

        me.addEvents(
            /**
             * remote triggered method to internally validate the typed data, if its
             * valid and the parameter "CALLBACK" is given, then this method executes
             * the callback, otherwise, just validate the data
             * @param callback {function}
             */
            'isvalid',
            /**
             * remote triggered method to collect the typed data of this form, if
             * the parameter "CALLBACK" is given, then this method executes
             * the callback passing as parameter the current data in the form,
             * otherwise, the data will not be returned to the dialog
             * @param callback {function}
             */
            'createparams');
        /**
         * isvalid event occurs when the parent dialog request the validation of the current data
         * this event is triggered by the "Test Configuration" button, or the "OK" button
         */
        var isValid= function (callback) {
            if(callback) callback((nameField.getValue()!=="" && userField.getValue()!=="" && passwordField.getValue()!=="" && initialCatalogField.getValue()!=="" && serverField.getValue()!==""));
        };
        /**
         * listener for this own event that will be remote triggered
         */
        me.on('isvalid', isValid);
        /**
         * createparams event occurs when the validation of the data has returned a success and the parent container request the data of
         * the current form.
         * this event is triggered by the "Test Configuration" button, or the "OK" button
         */
        var getParameters= function(callback) {
            var params = {};
            var name = nameField.getValue();
            var server = /*MyCrto.Ctr.encrypt(*/serverField.getValue()/*,MyOrg,352)*/;
            var descriptionValue = descriptionField.getValue();
            var userValue = userField.getValue();
            var passwordValue = passwordField.getValue();
            var initialCatalogValue = initialCatalogField.getValue();
            params.name =name ;
            params.description = descriptionValue;
            params.user= userValue;
            params.password = passwordValue;
            params.initialCatalog = initialCatalogValue;
            params.server = server;
            if(callback) callback(params);
        };
        me.on('createparams',getParameters);
        Ex.applyIf(me,{
            items: [ nameField,
                descriptionField,
                userField,
                passwordField,
                initialCatalogField,
                serverField,
                {
                    xtype: 'label',
                    text: me.model? ExLocale.connection.msgText.encryptedDataWarning:'',
                    anchor: '100%'
                }
            ]
        });
        me.callParent(arguments);
        if (me.model){
            var model= me.model.data;
            nameField.setValue(model.name);
            descriptionField.setValue(model.description);
            userField.setValue(model.user);
            passwordField.setValue(model.password);
            initialCatalogField.setValue(model.initialCatalog);
            serverField.setValue(model.server);
        }
    }
});