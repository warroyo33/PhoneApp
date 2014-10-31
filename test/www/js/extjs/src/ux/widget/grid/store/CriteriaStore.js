/**
 * Created by Desar_6 on 11/03/14.
 */
Ext.define('Ext.ux.widget.grid.store.CriteriaStore',{
    extend: 'Ext.data.Store',
    requires: ['Ext.ux.widget.grid.model.CriteriaModel'],
    storeId: 'tableViewWhereDataStore',
    model: 'Ext.ux.widget.grid.model.CriteriaModel',
    autoLoad: false,
    sorters: [{
        property: 'criteriaIndex',
        direction: 'ASC'
    }],

    proxy: {
        type: 'memory',
        reader: 'json',
        simpleSortMode: true
    }
});