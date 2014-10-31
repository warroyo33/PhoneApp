/**
 * Created by Desar_6 on 11/03/14.
 */
Ext.define('Ext.ux.widget.grid.model.CriteriaModel',{
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
        'fieldCombo',
        'value',
        {
            "name":'field',
            convert:function(value,model){
                var fieldComboStore = Ext.StoreManager.lookup(model.get('fieldCombo'));
                if (fieldComboStore){

                    var fieldRecord = fieldComboStore.findRecord ('dataIndex',value,0,false,false,true);

                    if (fieldRecord){

                        model.data.fieldType=fieldRecord.get('type');
                    }else{
                        model.data.fieldType=0;
                    }
                }
                return value;
            }
        },
        'alias',
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
        'fieldType',
        'criteriaIndex'
    ]
});