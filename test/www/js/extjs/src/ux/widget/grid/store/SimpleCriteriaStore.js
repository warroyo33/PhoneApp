/**
 * Created by DELL on 05/06/2014.
 */
Ext.define('Ext.ux.widget.grid.store.SimpleCriteriaStore',{
    extend: 'Ext.data.Store',
    requires: ['Ext.ux.widget.grid.model.SimpleCriteriaModel'],
    storeId: 'MpaSimpleCriteriaDataStore',
    model: 'Ext.ux.widget.grid.model.SimpleCriteriaModel',
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
