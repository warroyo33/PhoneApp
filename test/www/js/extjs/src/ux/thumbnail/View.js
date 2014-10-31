Ext.define('Ext.ux.thumbnail.View', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mpagthumbnailview',
    requires: ['Ext.ux.thumbnail.IconBrowser'],
    header: false,
    viewIconSize: 128,
    //title: 'Vistas en miniatura',
    //closeAction: 'hide',
    layout: 'border',
    // modal: true,
    //border: false,
    //bodyBorder: false,

    /**
     * initComponent is a great place to put any code that needs to be run when a new instance of a component is
     * created. Here we just specify the items that will go into our Window, plus the Buttons that we want to appear
     * at the bottom. Finally we call the superclass initComponent.
     */
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'fit',
                    items: {
                        xtype: Ext.widget('mpagiconbrowser', {
                            store: me.store,
                            id: 'ThumbnailDataView',
                            groupField: me.groupField,
                            nameField: me.nameField,
                            thumbnailField: me.thumbnailField,
                            listeners: {
                                itemcontextmenu: me.contextMenu,
                                /*itemdblclick: function( dataView, record, item, index, e, eOpts){
                                 Ext.getCmp('MPAMainMultiView').initReleaseViewport(record);
                                 },*/
                                containerclick: function (dataView, e) {
                                    console.log('containerClick');
                                    var target = e.getTarget(),
                                        Ex = Ext,
                                        ExArray = Ex.Array;
                                    if (target.name == "expanderButton") {
                                        if (Ex.isIE9m) {
                                            var classList = target.className.split(' ');
                                            target.classList = classList
                                        }
                                        var targetContainer = Ex.get(target.classList[0].replace('-groupExpander', '-containerWrapper'))
                                        if (targetContainer) {
                                            if (target.value === "Show More") {
                                                targetContainer.dom.style.width = "100%"
                                                target.value = "Show Less";
                                                target.classList.remove('sourceexpand-menuicon');
                                                target.classList.add('sourcecollapse-menuicon');
                                            } else {
                                                var group = target.classList[0].replace('-groupExpander', '').replace('slh', '/')
                                                var collection = dataView.store.query('designGroup', group, false, false, true);
                                                var resize = (dataView.itemSize * 1) + 16
                                                var returnSize = collection.length ? resize * collection.length : resize * collection.items.length;
                                                returnSize = (returnSize * 1) + 100;
                                                targetContainer.dom.style.width = returnSize + "px";
                                                target.value = "Show More";
                                                target.classList.add('sourceexpand-menuicon');
                                                target.classList.remove('sourcecollapse-menuicon');
                                            }

                                        }
                                    }
                                }
                            }
                        })
                    },

                    tbar: Ext.create('Ext.toolbar.Toolbar', {
                        layout: {
                            overflowHandler: 'Menu'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'filtro',
                                fieldLabel: 'Filter',
                                labelAlign: 'right',
                                labelWidth: 35,
                                listeners: {
                                    scope: this,
                                    buffer: 50,
                                    change: this.filter
                                }
                            },

                            '->',
                            {
                                xtype: 'button',
                                iconCls: 'imagesizemenu-icon',
                                text: 'Size',
                                menuAlign: 'tr-br?',
                                menu: {
                                    xtype: 'menu',
                                    width: 120,
                                    items: [
                                        {
                                            xtype: 'menuitem',
                                            text: 'Small',
                                            listeners: {
                                                click: {
                                                    fn: function () {
                                                        me.changeSize(75);
                                                    },
                                                    scope: me
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'Medium',
                                            listeners: {
                                                click: {
                                                    fn: function () {
                                                        me.changeSize(100);
                                                    },
                                                    scope: me
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'Large',
                                            listeners: {
                                                click: {
                                                    fn: function () {
                                                        me.changeSize(125);
                                                    },
                                                    scope: me
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    })
                }/*,
                 {
                 xtype: Ext.widget('infopanel',{
                 region: 'east'}),
                 split: true
                 }  */
            ]
        });


        me.callParent(arguments);

        /**
         * Specifies a new event that this component will fire when the user selects an item. The event is fired by the
         * fireImageSelected function below. Other components can listen to this event and take action when it is fired
         */
        me.addEvents(
            /**
             * @event selected
             * Fired whenever the user selects an image by double clicked it or clicking the window's OK button
             * @param {Ext.data.Model} image The image that was selected
             */
            'selected'
        );
    },

    /*
     *METODOS
     */
    filter: function (field, newValue) {
        var store = Ext.getCmp('ThumbnailDataView').store,
            view = Ext.getCmp('ThumbnailDataView'),
            selModel = view.getSelectionModel(),
            selection = selModel.getSelection()[0];

        //store.suspendEvents();
        store.clearFilter();
        store.filter({
            property: 'versionid',
            anyMatch: true,
            value: newValue
        });
        // store.resumeEvents();
        /*if (selection && store.indexOf(selection) === -1) {
         selModel.clearSelections();
         this.down('infopanel').clear();
         }       */
        view.refresh();

    },
    sort: function (field) {
        //var field = this.down('combobox').getValue();

        Ext.getCmp('ThumbnailDataView').store.sort(field);
    },
    changeSize: function (size) {
        var me = this;
        var dataview = Ext.getCmp('ThumbnailDataView');
        dataview.tpl = dataview.createTemplate(size);
        dataview.refresh();
    },
    onIconSelect: function (dataview, selections) {
        var selectedImage = selections[0];
        if (selectedImage) {
            this.fireEvent('selected', selectedImage);
            Ext.select("div.x-item-selected").frame("#478FBA", 1, { duration: 100 });
        }
    },
    getSelectedImage: function () {
        return Ext.getCmp('ThumbnailDataView').selModel.getSelection()[0];
    },
    setSelectedImage: function (index){
        Ext.getCmp('ThumbnailDataView').selModel.select(index);
    },
    addMore: Ext.emptyFn,
    fireImageSelected: Ext.emptyFn
});
