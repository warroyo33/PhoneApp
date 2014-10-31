/**
 * Created by Desar_6 on 23/09/2014.
 */
Ext.define('Ext.ux.finder.store.Items',{
    extend: 'Ext.data.TreeStore',
    model: 'Ext.ux.finder.model.Items',
    autoLoad: false,
    root: {
        text: 'Folder Structure',
        uuid: 'root',
        expanded: true
    },
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }],
    proxy: {
        type: "ajax",
        url : Ext.handler.repositoryManager,
        actionMethods: {create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
        timeout: 3600000,
        extraParams: {
            action: 'getFolderAndFileList',
            rootId: "ROOT"
        },
        reader: {
            type: 'json'
        },
        listeners: {
            exception: function (that, response, operation) {
                console.log(response);
                console.log(operation)
            }
        }
    }
});