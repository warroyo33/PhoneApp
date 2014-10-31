/**
 * Created by DELL on 05/06/2014.
 */
Ext.define('Ext.ux.widget.grid.model.SimpleCriteriaModel',{
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'connector',
            defaults: 'AND',
            convert: function(value){
                if (value ==="")
                    return 'AND';
                else
                    return value;
            }
        },
        'value',
        {
            "name":'operator',
            convert: function(value){
                if (value ==="")
                    return "=";
                else
                    return value;
            }
        },
        {
            "name":'parenthesisI',
            convert: function(value){
                if (value ==="")
                    return 0;
                else
                    return value;
            }
        },
        {
            "name":'parenthesisF',
            convert: function(value){
                if (value ==="")
                    return 0;
                else
                    return value;
            }
        },
        'criteriaIndex'
    ]
});
