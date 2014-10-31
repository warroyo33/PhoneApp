/**
 * Created by Desar_6 on 25/08/2014.
 */
Ext.define('Ext.ux.form.field.ClearSelectionCombo', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'clearselectioncombo',
    requires: [
        'Ext.ux.callout.Callout'
    ],

    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',

    trigger2Cls: Ext.baseCSSPrefix + 'form-trigger',

    hasSearch : false,
    confirmClearText : 'confirm',

    onTriggerWrapClick: function() {
        var me = this,
            targetEl, match,
            triggerClickMethod,
            event;

        event = arguments[me.triggerRepeater ? 1 : 0];
        if (event && !me.disabled) {
            targetEl = event.getTarget('.' + me.triggerBaseCls, null);
            match = targetEl && targetEl.className.match(me.triggerIndexRe);

            if (match) {
                triggerClickMethod = me['onTrigger' + (parseInt(match[1], 10) + 1) + 'Click'] || me.onTriggerClick;
                if (triggerClickMethod) {
                    triggerClickMethod.call(me, event);
                }
            }
        }
    },
    initComponent: function() {
        var me = this;
        me.addEvents("clearselection");
        me.callParent(arguments);
        me.on("select",me.onTrigger2);
        me.on('specialkey', function(f, e){
            if (e.getKey() == e.ENTER) {
                me.onTrigger2Click();
            }
        });
        me.on('focus',function(){
            if (me.readOnly){
                Ext.widget( 'callout', {
                    cls: 'default',
                    target: me.triggerCell.item(0),
                    html: Ext.localization.clearSelectionCombo.msgText.clearSelectionFirst,
                    calloutArrowLocation: 'top-right',
                    relativePosition: 'tr-br',
                    dismissDelay: 6000
                }).show();
            }else{
                me.expand();
            }
        });

    },

    afterRender: function(){
        var me = this;
        me.callParent();
        me.triggerCell.item(0).setDisplayed(false);
    },

    onTrigger1Click : function(){
        var me = this;
        if (me.hasSearch) {

            Ext.Msg.confirm(Ext.localization.apiName, me.confirmClearText,
                function (response) {
                    if (response === "yes") {
                        me.clearSelection();
                    } else {
                        return false;
                    }
                });

        }
    },
    clearSelection: function(){
        var me = this;
        me.setReadOnly(false);
        me.setValue('');
        me.hasSearch = false;
        me.triggerCell.item(0).setDisplayed(false);
        me.updateLayout();
        me.fireEvent("clearselection");
    },
    onTrigger2 : function(){
        var me = this,
            value = me.getValue();

        if (value.toString().length > 0) {
            // Param name is ignored here since we use custom encoding in the proxy.
            // id is used by the Store to replace any previous filter
            me.setReadOnly(true);
            me.hasSearch = true;
            me.triggerCell.item(0).setDisplayed(true);
            me.updateLayout();

        }
    }
});
