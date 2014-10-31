/**
 * layout column initial configuration
 */
Ext.define('Ext.ux.widget.config.layout.Column',{
    extend: 'Ext.window.Window',
    title: 'Layout column configuration',
    //alias: 'widget.columnConfig',
    requires:['Ext.ux.toggleslide.ToggleSlide'],
    width: 400,
    height: 350,
    plain:true,
    modal: true,
    /**
     * Initialize the window with required components.
     */
    initComponent: function(){
        var me = this;
        me.addEvents(
            /**
             * fired to mark `undo`.
             */
            "confirmchange"
        );
        Ext.applyIf(me,{
            listeners: {
                afterrender: me.doAfterRender
            },
            items:[{
                xtype:"form",
                border:false,
                id:"frmConfigColumn",
                items:[{
                    frame:true,
                    layout: {
                        type: 'table',
                        columns: 4
                    },
                    defaults:{
                        style:"margin:2px"
                    },
                    items:[{
                        title:"Column",
                        width:58
                    },{
                        title:"Size *"
                    },{
                       title:"Lock",
                        width:45
                    },{
                        title:"Title **",
                        width:205
                    },{
                        xtype:"checkbox",
                        id:'active_1',
                        name:'active_1',
                        style:"marginLeft:20px",
                        checked:true,
                        disabled:true
                    },{
                        xtype:"textfield",
                        id:'size_1',
                        regex: new RegExp("^[0-9]\\d{0,2}(\\.\\d{1,20})?%?$|^[0-9]\\d{0,3}(\\.\\d{1,2})?$"),
                        width:53,
                        name:'size_1',
                        listeners: {
                            blur: Ext.bind(this.doOnSizeTextBlur,this),
                            focus: Ext.bind(this.doOnSizeTextFocus,this)
                        }
                    },{
                        xtype:"toggleslide",
                        id: "lock_1",
                        name: "lock_1",
                        onText: "<img src='guidesigner/resources/icons/fugue/icons/lock.png'/>",
                        offText: "<img src='guidesigner/resources/icons/fugue/icons/lock-unlock.png'/>",
                        disabled: true,
                        resizeContainer: false,
                        width:43,
                        height:20,
                        listeners: {
                            change: Ext.bind(this.doOnChange,this)
                        }
                    },{
                        xtype:"textfield",
                        id:'title_1',
                        name:'title_1',
                        width:205,
                        listeners:{
                            blur:Ext.bind(this.doOnTitleTextBlur,this)
                        }
                    },{
                        xtype:"checkbox",
                        id:'active_2',
                        name:'active_2',
                        style:"marginLeft:20px",
                        listeners:{
                            change: Ext.bind(this.doOnCheckChange,this)
                        },
                        /**
                         * @private
                         * Cancel selection if blur event has been fired before.
                         */
                        onBoxClick: function(){
                            var me = this
                            if (me.cancelCheck){
                                me.cancelCheck = false;
                                return
                            }
                            else{
                                if (!me.disabled && !me.readOnly) {
                                    this.setValue(!this.checked);
                                }
                            }

                        }
                    },{
                        xtype:"textfield",
                        id:'size_2',
                        //maskRe:/[0-9%]$/,
                        regex: new RegExp("^[-+]?[0-9]\\d{0,2}(\\.\\d{1,20})?%?$|^[-+]?[0-9]\\d{0,3}(\\.\\d{1,2})?$"),
                        width:53,
                        name:'size_2',
                        listeners: {
                            blur: Ext.bind(this.doOnSizeTextBlur,this),
                            focus: Ext.bind(this.doOnSizeTextFocus,this)
                        }
                    },{
                        xtype:"toggleslide",
                        id: "lock_2",
                        name: "lock_2",
                        onText: "<img src='guidesigner/resources/icons/fugue/icons/lock.png'/>",
                        offText: "<img src='guidesigner/resources/icons/fugue/icons/lock-unlock.png'/>",
                        disabled: true,
                        resizeContainer: false,
                        width:43,
                        height:20,
                        listeners: {
                            change: Ext.bind(this.doOnChange,this)
                        }
                    },{
                        xtype:"textfield",
                        id:'title_2',
                        name:'title_2',
                        width:205,
                        listeners:{
                            blur:Ext.bind(this.doOnTitleTextBlur,this)
                        }
                    },{
                        xtype:"checkbox",
                        id:'active_3',
                        name:'active_3',
                        style:"marginLeft:20px",
                        listeners:{
                            change: Ext.bind(this.doOnCheckChange,this)
                        },
                        onBoxClick: function(){
                            var me = this
                            if (me.cancelCheck){
                                me.cancelCheck = false;
                                return
                            }
                            else{
                                if (!me.disabled && !me.readOnly) {
                                    this.setValue(!this.checked);
                                }
                            }

                        }
                    },{
                        xtype:"textfield",
                        id:'size_3',
                        regex: new RegExp("^[0-9]\\d{0,2}(\\.\\d{1,20})?%?$|^[0-9]\\d{0,3}(\\.\\d{1,2})?$"),
                        width:53,
                        name:'size_3',
                        listeners: {
                            blur: Ext.bind(this.doOnSizeTextBlur,this),
                            focus: Ext.bind(this.doOnSizeTextFocus,this)
                        }
                    },{
                        xtype:"toggleslide",
                        id:'lock_3',
                        onText: "<img src='guidesigner/resources/icons/fugue/icons/lock.png'/>",
                        offText: "<img src='guidesigner/resources/icons/fugue/icons/lock-unlock.png'/>",
                        disabled: true,
                        resizeContainer: false,
                        width:43,
                        height:20,
                        listeners: {
                            change: Ext.bind(this.doOnChange,this)
                        }
                    },{
                        xtype:"textfield",
                        id:'title_3',
                        name:'title_3',
                        width:205,
                        listeners:{
                            blur:Ext.bind(this.doOnTitleTextBlur,this)
                        }
                    },{
                        xtype:"checkbox",
                        id:'active_4',
                        name:'active_4',
                        style:"marginLeft:20px",
                        listeners:{
                            change: Ext.bind(this.doOnCheckChange,this)
                        },
                        onBoxClick: function(){
                            var me = this
                            if (me.cancelCheck){
                                me.cancelCheck = false;
                                return
                            }
                            else{
                                if (!me.disabled && !me.readOnly) {
                                    this.setValue(!this.checked);
                                }
                            }

                        }
                    },{
                        xtype:"textfield",
                        id:'size_4',
                        regex: new RegExp("^[0-9]\\d{0,2}(\\.\\d{1,20})?%?$|^[0-9]\\d{0,3}(\\.\\d{1,2})?$"),
                        width:53,
                        name:'size_4',
                        listeners: {
                            blur: Ext.bind(this.doOnSizeTextBlur,this),
                            focus: Ext.bind(this.doOnSizeTextFocus,this)
                        }
                    },{
                        xtype:"toggleslide",
                        id:'lock_4',
                        name:'lock_4',
                        onText: "<img src='guidesigner/resources/icons/fugue/icons/lock.png'/>",
                        offText: "<img src='guidesigner/resources/icons/fugue/icons/lock-unlock.png'/>",
                        disabled: true,
                        resizeContainer: false,
                        width:43,
                        height:20,
                        listeners: {
                            change: Ext.bind(this.doOnChange,this)
                        }
                    },{
                        xtype:"textfield",
                        id:'title_4',
                        name:'title_4',
                        width:205,
                        listeners:{
                            blur:Ext.bind(this.doOnTitleTextBlur,this)
                        }
                    },{
                        xtype:"checkbox",
                        id:'active_5',
                        name:'active_5',
                        style:"marginLeft:20px",
                        listeners:{
                            change: Ext.bind(this.doOnCheckChange,this)
                        },
                        onBoxClick: function(){
                            var me = this
                            if (me.cancelCheck){
                                me.cancelCheck = false;
                                return
                            }
                            else{
                                if (!me.disabled && !me.readOnly) {
                                    this.setValue(!this.checked);
                                }
                            }

                        }
                    },{
                        xtype:"textfield",
                        id:'size_5',
                        regex: new RegExp("^[0-9]\\d{0,2}(\\.\\d{1,20})?%?$|^[0-9]\\d{0,3}(\\.\\d{1,2})?$"),
                        width:53,
                        name:'size_5',
                        listeners: {
                            blur: Ext.bind(this.doOnSizeTextBlur,this),
                            focus: Ext.bind(this.doOnSizeTextFocus,this)
                        }
                    },{
                        xtype:"toggleslide",
                        id:'lock_5',
                        onText: "<img src='guidesigner/resources/icons/fugue/icons/lock.png'/>",
                        offText: "<img src='guidesigner/resources/icons/fugue/icons/lock-unlock.png'/>",
                        disabled: true,
                        resizeContainer: false,
                        width:43,
                        height:20,
                        listeners: {
                            change: Ext.bind(this.doOnChange,this)
                        }
                    },{
                        xtype:"textfield",
                        id:'title_5',
                        name:'title_5',
                        width:205,
                        listeners:{
                            blur:Ext.bind(this.doOnTitleTextBlur,this)
                        }
                    },{
                        xtype:"checkbox",
                        id:'active_6',
                        name:'active_6',
                        style:"marginLeft:20px",
                        listeners:{
                            change: Ext.bind(this.doOnCheckChange,this)
                        },
                        onBoxClick: function(){
                            var me = this
                            if (me.cancelCheck){
                                me.cancelCheck = false;
                                return
                            }
                            else{
                                if (!me.disabled && !me.readOnly) {
                                    this.setValue(!this.checked);
                                }
                            }

                        }
                    },{
                        xtype:"textfield",
                        id:'size_6',
                        regex: new RegExp("^[0-9]\\d{0,2}(\\.\\d{1,20})?%?$|^[0-9]\\d{0,3}(\\.\\d{1,2})?$"),
                        width:53,
                        name:'size_6',
                        listeners: {
                            blur: Ext.bind(this.doOnSizeTextBlur,this),
                            focus: Ext.bind(this.doOnSizeTextFocus,this)
                        }
                    },{
                        xtype:"toggleslide",
                        id:'lock_6',
                        onText: "<img src='guidesigner/resources/icons/fugue/icons/lock.png'/>",
                        offText: "<img src='guidesigner/resources/icons/fugue/icons/lock-unlock.png'/>",
                        disabled: true,
                        resizeContainer: false,
                        width:43,
                        height:20,
                        listeners: {
                            change: Ext.bind(this.doOnChange,this)
                        }
                    },{
                        xtype:"textfield",
                        id:'title_6',
                        name:'title_6',
                        width:205,
                        listeners:{
                            blur:Ext.bind(this.doOnTitleTextBlur,this)
                        }
                    }]
                },{
                    frame:true,
                    html:"* Size : can be a percentage of total width (i.e. 33%),"+
                        "a fixed with (i.e. 120), or empty (autosize)<br/>"+
                        "** Title : not set if empty"
                }]
            }],
            buttons:[{
                text:'Ok',
                scope:me,
                /**
                 * @private
                 * fired when click occurred in button `OK`
                 * verify that all the required fields was entered and set its configuration to the designer.
                 */
                handler:function() {
                    console.log('btnOK');
                    var form = this.items.first().form, resp = null;
                    if (!form.isValid()){
                        Ext.Msg.alert("Alert","One or more fields are invalid, please check your values.")
                        return;
                    }
                    var values = this.items.first().form.getValues();
                    var widthSum = 0, zeroField = null, pos = -1;;
                    if (!me.myLayout){
                        var config = {xtype: "customlayoutcolumn",items:[]};
                        Ext.each([1,2,3,4,5,6], function(r) {
                            if (values['active_'+r] || r == 1) {
                                var item = {xtype:'custompanel',title:values['title_'+r]||null};
                                var toggle = Ext.getCmp("lock_" + r);
                                if (toggle.state)
                                    item.lock = true;
                                var widthVal = values['size_'+r];
                                var width = parseFloat(widthVal);
                                if (width==0){
                                    zeroField = 'size_'+r
                                    return false;
                                }
                                if (!isNaN(width)) {
                                    if (widthVal[widthVal.length-1] == '%') {
                                        item.columnWidth = width/100;
                                        widthSum += width;
                                    } else {
                                        if (values['size_'+r] != "")
                                            item.width = width;
                                    }
                                }
                                config.items.push(item);
                            }
                        });
                        resp = {"pos": config.items.length, "zeroField": zeroField, "widthSum": widthSum}
                    }else{
                        //var pos = -1;
                        var config = {xtype: "customlayoutcolumn",items:[]};
                        //this.setNewConfig(me,values,zeroField,pos,widthSum,me.myLayout);
                        resp = this.setNewConfig(me,values,config);
                        if (config.items.length>resp.pos){
                            config.items.splice(resp.pos+1,config.items.length-(resp.pos+1));
                        }
                    }

                    if (resp.zeroField){
                        Ext.Msg.alert("Alert","Percentage values must be greater than zero",function(){
                            Ext.getCmp(resp.zeroField).focus(true,150);
                        },me);
                        return;
                    }
                    if (resp.widthSum>0 && resp.widthSum.toPrecision(15)!=100){
                        Ext.Msg.alert("Alert","Percentage values must add up to 100")
                        return;
                    }

                    this.fireEvent("confirmchange");
                    if(me.myLayout){
                        //pos = -1, widthSum = 0, zeroField = null;
                        resp = this.setNewConfig(me,values,me.myLayout);
                        if (me.myLayout.items.length>resp.pos){
                            me.myLayout.items.splice(resp.pos+1,me.myLayout.items.length-(resp.pos+1));
                        }
                        me.callback.call(this,me.myLayout.items)
                    }else{
                        me.callback.call(this, config);
                    }
                    this.close();
                }
            },{
                text:'Cancel',
                scope:me,
                /**
                 * @private
                 * fired when click occurred in button `Cancel`.
                 */
                handler:function() {this.close();}
            }]
        });
        me.callParent(arguments);
    },
    /**
     * apply new configuration to designer.
     * @param {Ext.Component} me this window.
     * @param values configuration array which specifies if column is active in new configuration.
     * @param config original layout column configuration array
     * @returns {{pos: number, zeroField: null, widthSum: number}} number of positions used in the new configuration.
     */
    setNewConfig:function(me,values,config){
        var pos = -1, zeroField = null, widthSum = 0;
        Ext.each([1,2,3,4,5,6],function(r){
            var widthVal = values['size_'+r];
            var width = parseFloat(widthVal);

            if (values['active_'+r] || r==1){
                if (width==0){
                    zeroField = 'size_'+r
                    return false;
                }
                pos +=1;
                var toggle = Ext.getCmp("lock_" + r);
                if(config.items[pos]){
                    config.items[pos].title = values['title_'+r]||null;
                    config.items[pos].lock = toggle.state || null;
                    if (!isNaN(width)) {
                        if (widthVal[widthVal.length-1] == '%') {
                            config.items[pos].columnWidth = width/100;
                            widthSum += width;
                            config.items[pos].width = null
                        } else {
                            if (values['size_'+r] != ""){
                                config.items[pos].width = width;
                                config.items[pos].columnWidth = null
                            }

                        }
                    }
                }else{
                    if (!isNaN(width)) {
                        if (widthVal[widthVal.length-1] == '%') {
                            config.items.push({
                                xtype:'custompanel',
                                title:values['title_'+r]||null,
                                lock: toggle.state || null,
                                columnWidth: width/100
                            })
                            widthSum += width;
                        } else {
                            if (values['size_'+r] != ""){
                                config.items.push({
                                    xtype:'custompanel',
                                    title:values['title_'+r]||null,
                                    lock: toggle.state || null,
                                    width: width
                                });
                            }
                        }
                    }
                }
            }
        });
        return {"pos": pos, "zeroField": zeroField, "widthSum": widthSum};
    },
    /**
     * @private
     * update column sizes depending on `toggle` state.
     * @param {Ext.Component} toggle component.
     * @param {Ext.Component} state current `toggle`.
     */
    doOnChange: function (toggle, state) {
        console.log("doOnChange");
        var txtSize = Ext.getCmp("size_" + toggle.id.toString().substring(5));
        if (txtSize.value){
            if (txtSize.value.toString().indexOf("%") != -1){
                this.fillLockedArray(toggle);
                txtSize.locked = true;
            }
           /* else{
                if (!toggle.state){
                    this.fillLockedArray(toggle,true);
                    toggle.disable();
                    txtSize.locked = false;
                }
            }*/
        }
    },
    /**
     * @private
     * update column sizes `toggle` state and check corresponding `checkbox`
     * @param {Ext.Component} me textbox.
     */
    doOnSizeTextBlur: function(me){
        if (!me.isValid()){
            return me.focus(true);
        }
        console.log('textfield blur');
        var chk = Ext.getCmp("active_" + me.name.toString().substring(5));
        if (me.value){
            if (me.value.indexOf("%")!= -1){
                if (parseFloat(me.value.substring(0,me.value.length-1))>100){
                    Ext.Msg.alert('Alert', 'values can´t be greater than 100%');
                    me.setValue(me.oldValue);
                    me.focus();
                    return;
                }
            }
        }else{
            if (chk.checked)
                //me.setValue(this.getColumnSize(false));
                me.setValue(me.oldValue);
            else
            return;
        }

        var toggle = Ext.getCmp("lock_" + me.name.toString().substring(5));
        if (me.value){
            this.setCheckBox(me,'title_');
            if (me.value.toString().indexOf("%") != -1){
                if (me.value != me.oldValue){
                    if (me.value.indexOf('%') != -1){
                        if (me.oldValue){
                            if (me.oldValue.indexOf('%') == -1)
                                this.getColumnSize(true,me);
                            else
                                this.getColumnSize(false,me);
                        }else
                            this.getColumnSize(true,me);
                    }
                    else
                        this.getColumnSize(false,me);
                    if (!toggle.state){
                        toggle.toggle();
                        toggle.enable();
                    }
                }else{
                    if (me.isFirstValue){
                        if (!toggle.state){
                            toggle.toggle();
                            toggle.enable();
                            me.isFirstValue = false;
                        }
                    }
                }
                this.fillLockedArray(toggle);
                /*if (toggle.state)
                    this.fillLockedArray(toggle);*/
            }else{
                this.fillLockedArray(toggle,true);
                this.getColumnSize(false);
            }
        }else{
            if (toggle.state){
                this.fillLockedArray(toggle,true);
            }else{
                toggle.disable();
                this.fillLockedArray(toggle);
            }
        }
        //this.setCheckBox(me,'title_');
    },
    /**
     * @private
     * stores `textbox` old value.
     * @param {Ext.Component} me textbox.
     */
    doOnSizeTextFocus: function(me){
        me.oldValue = me.value;
    },
    /**
     * @private
     * update locked and unlocked columns array
     * @param {Ext.Component} toggle corresponding `toggle`
     * @param {boolean} remove specify if needs to remove item from this array
     */
    fillLockedArray: function(toggle,remove){
        var frm = Ext.getCmp("frmConfigColumn");
        var txtSize = Ext.getCmp("size_"+toggle.id.toString().substring(5));
        var pos;
        if (toggle.state || toggle.temporalState){
            if (!frm.locked){
                frm.locked = [];
                frm.locked.push({"id": toggle.id,"state":toggle.state});
                this.fillUnLockedArray(frm,toggle,true);
            }else{
                pos = this.searchLocked(frm,toggle);
                if (pos == -1){
                    if (txtSize.value){
                        if (txtSize.value.indexOf("%")!=-1){
                            frm.locked.push({id: toggle.id,state:toggle.state});
                            this.fillUnLockedArray(frm,toggle,true);
                        }else{
                            if (remove){
                                this.updateLocked(frm,toggle,pos);
                            }
                        }
                    }
                }
                else{
                    if (remove){
                        this.updateLocked(frm,toggle,pos);
                    }
                }
            }
        }else{
            if (frm.locked.length){
                pos = this.searchLocked(frm,toggle);
                if (pos != -1)
                    frm.locked.splice(pos,1);
            }
            var chk = Ext.getCmp("active_" + toggle.id.substring(5))
            if (chk.checked)
                this.fillUnLockedArray(frm,toggle);
            else
                this.fillUnLockedArray(frm,toggle,true);

            if (remove)
                toggle.disable();
        }
    },
    /**
     * @private
     * update locked columns array
     * @param {Ext.Component} frm the `form`
     * @param {Ext.Component} toggle corresponding `toggle`
     * @param {number} pos the item position to delete
     */
    updateLocked:function(frm,toggle,pos){
        frm.locked.splice(pos,1);
        this.fillUnLockedArray(frm,toggle);
        toggle.disable();
        toggle.toggle();
    },
    /**
     * @private
     * update unlocked columns array.
     * @param {Ext.Component} frm the `form`
     * @param {Ext.Component} toggle corresponding `toggle`
     * @param {boolean} remove specify if needs to remove this item
     */
    fillUnLockedArray:function(frm,toggle,remove){
        var pos;
        var txtSize = Ext.getCmp("size_" + toggle.id.substring(5))
        if (!frm.unLocked){
            frm.unLocked.push({"id": toggle.id,"state":toggle.state});
        }else{
            pos = this.searchUnLocked(frm,toggle);
            var chk = Ext.getCmp("active_" + toggle.id.substring(5))
            if (pos == -1 && txtSize.value && txtSize.value.indexOf("%") != -1 && chk.checked){
                if (txtSize.oldValue){
                    if (txtSize.oldValue.indexOf('%')!=-1){
                        frm.unLocked.push({id: toggle.id,state:toggle.state});
                        toggle.enable();
                    }
                }else{
                    toggle.enable();
                    if (!txtSize.isFirstValue)
                        frm.unLocked.push({id: toggle.id,state:toggle.state});
                }

                /*frm.unLocked.push({id: toggle.id,state:toggle.state});
                toggle.enable();*/
            }else{
                    if (remove && pos != -1){
                        frm.unLocked.splice(pos,1);
//                        toggle.disable();
//                        toggle.toggle();
                    }else{
                        if (txtSize.value.indexOf("%") == -1 && pos != -1)
                            frm.unLocked.splice(pos,1);
                    }
                }
        }
    },
    /**
     * @private
     * Search item in locked array.
     * @param {Ext.Component} frm the `form`
     * @param {Ext.Component} toggle corresponding `toggle`
     * @returns {number} item index
     */
    searchLocked: function(frm,toggle){
        var pos = -1
        for (x in frm.locked){
            if (frm.locked.hasOwnProperty(x)) {
                if (frm.locked[x].id == toggle.id)
                    pos=x;
            }
        }
        return pos;
    },
    /**
     * @private
     * Search item in unlocked array.
     * @param {Ext.Component} frm the `form`.
     * @param {Ext.Component} toggle corresponding `toggle`.
     * @returns {number} item index.
     */
    searchUnLocked: function(frm,toggle){
        var pos = -1
        for (x in frm.unLocked){
            if (frm.unLocked.hasOwnProperty(x)) {
                if (frm.unLocked[x].id == toggle.id)
                    pos=x;
            }
        }
        return pos;
    },
    /**
     * @private
     * update checkbox state.
     * @param {Ext.Component} txt corresponding `textbox`.
     * @param {string} prefix `textbox` prefix to validate data.
     */
    setCheckBox: function(txt,prefix){
        var checkbox = Ext.getCmp("active_"+ txt.name.toString().substring(txt.name.toString().length == 6 ? 5 : 6));
        var textToValidate = Ext.getCmp(prefix + txt.name.toString().substring(prefix.toString().length == 6 ? 5 : 6));
        if (!txt.oldValue){
            /*var toggle = Ext.getCmp("lock_" + txt.name.toString().substring(txt.name.toString().length == 6 ? 5 : 6));
            toggle.enable();
            toggle.toggle();*/
            txt.isFirstValue = true;
        }
        if (Ext.String.trim(txt.value ? txt.value : "") != "" || Ext.String.trim(textToValidate.value ? textToValidate.value : "") != ""){
            checkbox.autoGenerated = true;
            checkbox.setValue(true);
        }
        else{
            checkbox.autoGenerated = false;
            checkbox.setValue(false);
        }
    },
    /**
     * @private
     * update column sizes depending on checkbox state.
     * @param {Ext.Component} me the `checkbox`
     */
    doOnCheckChange: function(me){
        if (!me.reConfiguration){
            console.log("doOnCheckChange");
            var n = me.name.toString().substring(7);
            var txtSize = Ext.getCmp("size_" + n);
            var txtTitle = Ext.getCmp("title_" + n);
            var toggle = Ext.getCmp("lock_" + n);

            if (!me.cancelCheck){
                if (me.checked){
                    //if (!txtSize.value){
                    if(!me.autoGenerated){
                        txtSize.setValue(this.getColumnSize(true));
                        this.fillLockedArray(toggle);
                        txtSize.focus(true);
                    }else{
                        me.cancelCheck = true;
                    }
                    //}
                    //toggle.enable();
                }else{
                    /*txtSize.setValue("");
                     txtTitle.setValue("");*/
                    if (toggle.state){
                        toggle.disable();
                        toggle.toggle();
                    }
                    if (txtSize.isFirstValue)
                        txtSize.isFirstValue = null;
                    me.autoGenerated = false;
                    this.fillLockedArray(toggle,true);
                    this.getColumnSize(false)
                }
            }
        }
    },
    /**
     * gets the corresponding column size
     * @param {boolean} add specify if its an add operation
     * @param {Ext.Component} txtSize
     * @returns {string} size value
     */
    getColumnSize: function(add,txtSize){
        console.log("getColumnSize");
        var frm = Ext.getCmp("frmConfigColumn");

        var totalRelativeSize = this.getTotalRelativeSizes();
        var totalLocked = 0, totalUnLocked = 0, divideTotal = 0, percentage = 0.0;

        //totalUnLocked = frm.unLocked.length + (totalRelativeSize[0].totalSizeBlocked != 1 ?(add ? 1 : 0):0) - (txtSize ? 1:0) ;

        if (txtSize){
            var toggle = Ext.getCmp("lock_" + txtSize.name.toString().substring(5));
            totalUnLocked = frm.unLocked.length + (totalRelativeSize[0].totalSizeBlocked != 1 ?(add ? 1 : 0):0) - (txtSize ? (toggle.state) ? 0: 1 : 0)
            percentage = (1 - (totalRelativeSize[0].totalSizeBlocked + ((!toggle.state) ? (txtSize ? txtSize.value.substring(0,txtSize.value.length -1)/100 : 0):0)))*100
            if (toggle.state || (txtSize.value.indexOf('%')!=-1 && (typeof txtSize.oldValue !== "undefined" && txtSize.oldValue.indexOf('%')==-1))){
                toggle.temporalState = true;
                this.fillLockedArray(toggle,true);
                toggle.temporalState = null;
            }
        }else{
            totalUnLocked = frm.unLocked.length + (totalRelativeSize[0].totalSizeBlocked != 1 ?(add ? 1 : 0):0) - (txtSize ? 1:0) ;
            percentage = ((1 - totalRelativeSize[0].totalSizeBlocked).toPrecision(15))*100
        }
        //totalUnLocked = frm.unLocked.length + (totalRelativeSize[0].totalSizeBlocked != 1 ?(add ? 1 : 0):0) - (!frm.locked.length && totalRelativeSize[0].totalSizeBlocked > 0 ? 0 : (txtSize ? 1:0)) ;

        //percentage = (1 - (totalRelativeSize[0].totalSizeBlocked + (txtSize ? txtSize.value.substring(0,txtSize.value.length -1)/100 : 0)))*100
        //percentage = (1 - totalRelativeSize[0].totalSizeBlocked)*100
        if (totalUnLocked>0){
            var txtValue =(percentage/totalUnLocked)
            if (txtValue>=0){
                this.updateSizes(txtValue.toString()+"%",txtSize);
                return txtValue.toString()+"%";
            }else
                return "100";
        }else
            return "100";

    },
    /**
     * @private
     * set checkbox value when text value has changed
     * @param {Ext.Component} me
     */
    doOnTitleTextBlur: function(me){
        this.setCheckBox(me,'size_');
    },
    /**
     * @private
     * update window with pre-configured values.
     */
    doAfterRender: function(){
        var me = this;
        if (me.myLayout){
            console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
            console.log(me.myLayout);
            var frm = Ext.getCmp("frmConfigColumn");
            frm.locked =[],frm.unLocked = [];
            for (var x = 0; x<me.myLayout.items.length; x++){
                var itemCfg = me.myLayout.items[x];
                var chk = Ext.getCmp("active_"+(x+1));
                var txtSize = Ext.getCmp("size_"+(x+1));
                var title = Ext.getCmp("title_" + (x+1));
                var isPercentage =false;
                if (itemCfg.columnWidth){
                    txtSize.setValue((itemCfg.columnWidth*100) + "%")
                    isPercentage = true;
                }else
                    txtSize.setValue(itemCfg.width)
                if (itemCfg.title)
                    title.setValue(itemCfg.title)
                chk.reConfiguration=true;
                chk.setValue("true");
                chk.reConfiguration = false;
                var toggle = Ext.getCmp("lock_"+(x+1));
                if (itemCfg.lock){
                    toggle.toggle();
                    toggle.enable();
                    frm.locked.push({"id":"lock_"+(x+1),"state":true});
                }else{
                    if (isPercentage){
                        toggle.enable();
                        frm.unLocked.push({"id":"lock_"+(x+1),"state":false});
                    }
                }
            }
        }else{
            var size1 = Ext.getCmp("size_1");
            var toggle = Ext.getCmp("lock_1");
            var frm = Ext.getCmp("frmConfigColumn");
            size1.setValue("100%");
            toggle.enable();
            size1.focus(true,150);
            frm.unLocked = [{"id":"lock_1","state":false}];
            frm.locked = [];
        }
    },
    /**
     * gets actual size used between all relative textbox
     * @returns {Array} return total size blocked and unblocked.
     */
    getTotalRelativeSizes: function(){
        var arrSize = [], totalSize = 0.0, totalSizeBlocked = 0.0, totalSizeUnBlocked = 0.0;
        Ext.each([1,2,3,4,5,6],function(n){
            var chk = Ext.getCmp("active_"+n);
            if (chk.checked){
                var txtSize = Ext.getCmp("size_"+n),
                    toggle = Ext.getCmp("lock_"+n);
                var widthVal = txtSize.value ? txtSize.value : 0;
                var width = parseFloat(widthVal);
                if (!isNaN(width)){
                    if (widthVal[widthVal.length-1] == '%') {
                        if (toggle.state)
                            totalSizeBlocked += width/100;
                        else{
                            totalSizeUnBlocked += width/100;
                        }
                        totalSize += width/100;
                    }
                }
            }
        });
        arrSize.push({"totalSize":totalSize, "totalSizeBlocked": totalSizeBlocked, "totalSizeUnBlocked": totalSizeUnBlocked});
        return arrSize;
    },
    /**
     * update unblocked column sizes in textbox
     * @param {string} value the size value.
     * @param {Ext.Component} changedText current changed textbox
     */
    updateSizes:function(value,changedText){
        var frm = Ext.getCmp("frmConfigColumn");
        if (frm.unLocked.length){
            for (var item = 0; item<frm.unLocked.length; item ++){
                var txtSize = Ext.getCmp("size_" + frm.unLocked[item].id.substring(5));
                var toggle = Ext.getCmp("lock_" + frm.unLocked[item].id.substring(5));
                if (changedText){
                    if (changedText.id != txtSize.id){
                        if (value=="0%"){
                            txtSize.setValue("100");
                            toggle.disable();
                        }else
                            txtSize.setValue(value);
                    }
                }else
                    txtSize.setValue(value);
            }
        }
    }
})
