/**
 * Layout border initial configuration.
 */
Ext.define('Ext.ux.widget.config.layout.Border', {
    extend: 'Ext.window.Window',
    title: 'Layout border configuration',
    //alias: 'widget.borderConfig',
    width: 550,
    height: 400,
    layout: 'fit',
    modal: true,

    initComponent: function(){
        var me = this;
        me.addEvents(
            /**
             * @event fired to mark `undo`.
             */
            "confirmchange"
        );
        Ext.applyIf(me,{
            listeners: {
                afterrender: me.doAfterRender
            },
            items: [
                {
                    xtype: "form",
                    autoScroll: true,
                    frame: true,
                    defaults: {
                        style: "margin:10px"
                    },
                    items: [
                        {
                            xtype: "fieldset",
                            title: "Center",
                            id: "MPAChkRegioncenter",
                            autoHeight: true,
                            items: [
                                {
                                    xtype: "textfield",
                                    id: "MPATitlecenter",
                                    fieldLabel: "Title",
                                    name: "title_center",
                                    width: 299
                                }
                            ]
                        },
                        {
                            xtype: "fieldset",
                            title: "Add north region",
                            id: "MPAChkRegionnorth",
                            autoHeight: true,
                            checkboxToggle: true,
                            region: 'north',
                            collapsed: true,
                            checkboxName: "active_north",
                            createCheckboxCmp: this.doCreateCheckboxCmp,
                            items: [
                                {
                                    xtype: "textfield",
                                    id: "MPATitlenorth",
                                    fieldLabel: "Title",
                                    name: "title_north",
                                    width: 299
                                },
                                {
                                    layout: "table",
                                    items: [
                                        {
                                            layout: "form",
                                            items: [
                                                {
                                                    xtype: "numberfield",
                                                    id: 'MPASizenorth',
                                                    fieldLabel: "Height (px)",
                                                    name: "size_north",
                                                    allowDecimals: false,
                                                    allowNegative: false,
                                                    width: 66
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:'MPASplitnorth',
                                                    name: "split_north",
                                                    boxLabel: "Split"
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:"MPACollapsiblenorth",
                                                    name: "collapsible_north",
                                                    boxLabel: "Collapsible"
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:"MPATitleCollapsenorth",
                                                    name: "titleCollapse_north",
                                                    boxLabel: "TitleCollapse"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            onCheckChange: this.doOnCheckChange
                        },
                        {
                            xtype: "fieldset",
                            title: "Add south region",
                            id: "MPAChkRegionsouth",
                            autoHeight: true,
                            checkboxToggle: true,
                            region: 'south',
                            collapsed: true,
                            checkboxName: "active_south",
                            createCheckboxCmp: this.doCreateCheckboxCmp,
                            items: [
                                {
                                    xtype: "textfield",
                                    id: "MPATitlesouth",
                                    fieldLabel: "Title",
                                    name: "title_south",
                                    width: 299
                                },
                                {
                                    layout: "table",
                                    items: [
                                        {
                                            layout: "form",
                                            items: [
                                                {
                                                    xtype: "numberfield",
                                                    id:'MPASizesouth',
                                                    fieldLabel: "Height (px)",
                                                    name: "size_south",
                                                    allowDecimals: false,
                                                    allowNegative: false,
                                                    width: 66
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:"MPASplitsouth",
                                                    name: "split_south",
                                                    boxLabel: "Split"
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:'MPACollapsiblesouth',
                                                    name: "collapsible_south",
                                                    boxLabel: "Collapsible"
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id: "MPATitleCollapsesouth",
                                                    name: "titleCollapse_south",
                                                    boxLabel: "TitleCollapse"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ] ,
                            onCheckChange: this.doOnCheckChange
                        },
                        {
                            xtype: "fieldset",
                            title: "Add west region",
                            id: "MPAChkRegionwest",
                            autoHeight: true,
                            region: 'west',
                            checkboxToggle: true,
                            collapsed: true,
                            checkboxName: "active_west",
                            createCheckboxCmp: this.doCreateCheckboxCmp,
                            items: [
                                {
                                    xtype: "textfield",
                                    id: "MPATitlewest",
                                    fieldLabel: "Title",
                                    name: "title_west",
                                    width: 299
                                },
                                {
                                    layout: "table",
                                    items: [
                                        {
                                            layout: "form",
                                            items: [
                                                {
                                                    xtype: "numberfield",
                                                    id:'MPASizewest',
                                                    fieldLabel: "Width (px)",
                                                    name: "size_west",
                                                    allowDecimals: false,
                                                    allowNegative: false,
                                                    width: 66
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:"MPASplitwest",
                                                    name: "split_west",
                                                    boxLabel: "Split"
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:"MPACollapsiblewest",
                                                    name: "collapsible_west",
                                                    boxLabel: "Collapsible"
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:"MPATitleCollapsewest",
                                                    name: "titleCollapse_west",
                                                    boxLabel: "TitleCollapse"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            onCheckChange: this.doOnCheckChange
                        },
                        {
                            xtype: "fieldset",
                            title: "Add east region",
                            id: "MPAChkRegioneast",
                            autoHeight: true,
                            region: 'east',
                            checkboxToggle: true,
                            collapsed: true,
                            checkboxName: "active_east",
                            createCheckboxCmp: this.doCreateCheckboxCmp,
                            items: [
                                {
                                    xtype: "textfield",
                                    id: "MPATitleeast",
                                    fieldLabel: "Title",
                                    name: "title_east",
                                    width: 299
                                },
                                {
                                    layout: "table",
                                    items: [
                                        {
                                            layout: "form",
                                            items: [
                                                {
                                                    xtype: "numberfield",
                                                    id:'MPASizeeast',
                                                    fieldLabel: "Width (px)",
                                                    name: "size_east",
                                                    allowDecimals: false,
                                                    allowNegative: false,
                                                    width: 66
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:"MPASpliteast",
                                                    name: "split_east",
                                                    boxLabel: "Split"
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:"MPACollapsibleeast",
                                                    name: "collapsible_east",
                                                    boxLabel: "Collapsible"
                                                }
                                            ]
                                        },
                                        {
                                            layout: "form",
                                            hideLabels: true,
                                            style: "margin-left:10px",
                                            items: [
                                                {
                                                    xtype: "checkbox",
                                                    id:"MPATitleCollapseeast",
                                                    name: "titleCollapse_east",
                                                    boxLabel: "TitleCollapse"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            onCheckChange: this.doOnCheckChange
                        }
                    ]
                }
            ],
            buttons:[{
                text:'Ok',
                scope:me,
                /**
                 * sets the configuration to layout.
                 * @private
                 */
                handler:function() {
                    var form = this.items.first().form;
                    if (form.isValid()){
                        if (!me.myLayout){
                            var values = this.items.first().form.getValues();
                            this.close();
                            var config = {xtype: 'customlayoutborder',height:250,layout:'border',items:[]};
                            config.items.push({region:'center', border: false,xtype: 'custompanel',title:values.title_center||null,cls: 'blockDDRegion'});
                            Ext.each(['north','south','west','east'], function(r) {
                                if (values['active_'+r]) {
                                    config.items.push({
                                        xtype: 'custompanel',
                                        region        : r,
                                        title         : values['title_'+r]||null,
                                        width         : parseInt(values['size_'+r], 10)||null,
                                        height        : parseInt(values['size_'+r], 10)||null,
                                        split         : (values['split_'+r]?true:null),
                                        collapsible   : (values['collapsible_'+r]?true:null),
                                        titleCollapse : (values['titleCollapse_'+r]?true:null),
                                        cls: 'blockDDRegion'
                                    });
                                }
                            });
                            me.callback.call(this, config);
                        }else {
                            this.fireEvent("confirmchange");
                            var values = this.items.first().form.getValues();
                            this.close();
                            var existInArray, itemPos;
                            me.myLayout.items[0].title = values.title_center;
                            Ext.each(['north','south','west','east'], function(r) {
                                existInArray = false;
                                itemPos = -1;
                                for (item in me.myLayout.items){
                                    itemPos +=1;
                                    if (me.myLayout.items[item].region == r){
                                        existInArray = true;
                                        break;
                                    }
                                }
                                if (values['active_'+r]) {
                                    if (!existInArray){
                                        me.myLayout.items.push({
                                            xtype: 'custompanel',
                                            region        : r,
                                            __JSON__      : Ext.id(),
                                            title         : values['title_'+r]||null,
                                            width         : parseInt(values['size_'+r], 10)||null,
                                            height        : parseInt(values['size_'+r], 10)||null,
                                            split         : (values['split_'+r]?true:null),
                                            collapsible   : (values['collapsible_'+r]?true:null),
                                            titleCollapse : (values['titleCollapse_'+r]?true:null),
                                            cls: 'blockDDRegion'
                                        });
                                    }else{
                                        me.myLayout.items[itemPos].title = values['title_'+r]||null;
                                        me.myLayout.items[itemPos].width = parseInt(values['size_'+r], 10)||null;
                                        me.myLayout.items[itemPos].height =  parseInt(values['size_'+r], 10)||null;
                                        me.myLayout.items[itemPos].split = (values['split_'+r]?true:null);
                                        me.myLayout.items[itemPos].collapsible = (values['collapsible_'+r]?true:null);
                                        me.myLayout.items[itemPos].titleCollapse = (values['titleCollapse_'+r]?true:null);

                                    }
                                }else{
                                    if (existInArray){
                                        me.myLayout.items.splice(itemPos,1)
                                    }
                                }
                            });
                            me.callback.call(this,me.myLayout.initialConfig);
                        }
                    }

                }
            },{
                text:'Cancel',
                scope:me,
                /**
                 * close configuration window
                 * @private
                 */
                handler:function() {this.close();}
            }]
        });

        me.callParent(arguments);
    },
    /**
     * fired when layout was already configurated.
     * this method sets actual values to configuration window.
     * @private
     */
    doAfterRender:function(){
            var me = this
            if (me.myLayout){
                for (var x = 0; x<me.myLayout.items.length; x++){
                    var itemCfg = me.myLayout.items[x];
                    var region = itemCfg.region;

                    Ext.getCmp("MPATitle"+region).setValue(itemCfg.title);
                    if (region != 'center'){
                        Ext.getCmp("MPAChkRegion"+region).checkboxCmp.setValue(true);

                        if (region == 'north' || region == 'south')
                            Ext.getCmp("MPASize"+region).setValue(itemCfg.height);
                        else
                            Ext.getCmp("MPASize"+region).setValue(itemCfg.width);

                        if (itemCfg.split)
                            Ext.getCmp("MPASplit"+region).setValue(true);
                        if (itemCfg.collapsible)
                            Ext.getCmp("MPACollapsible"+region).setValue(true);
                        if (itemCfg.titleCollapse)
                            Ext.getCmp("MPATitleCollapse"+region).setValue(true);
                    }

                }
            }

    },
    /**
     * set `allowBlank` property to textfield depending on the actual value of the window
     * @param cmp selected component `FieldSet`
     * @param checked checkbox value
     * @private
     */
    doOnCheckChange: function(cmp,checked ){
        var region = cmp.region;
        if (region != "center"){
            this.setExpanded(checked);
            Ext.getCmp("MPASize"+region).allowBlank = !checked;
        }
    },
    /**
     * creates fieldset header checkbox
     * @returns {object} checkbox
     * @private
     */
    doCreateCheckboxCmp: function(){
        var me = this,
            suffix = '-checkbox';

        me.checkboxCmp = Ext.widget({
            xtype: 'checkbox',
            hideEmptyLabel: true,
            name: me.checkboxName || me.id + suffix,
            cls: me.baseCls + '-header' + suffix,
            id: me.id + '-legendChk',
            checked: !me.collapsed,
            listeners: {
                change: me.onCheckChange,
                scope: me
            }
        });
        me.checkboxCmp.region  = this.region
        return me.checkboxCmp;
    }
});