/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 5/08/13
 * Time: 09:28 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.config.form.display.Dialog', {
    extend: 'Ext.window.Window',
    title: 'Image configuration',
    //alias: 'widget.customimagedialog',
    width: 550,
    height: 480,
    layout: 'border',
    modal: true,

    initComponent: function () {
        var me = this;
        me.addEvents("confirmchange");
        me.acceptConfig= function () {
            var form = Ext.getCmp('sizeConfig').getForm();
            if (form.isValid()) {
                var selectedImage = Ext.getCmp('MPAThumbnailView').getSelectedImage();
                if (selectedImage) {
                    var values = form.getValues();
                    me.close();
                    if (!me.myConfig){
                        var config = {
                            xtype: 'customimage',
                            src: selectedImage.data.thumb,
                            height: values['heightText'],
                            width: values['widthText'],
                            border: (values['borderChx'] ? true : false),
                            borderSize: values['borderSizeText'],
                            borderStyle: values['borderStyleText']
                        };
                        me.callback.call(me, config);
                    }else{
                        me.fireEvent("confirmchange");
                        me.myConfig.src= selectedImage.data.thumb;
                        me.myConfig.height= values['heightText'];
                        me.myConfig.width= values['widthText'];
                        me.myConfig.border= (values['borderChx'] ? true : false);
                        me.myConfig.borderSize= values['borderSizeText'];
                        me.myConfig.borderStyle= values['borderStyleText'];
                        me.callback.call(me,me.myConfig.initialConfig);
                    }
                } else {
                    Ext.Msg.alert('Error', 'You must to choose an image.');
                    return false;
                }
            }
        };
        Ext.applyIf(me, {
            listeners: {
                afterrender: me.doAfterRender
            },
            items: [
                Ext.create('MPA.widget.config.form.display.ThumbnailView', {
                    id: 'MPAThumbnailView',
                    region: 'center',
                    border: false,
                    addMore: function () {
                        var upload = Ext.getCmp('MPAUploadForm');
                        //upload.setVisible(true);
                        if (upload.collapsed)
                            upload.expand();
                        else
                            upload.collapse();
                    },
                    fireImageSelected: this.acceptConfig
                }),
                {
                    region: 'north',
                    xtype: 'form',
                    id: 'MPAUploadForm',
                    title: "Add more Images",
                    //hidden: true,
                    //collapseMode: 'mini',
                    header: false,
                    collapsible: true,
                    collapsed: true,
                    hideCollapseTool: true,
                    frame: true,
                    height: 35,
                    bodyPadding: 2,
                    items: [
                        {
                            xtype: 'filefield',
                            id: 'MPAUploaderImage',
                            name: 'image',
                            fieldLabel: 'Photo',
                            labelWidth: 50,
                            msgTarget: 'side',
                            allowBlank: false,
                            anchor: '100%',
                            buttonText: 'Select Photo...'
                        }
                    ],

                    rbar: [
                        {
                            xtype: 'button',
                            text: 'Upload',
                            iconCls: 'image-upload',
                            handler: function () {
                                var form = this.up('form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        clientValidation: true,
                                        url: 'handler/image/repository.aspx',
                                        waitMsg: 'Uploading your photo...',
                                        params: {
                                            action: 'uploadFiles'
                                        },
                                        success: function (form, action) {
                                            Ext.getCmp('MPAThumbnailView').down('iconbrowser').store.load();
                                            Ext.Msg.alert('Success', action.result.msg);
                                        },
                                        failure: function (form, action) {
                                            if (action.result.success) {
                                                Ext.getCmp('MPAThumbnailView').down('iconbrowser').store.load();
                                                Ext.Msg.alert('Success', action.result.msg);
                                            } else {
                                                switch (action.failureType) {
                                                    case Ext.form.action.Action.CLIENT_INVALID:
                                                        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                                                        break;
                                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                                        Ext.Msg.alert('Failure', 'Ajax communication failed');
                                                        break;
                                                    case Ext.form.action.Action.SERVER_INVALID:
                                                        Ext.Msg.alert('Failure', action.result.msg);
                                                }
                                            }
                                        }

                                    });
                                    var upload = Ext.getCmp('MPAUploadForm');
                                    upload.collapse();
                                    //upload.setVisible(false);
                                }
                            }
                        }
                    ]
                }, {
                    xtype: 'form',
                    region: 'south',
                    id: 'sizeConfig',
                    //layout: 'hbox',
                    frame: true,
                    bodyPadding: 2,
                    items: [{
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: 'Width',
                                id: "widthText",
                                name: "widthText",
                                labelWidth: 40,
                                minValue: 0,
                                allowBlank: false,
                                maxValue: 1000,
                                flex: 1,
                                value: 100

                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: 'Height',
                                labelWidth: 40,
                                id: "heightText",
                                name: "heightText",
                                padding: '0 0 0 10',
                                minValue: 0,
                                allowBlank: false,
                                maxValue: 1000,
                                maxLength: 4,
                                flex: 1,
                                value: 100

                            }
                            ]
                    },{
                        xtype: 'fieldset',
                        title: 'Border',
                        id: 'boderFieldSet',
                        layout: 'hbox',
                        collapsible: true,
                        bodyPadding: '0 0 10 0',
                        collapsed: true,
                        checkboxToggle: true,
                        checkboxName: "borderChx",
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: 'borderSize',
                                id: "borderSizeText",
                                name: "borderSizeText",
                                labelWidth: 60,
                                minValue: 1,
                                allowBlank: false,
                                maxValue: 10,
                                flex: 1,
                                value: 1

                            },{
                                xtype: 'combobox',
                                editable: false,
                                id: "borderStyleText",
                                name: "borderStyleText",
                                fieldLabel: 'borderStyle',
                                labelWidth: 65,
                                padding: '0 0 0 10',
                                flex: 1,
                                height: 24,
                                value: 'solid',
                                store: [
                                    [ 'solid', "solid" ],
                                    [ 'dashed', "dashed" ],
                                    [ 'dotted', "dotted" ],
                                    [ 'double', "double" ]
                                ]
                            }
                        ]
                    }],
                    buttons:[{
                            xtype: 'button',
                            width: 50,
                            text: 'Ok',
                            scope: me,
                            handler: this.acceptConfig
                        },
                        {
                            xtype: 'button',
                            width: 50,
                            text: 'Cancel',
                            scope: me,
                            handler: function () {
                                this.close();
                            }
                        }
                    ],
                    height: 110
                }
            ]
        });

        me.callParent(arguments);
    },
    doAfterRender: function(){
        var me = this;
        if (me.myConfig){
            Ext.getCmp('heightText').setValue(me.myConfig.height);
            Ext.getCmp('widthText').setValue(me.myConfig.width);
            if (me.myConfig.border)
                Ext.getCmp('boderFieldSet').checkboxCmp.setValue(true);
            Ext.getCmp('borderSizeText').setValue(me.myConfig.borderSize);
            Ext.getCmp('borderStyleText').setValue(me.myConfig.borderStyle);
            var iconBrowser= Ext.getCmp('MPAThumbnailView').down('iconbrowser');
            iconBrowser.store.on('load',function(){
                var indexSelected = iconBrowser.store.find('thumb',me.myConfig.src,0,false,false,true);
                if (indexSelected>-1)
                    Ext.getCmp('MPAThumbnailView').setSelectedImage(indexSelected);

            })
        }
    }

});