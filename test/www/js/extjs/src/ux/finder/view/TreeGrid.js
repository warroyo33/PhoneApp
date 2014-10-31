Ext.define('Ext.ux.finder.view.TreeGrid', {
    extend: 'Ext.tree.Panel',

    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*'
    ],
    xtype: 'tree-grid',

    //<example>
    exampleTitle: 'TreeGrid',
    exampleDescription: [
        '<p>',
        '    This example is an advanced tree example. It illustrates:',
        '</p>',
        '<ul class="feature-list">',
        '    <li>Multiple headers</li>',
        '    <li>Preloading of nodes with a single AJAX request</li>',
        '    <li>Header hiding, showing, reordering and resizing</li>',
        '    <li>useArrows configuration</li>',
        '    <li>Keyboard Navigation</li>',
        '    <li>Discontiguous selection by holding the CTRL key</li>',
        '    <li>Using custom iconCls</li>',
        '    <li>singleExpand has been set to true</li>',
        '</ul>'
    ].join(''),
    themes: {
        classic: {
            width: 500,
            colWidth: 40
        },
        neptune: {
            width: 600,
            colWidth: 55
        }
    },
    //</example>

    //useArrows: true,
    rootVisible: false,
    //multiSelect: true,
    //singleExpand: true,
    viewConfig: {
        stripeRows : true
    },
    initComponent: function() {
        //this.width = this.themeInfo.width;
        var store = Ext.create('Ext.ux.finder.store.Items',{
            storeId:'TreeGridStore'
        });
        Ext.apply(this, {
            store: store,
            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'Name',
                flex: 2,
                sortable: true,
                dataIndex: 'text'
            },{
                text: 'Creation Date',
                flex: 1,
                dataIndex: 'creationDate',
                sortable: true
            },{
                text: 'Creation User',
                flex: 1,
                dataIndex: 'creationUser',
                sortable: true
            },{
                text: 'Creation User',
                flex: 1,
                dataIndex: 'modificationUser',
                sortable: true
            },{
                text: 'Creation User',
                flex: 1,
                dataIndex: 'modificationUser',
                sortable: true
            }],
            loadFromNodeId: function(nodeId){
                store.getRootNode().removeAll();
                store.proxy.extraParams.rootId = nodeId;
                store.load();
            },
            listeners:{
                "refresh": function(){
                    console.log("afterrender");
                }
            }
        });
        this.callParent(arguments);
    }
});