/**
 * Created by Desar_6 on 4/03/14.
 */
Ext.define('Ext.ux.widget.grid.Util',{
    initEditors: function () {
        var me = this,
            editors = new Ext.util.MixedCollection(false, function(editor) {
            return editor.editorId;
        });
        editors.add('date',new Ext.grid.CellEditor({ field: new Ext.form.field.Date({selectOnFocus: true})}));
        editors.add('string', new Ext.grid.CellEditor({ field: new Ext.form.field.Text({selectOnFocus: true, listeners: {blur: function () {
            ////console.log(this);
            ////console.log("blur")
        }}})}));
        editors.add('number',new Ext.grid.CellEditor({ field: new Ext.form.field.Number({selectOnFocus: true})}));
        editors.add('boolean', new Ext.grid.CellEditor({ field: new Ext.form.field.ComboBox({
            editable: false,
            store: [
                [ true, "true" ],
                [false, "false" ]
            ]
        })}));
        editors.add('0', new Ext.grid.CellEditor({ floating: true, field: new Ext.form.field.Text({selectOnFocus: true, listeners: {blur: function () {
            ////console.log(this);
            ////console.log("blur")
        }}})}));
        editors.add('1',new Ext.grid.CellEditor({ floating: true,field: new Ext.form.field.Number({selectOnFocus: true})}));
        editors.add('2', new Ext.grid.CellEditor({ floating: true,field: new Ext.form.field.Text({selectOnFocus: true, listeners: {blur: function () {
            ////console.log(this);
            ////console.log("blur")
        }}})}));
        editors.add('3',new Ext.grid.CellEditor({ floating: true,field: new Ext.form.field.Date({selectOnFocus: true})}));

        return  editors/*{
            *//*'boolean': new Ext.grid.CellEditor({ field: new MPA.view.ux.form.field.ToggleSlider({

             })}), *//*
            regexp: new Ext.grid.CellEditor({ field: new MPA.view.ux.form.CodeField({
                defaultValue: "new RegExp()",
                codePress: me.codePress,
                codePressPath: me.codePressPath
            })
            }),
            "function": new Ext.grid.CellEditor({ field: new MPA.view.ux.form.CodeField({
                defaultValue: "function(){}",
                codePress: me.codePress,
                codePressPath: me.codePressPath
            })
            }),
            object: new Ext.grid.CellEditor({ field: new MPA.view.ux.form.CodeField({
                defaultValue: "{}",
                codePress: me.codePress,
                codePressPath: me.codePressPath
            })
            }),
            "object/array": new Ext.grid.CellEditor({ field: new MPA.view.ux.form.CodeField({
                defaultValue: "[{}]",
                codePress: me.codePress,
                codePressPath: me.codePressPath
            })
            }),
            array: new Ext.grid.CellEditor({ field: new MPA.view.ux.form.CodeField({
                defaultValue: "[]",
                codePress: me.codePress,
                codePressPath: me.codePressPath
            })
            }),
            template: new Ext.grid.CellEditor({ field: new MPA.view.ux.form.CodeField({
                defaultValue: "",
                codePress: me.codePress,
                codePressPath: me.codePressPath
            })
            }),
            mixed: new Ext.grid.CellEditor({ field: new MPA.view.ux.form.CodeField({
                defaultValue: "[]",
                codePress: me.codePress,
                codePressPath: me.codePressPath
            })
            }),
            html: new Ext.grid.CellEditor({ field: new MPA.view.ux.form.CodeField({
                defaultValue: "",
                language: "text/html",
                codePress: me.codePress,
                codePressPath: me.codePressPath
            })
            }),
            css: new Ext.grid.CellEditor({ field: new MPA.view.ux.form.CodeField({
                defaultValue: "",
                language: "text/css",
                codePress: me.codePress,
                codePressPath: me.codePressPath
            })
            }),
            editList: new Ext.grid.CellEditor({field: new MPA.view.ux.form.SimpleCombo({
                forceSelection: false,
                data: [],
                editable: true,
                customProperties: true
            })
            }),
            list: new Ext.grid.CellEditor({field: new MPA.view.ux.form.SimpleCombo({
                forceSelection: false,
                data: [],
                editable: true,
                customProperties: false
            })
            })

        }*/;
    }
});