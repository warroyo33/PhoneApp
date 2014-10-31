/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 7/11/13
 * Time: 10:07 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.grid.Main',{
    requires: [
        'Ext.ux.grid.FiltersFeature',
        'Ext.toolbar.Paging',
        'Ext.ux.ajax.JsonSimlet',
        'Ext.ux.ajax.SimManager'
    ],
    extend: 'Ext.grid.Panel',
    //alias: 'widget.custommaingridpanel',
    emptyText: 'No data to display',

    initComponent: function () {
        var me = this;
        //me.features = [new Ext.create('MPA.view.ux.grid.main.feature.filters')];

        Ext.define('Product', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'company'
            }, {
                name: 'price',
                type: 'float'
            }, {
                name: 'date',
                type: 'date',
                dateFormat: 'Y-m-d'
            }, {
                name: 'visible',
                type: 'boolean'
            }, {
                name: 'size'
            }]
        });


        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

        Ext.ux.ajax.SimManager.init({
            delay: 300,
            defaultSimlet: null
        }).register({
                'myData': {
                    data: [
                        ['small', 'small'],
                        ['medium', 'medium'],
                        ['large', 'large'],
                        ['extra large', 'extra large']
                    ],
                    stype: 'json'
                }
            });

        var optionsStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'text'],
            proxy: {
                type: 'ajax',
                url: 'myData',
                reader: 'array'
            }
        });


        Ext.QuickTips.init();

        // for this demo configure local and remote urls for demo purposes
        var url = {
            local:  'data/dummydata.json',  // static data file
            remote: 'data/dummydata.json'
        };

        // configure whether filter query is encoded or not (initially)
        var encode = false;

        // configure whether filtering is performed locally or remotely (initially)
        var local = true;

        var store = Ext.create('Ext.data.JsonStore', {
            // store configs
            autoDestroy: true,
            model: 'Product',
            proxy: {
                type: 'ajax',
                url: (local ? url.local : url.remote),
                reader: {
                    type: 'json',
                    root: 'data',
                    idProperty: 'id',
                    totalProperty: 'total'
                }
            },
            remoteSort: false,
            sorters: [{
                property: 'company',
                direction: 'ASC'
            }],
            pageSize: 50
        });

        var filters = {
            ftype: 'filters',
            // encode and local configuration options defined previously for easier reuse
            encode: encode, // json encode the filter query
            local: local,   // defaults to false (remote filtering)

            // Filters are most naturally placed in the column definition, but can also be
            // added here.
            filters: [{
                type: 'boolean',
                dataIndex: 'visible'
            }]
        };

        var createColumns = function (finish, start) {

            var columns = [{
                dataIndex: 'id',
                text: 'Id',
                // instead of specifying filter config just specify filterable=true
                // to use store's field's type property (if type property not
                // explicitly specified in store config it will be 'auto' which
                // GridFilters will assume to be 'StringFilter'
                filterable: true,
                width: 30
                //,filter: {type: 'numeric'}
            }, {
                dataIndex: 'company',
                text: 'Company',
                id: 'company',
                flex: 1,
                filter: {
                    type: 'string'
                    // specify disabled to disable the filter menu
                    //, disabled: true
                }
            }, {
                dataIndex: 'price',
                text: 'Price',
                filter: {
                    //type: 'numeric'  // specify type here or in store fields config
                },
                width: 70
            }, {
                dataIndex: 'size',
                text: 'Size',
                filter: {
                    type: 'list',
                    store: optionsStore
                    //,phpMode: true
                }
            }, {
                dataIndex: 'date',
                text: 'Date',
                filter: true,
                renderer: Ext.util.Format.dateRenderer('m/d/Y')
            }, {
                dataIndex: 'visible',
                text: 'Visible'
                // this column's filter is defined in the filters feature config
            }];

            return columns.slice(start || 0, finish);
        };
        Ext.applyIf(me,{
            stateful: true,
            stateId: 'stateful-filter-grid',
            border: false,
            store: store,
            columns: createColumns(4),
            loadMask: true,
            features: [filters],
            dockedItems: [Ext.create('Ext.toolbar.Paging', {
                dock: 'bottom',
                store: store
            })],
            emptyText: 'No Matching Records'
        });
        me.callParent(arguments);

        store.load();
    },
    /*listeners: {

     },*/
    disableFilters: function (me) {
        me.filters.clearFilters();
    },
    onItemDoubleClick: function (grid, record, item, index, e, eOpts) {
        alert(record.get("FECHA"));
    },
    onItemContextMenu: function (grid, record, item, index, e, eOpts) {
        Ext.create('Ext.menu.Menu', {
            items: [{
                text: 'New',
                listeners: {
                    click: this.onItemContextMenu
                }
            }, {
                text: 'Edit'
            }, {
                text: 'Inline Edit'
            }, '-', {
                text: 'Remove'
            }, {
                text: 'View'
            }, {
                text: 'Log'
            }],
            listeners: {
                hide: function () {
                    Ext.get(this.el.id).remove();
                }
            }
        }).showAt(e.xy);
    },
    setToolbar: function (config) {

    },
    getStore: function () {
        return this.store;
    },
    setID: function (id) {
        this.id = id;
    },
    setColumns: function (Columns) {
        this.columns = Columns
    },
    createColumns: function (headers) {

    }
})