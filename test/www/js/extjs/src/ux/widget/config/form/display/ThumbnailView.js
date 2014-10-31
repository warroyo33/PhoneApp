Ext.define('Ext.ux.widget.config.form.display.ThumbnailView', {
    extend: 'Ext.panel.Panel',
    //alias: 'widget.thumbnailview',
    requires: ['MPA.widget.config.form.display.IconBrowser', 'MPA.widget.config.form.display.InfoPanel'],
    header: false,
    viewIconSize: 128,
    title: 'Vistas en miniatura',
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
        var menuStore = Ext.create('Ext.data.Store', {
            fields: ['field', 'label'],
            sorters: 'type',
            data: [
                { label: 'name', field: 'name' },
                { label: 'type', field: 'type'}
            ],
            proxy: {
                type: 'memory'
            }
        })
        var menu = Ext.create('Ext.menu.Menu', { shadow: 'frame', id: 'MPAFooterMenu' });
        Ext.each(menuStore.data.items, function (i) {
            var item = Ext.create('Ext.menu.Item', {
                text: i.data.label,
                listeners: {
                    click: {
                        fn: function () {
                            me.down('dataview').store.sort(i.data.field);
                        },
                        scope: me
                    }
                }
            });

            console.log(item.on);
            menu.add(item);
        });


        this.items = [
            {
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: {
                    xtype: Ext.widget('iconbrowser', {
                        autoScroll: true,
                        border: false,
                        id: 'iconView',
                        listeners: {
                            scope: this,
                            selectionchange: this.onIconSelect,
                            itemdblclick: this.fireImageSelected
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
                        ' ',
                        {
                            xtype: 'button',
                            text: 'Order By',
                            iconCls:'orderorientationmenu-icon',
                            menuAlign: 'r',
                            menu: {
                                xtype: menu
                            }
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: 'Add More',
                            iconCls:'imageuploadtoolbar-icon',
                            handler: this.addMore
                        },
                        ' ',
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
        ];

        this.callParent(arguments);

        /**
         * Specifies a new event that this component will fire when the user selects an item. The event is fired by the
         * fireImageSelected function below. Other components can listen to this event and take action when it is fired
         */
        this.addEvents(
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
        var store = this.down('iconbrowser').store,
            view = this.down('dataview'),
            selModel = view.getSelectionModel(),
            selection = selModel.getSelection()[0];

        //store.suspendEvents();
        store.clearFilter();
        store.filter({
            property: 'name',
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

        this.down('dataview').store.sort(field);
    },
    changeSize: function (size) {
        var me = this;
        var dataview = me.down('dataview');
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
        return this.down('iconbrowser').selModel.getSelection()[0];
    },
    setSelectedImage: function (index){
        this.down('iconbrowser').selModel.select(index);
    },
    addMore: Ext.emptyFn,
    fireImageSelected: Ext.emptyFn
});
