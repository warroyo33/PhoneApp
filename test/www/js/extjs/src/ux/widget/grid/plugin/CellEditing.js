/**
 * Created by Desar_6 on 4/03/14.
 */
Ext.define('Ext.ux.widget.grid.plugin.CellEditing',{
    extend: 'Ext.grid.plugin.CellEditing',
    mixins: ['Ext.ux.widget.grid.Util'],
    init: function(grid) {
        var me = this;
        me.addEvents('displayadvanceddialog')
        me.callParent(arguments);
        me.editors = me.initEditors();
    },
    isValidValue:function(value){
        var tokens;
        if (typeof value ==="string"){
            if (value.indexOf('{{') !== -1 && value.indexOf('}}') !== -1) {
                value = value.replace('{{', '').replace('}}', '');
                tokens = value.split('.');
                if (tokens.length === 3) {
                    if (tokens[0].trim() === "Parameter" || tokens[0].trim() === "DataSource" || tokens[0].trim() === "Variable" || tokens[0].trim() === 'Constant') {
                        var fieldDataStoreName = tokens[0].toString() + 'DisplayStore',
                            fieldDataStore = Ext.StoreManager.lookup(fieldDataStoreName),
                            actualValueInDisplayStore = fieldDataStore.query('dataIndex', tokens[2].toString(), false, false, true);
                        if (actualValueInDisplayStore.length) {
                            return tokens;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                }
                else {
                    return null;
                }
            }
        }
        return null;

    },
    getEditor: function(record, column) {

        var me = this,
            editors = me.editors,
            editorId = column.getItemId(),
            editor = editors.getByKey(editorId),
            dataIndex = column.dataIndex,
            recordValue = record.get('value'),
        // Add to top level grid if we are editing one side of a locking system
            editorOwner = me.grid.ownerLockable || me.grid;
        var isValid= me.isValidValue(recordValue);
        if (dataIndex==="value"){
            if (isValid){
                me.fireEvent('displayadvanceddialog',record,isValid);
                return false;
            }
        }
        if (!editor) {
            if (dataIndex==="value"){
                editor = editors.getByKey(record.get('fieldType'));
                //editor.editorId= editorId;
            }else{
                editor = column.getEditor(record);
            }

            if (!editor) {
                return false;
            }

            // Allow them to specify a CellEditor in the Column
            if (editor instanceof Ext.grid.CellEditor) {
                editor.floating = true;
            }
            // But if it's just a Field, wrap it.
            else {
                editor = new Ext.grid.CellEditor({
                    floating: true,
                    editorId: editorId,
                    field: editor
                });
            }
            // Add the Editor as a floating child of the grid
            // Prevent this field from being included in an Ext.form.Basic
            // collection, if the grid happens to be used inside a form
            editor.field.excludeForm = true;
            editorOwner.add(editor);
            editor.on({
                scope: me,
                specialkey: me.onSpecialKey,
                complete: me.onEditComplete,
                canceledit: me.cancelEdit
            });
            column.on('removed', me.cancelActiveEdit, me);
            if (dataIndex!=="value")
                editors.add(editor);
        }

        if (column.isTreeColumn) {
            editor.isForTree = column.isTreeColumn;
            editor.addCls(Ext.baseCSSPrefix + 'tree-cell-editor');
        }
        editor.grid = me.grid;

        // Keep upward pointer correct for each use - editors are shared between locking sides
        editor.editingPlugin = me;
        return editor;



    }
})