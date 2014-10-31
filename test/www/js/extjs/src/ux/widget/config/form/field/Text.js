/**
 * Created with IntelliJ IDEA.
 * User: DELL
 * Date: 30/09/13
 * Time: 03:15 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.config.form.field.Text',{
    extend: 'Ext.window.Window',
    title: 'TextField data source  configuration window',
    //alias: 'widget.textfieldDataSourceConfig',
    width: 400,
    height: 300,
    modal:true,
    plain:true,
    layout:'fit',
    /**
     * Creates data source combobox and set its data store.
     * @returns {Ext.form.field.ComboBox} combobox with configured data sources.
     */
    createSourceCbo: function () {
        var cboSource = Ext.create('Ext.form.field.ComboBox',{
            xtype:'combobox',
            store: 'DataSourceStore',
            id:'MPACboDataSource',
            name:'cboDataSource',
            editable:false,
            fieldLabel: 'Data source:',
            flex:1,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name'
        });
        return cboSource
    },
    /**
     * Creates fields combobox and set its data store.
     * @returns {Ext.form.field.ComboBox} combobox with fields of the selected data source.
     */
    createFieldsCbo: function () {
        Ext.define('cboSourceFieldModel',{
            extend:'Ext.data.Model',
            fields:['name']
        });
        var fieldStore = Ext.create('MPA.prototype.callbackStore',{
            storeId:'cboFieldStore',
            model:'cboSourceFieldModel',
            autoLoad : false,
            proxy:{
                type:'memory',
                reader:{
                    type:'json'
                }
            }
        });
        var cboFields = Ext.create('Ext.form.field.ComboBox',{
            id:'MPACboField',
            name:'cboField',
            store: fieldStore,
            fieldLabel:'Field:',
            editable:false,
            displayField: 'name',
            valueField: 'name',
            queryMode: 'local',
            flex:1,
            /**
             * Sets fields depending on the selected data source.
             * @param Data fields of the selected data source.
             */
            loadData: function(data){
                cboFields.store.removeAll();
                cboFields.setValue("");
                cboFields.store.add(data);
                cboFields.expand();
            }
        });
        return cboFields;
    },
    /**
     * Creates simple textfield
     * @returns {Ext.form.field.Text} textfield
     */
    createDefaultText: function () {
        var myDefaultText = Ext.create("Ext.form.field.Text",{
            xtype:'textfield',
            id:'MPATxtDefaultText',
            name:'txtDefaultText',
            anchor:'100%',
            fieldLabel: 'Default text:'
        });
        return myDefaultText;
    },
    /**
     * Sets configured values to the configuration window.
     */
    doAfterRender: function(){
        var me = this;
        if (me.myLayout){
            var txtID = Ext.getCmp('MPATxtID');
            txtID.setValue(me.myLayout.id);
            txtID.setDisabled(true);
            if (me.myLayout.fieldLabel){
                var txtLabel = Ext.getCmp('MPATxtLabel');
                txtLabel.setValue(me.myLayout.fieldLabel);
            }
            if (me.myLayout.defaultValue){
                var txtDefaultText = Ext.getCmp('MPATxtDefaultText');
                txtDefaultText.setValue(me.myLayout.defaultValue);
            }
            if (typeof me.myLayout.sourceConfig !== "undefined" && me.myLayout.sourceConfig.name){
                var cboSources = Ext.getCmp('MPACboDataSource'),
                    cboFields = Ext.getCmp('MPACboField'),
                    btnClearSourceSelection = Ext.getCmp('MPABtnClearSourceSelection');
                btnClearSourceSelection.setVisible(true);
                cboSources.select(me.myLayout.sourceConfig.name);
                var selected = cboSources.store.findRecord('name',me.myLayout.sourceConfig.name);
                cboFields.store.clearData();
                var callback = function () {
                    var fieldSelected = cboFields.store.findRecord('name', me.myLayout.sourceConfig.field);
                    cboFields.select(fieldSelected);
                };
                cboFields.store.loadData(selected.data.columns, false, callback);
                var txtDefaultText = Ext.getCmp('MPATxtDefaultText');
                txtDefaultText.disable();
            }
        }
    },
    /**
     * sets initial configuration to the configuration window.
     */
    initComponent:function(){
        var me = this;
        var cboSources = me.createSourceCbo();
        var cboFields = me.createFieldsCbo();
        var txtDefaultText = me.createDefaultText();
        var setFieldSource = function (combo, records) {
            cboFields.loadData(records[0].data.columns);
            clearConnectionButton.setVisible(true);
            txtDefaultText.setDisabled(true);
        };
        var setFieldTextLabel = function (combo, records) {
            var txtLabel = Ext.getCmp("MPATxtLabel");
            txtLabel.setValue(records[0].data.name);
        };
        var disableComboBox = function (myText, newValue, oldValue, eOpts) {
            if (newValue != oldValue && Ext.String.trim(newValue) == Ext.emptyString) {
                cboSources.setDisabled(false);
                cboFields.setDisabled(false);
            } else {
                cboSources.setDisabled(true);
                cboFields.setDisabled(true);
            }
        };
        /**
         * @event SourceSelect
         * fired when user selects an item in data source combobox.
         */
        cboSources.on('select', setFieldSource);

        /**
         * @event fieldSelect
         * fired when user selects an item in fields combobox.
         */
        cboFields.on('select', setFieldTextLabel);
        /**
         * @event txtDefaultTextChange
         * fired when `txtDefaultText` change.
         */
        txtDefaultText.on('change', disableComboBox);
        /**
         * use the same configuration for all the clear buttons.
         * @returns {Ext.button.Button} clear button itself.
         */
        var clearButtonFactory = function () {
            return Ext.create('Ext.button.Button', {
                iconCls: 'icon-filtergrid',
                tooltip: 'Clear Selection',
                style: 'background: transparent; ',
                scope: me,
                hidden: true,
                width: 22,
                id:'MPABtnClearSourceSelection',
                handler: function () {
                    cboSources.clearValue();
                    cboFields.clearValue();
                    cboFields.store.removeAll();
                    clearConnectionButton.setVisible(false);
                    txtDefaultText.setDisabled(false);
                }
            });
        };

        var clearConnectionButton = clearButtonFactory();

        Ext.applyIf(me,{
            listeners:{
                afterrender:me.doAfterRender
            },
            items:[{
                xtype:'form',
                id:'MPAFrmTextDataSourceConfig',
                frame:true,
                bodyPadding:5,
                border:false,
                defaults:{
                    anchor:'100%'
                },
                items:[{
                    xtype:'textfield',
                    id:'MPATxtID',
                    name:'txtID',
                    allowBlank:false,
                    fieldLabel:'ID:',
                    value: Ext.id(null,'customtextfield'),
                    maskRe:/\w/,
                    regex:/\w/,
                    listeners:{
                        blur: function (thisText) {
                            var value = thisText.getValue(),
                                regularExpression = /\w/g,
                                pattern = value.match(regularExpression);
                            if (value.length != pattern.length) {
                                thisText.invalidRegex = true;
                                return false;
                            }else{
                                thisText.invalidRegex = false;
                            }
                        }
                    }
                },{
                    xtype:'container',
                    bodyPadding:5,
                    style:'padding:0px 0px 5px 0px',
                    border:false,
                    frame: true,
                    anchor:'100%',
                    layout: {
                        type:'hbox',
                        align:'stretch'
                    },
                    items:[{
                        xtype: cboSources
                    },{
                        xtype: clearConnectionButton
                    }]
                },{
                    xtype:'container',
                    bodyPadding:5,
                    style:'padding:0px 0px 5px 0px',
                    border:false,
                    frame:true,
                    layout:{
                        type:'hbox',
                        align:'stretch'
                    },
                    items:[{
                        xtype:cboFields
                    }]
                },{
                    xtype:'textfield',
                    id:'MPATxtLabel',
                    name:'txtLabel',
                    fieldLabel:'Label:'
                },{
                    xtype:txtDefaultText
                },{
                    xtype: 'fieldset',
                    title:'Actions',
                    frame:true,
                    defaults:{
                        width:340
                    },
                    collapsible:true,
                    items:[{
                        xtype:'combobox',
                        id:'MPACboActionType',
                        name:'cboActionType',
                        fieldLabel:'Type:'
                    },{
                        xtype:'combobox',
                        id:'MPACboActionTarget',
                        name:'cboActionTarget',
                        fieldLabel:'Target:'
                    }]
                }],
                buttons:[{
                    text: 'Ok',
                    scope:me,
                    handler:function(){
                        var frm = this.items.first().form;
                        if (!frm.isValid() || (!cboSources.getValue() && !txtDefaultText.getValue())){
                            Ext.Msg.alert("Alert","Please enter required fields");
                            return false
                        }
                        if (cboSources.getValue() && !cboFields.getValue()){
                            Ext.Msg.alert("Alert","You need to select a valid field");
                            return false
                        }
                        var values = frm.getValues();
                        var duplicatedControl = document.getElementById(values.txtID),
                            myId = values.txtID;
                        if (duplicatedControl && !me.myLayout){
                            Ext.Msg.alert("Alert","Component ID already exists");
                            return false
                        }
                        var txtSourceId = Ext.getCmp("MPATxtID");
                        if (txtSourceId.invalidRegex){
                            Ext.Notify.msg('<b>Invalid ID</b>: ' +
                                '  <cite>Please enter a valid ID for the component.</cite>',
                                {layout: 'top', delay: 5000, type: 'error'});
                            return false;
                        }
                        var textDefaultValue = Ext.getCmp("MPATxtDefaultText").getValue();
                        var textFieldLabel = Ext.getCmp("MPATxtLabel").getValue();
                        if (!me.myLayout){
                            var config = {
                                xtype: 'customtextfield',
                                id: myId,
                                sourceConfig:{
                                    name: cboSources.getValue(),
                                    field: cboFields.getValue(),
                                    type: null
                                },
                                defaultValue : textDefaultValue ? textDefaultValue : null,
                                fieldLabel: textFieldLabel ? textFieldLabel : null
                            }
                            me.callback.call(this, config);
                        }else{
                            var sourceValue = cboSources.getValue();
                            if (sourceValue){
                                me.myLayout.sourceConfig={};
                                me.myLayout.sourceConfig.name = sourceValue;
                                me.myLayout.sourceConfig.field = cboFields.getValue();
                                me.myLayout.sourceConfig.type = null;
                                delete me.myLayout.defaultValue
                                delete me.myLayout.__JSON__sourceConfig;
                            }else{
                                delete me.myLayout.sourceConfig;
                                delete me.myLayout.__JSON__sourceConfig;
                                me.myLayout.defaultValue = textDefaultValue ? textDefaultValue : null
                            }
                            me.myLayout.fieldLabel = textFieldLabel ? textFieldLabel : null
                            me.callback.call(this,me.myLayout);
                        }
                        this.close();
                    }
                },{
                    text: 'Cancel',
                    scope: me,
                    handler:function(){
                        this.close();
                    }
                }]
            }]
        });
        me.callParent(arguments)
    }
})
