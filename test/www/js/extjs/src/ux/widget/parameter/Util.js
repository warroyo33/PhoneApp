/**
 * Created by Desar_6 on 26/02/14.
 */
Ext.define('Ext.ux.widget.parameter.Util',{
    getEditorByType: function(type, parameter){
        var parameterEditor;
        switch(type){
            case 0 :
                parameterEditor = Ext.create('Ext.ux.widget.parameter.field.Text',{
                    text : parameter.alias,
                    dataIndex : parameter.dataIndex,
                    type : parameter.type,
                    maxLength: parameter.length||150,
                    anchor: '100%',
                    labelWidth: 150
                });
                break;
            case 1 :
                parameterEditor = Ext.create('Ext.ux.widget.parameter.field.Number',{
                    text : parameter.alias,
                    dataIndex : parameter.dataIndex,
                    type : parameter.type,
                    value : 0,
                    maxLength: parameter.length||150,
                    anchor: '100%',
                    labelWidth: 150
                });
                break;
            case 2 :
                parameterEditor = Ext.create('Ext.ux.widget.parameter.field.TextArea',{
                    text : parameter.alias,
                    dataIndex : parameter.dataIndex,
                    type : parameter.type,
                    maxLength: parameter.length||150,
                    anchor: '100%',
                    labelWidth: 150
                });
                break;
            case 3 :
                parameterEditor = Ext.create('Ext.ux.widget.parameter.field.Date',{
                    text : parameter.alias,
                    dataIndex : parameter.dataIndex,
                    type : parameter.type,
                    maxLength: parameter.length||150,
                    anchor: '100%',
                    labelWidth: 150
                });
                break;
            case 5 :
                parameterEditor = Ext.create('Ext.ux.widget.parameter.field.Time',{
                    text : parameter.alias,
                    dataIndex : parameter.dataIndex,
                    type : parameter.type,
                    maxLength: parameter.length||150,
                    anchor: '100%',
                    labelWidth: 150
                });
                break;
        }
        return parameterEditor;
    }
});