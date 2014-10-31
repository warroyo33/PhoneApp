Ext.define('Ext.ux.widget.config.layout.NewColumn',{
    extend: 'Ext.window.Window',
    title: 'Layout column configuration',
    //alias: 'widget.newColumnConfig',
    requires:['Ext.ux.toggleslide.ToggleSlide'],
    width: 500,
    height: 350,
    plain:true,
    layout:'fit',
    initComponent:function(){
        var me=this;
        Ext.define('columnLayoutModel',{
            extend:'Ext.data.Model',
            fields:['id','size',{
                name: 'size_object',
                convert: function(newValue, model) {
                    var id = model.get('storeId')|| Ext.id(null,"MPAConnection-");
                    // //model.set('name',model.get('name')||id);

                    var sizeObject = Ext.create('Ext.form.field.Text', {
                        //renderTo: id,
                        //text: model.get('size'),
                        id: Ext.id(),
                        width: 75,
                        regex: new RegExp("^[0-9]\\d{0,2}(\\.\\d{1,20})?%?$|^[0-9]\\d{0,3}(\\.\\d{1,2})?$"),
                        listeners: {
                            'blur': function(){
                                model.set('size',sizeObject.getValue());
                            },
                            'afterrender': function(){
                                console.log('afterRender');
                                sizeObject.setValue(model.get('size'));
                            }
                        }

                    });
                    return sizeObject;
                }

            }, {
                name:'lock',
                type:'boolean'
            },{
                name: 'lock_object',
                convert: function(newValue, model) {
                    var id = model.get('storeId')|| Ext.id(null,"MPAConnection-");
                    // //model.set('name',model.get('name')||id);

                    var lockObject=Ext.create('Ext.ux.toggleslide.ToggleSlide', {
                        //renderTo: id,
                        state:model.get('lock'),
                        onText: "<img src='guidesigner/resources/icons/fugue/icons/lock.png'/>",
                        offText: "<img src='guidesigner/resources/icons/fugue/icons/lock-unlock.png'/>",
                        resizeContainer: false,
                        width:43,
                        height:20,
                        listeners: {
                            change: function(){
                                model.set('lock',lockObject.state);
                            }
                        }
                    });
                    var sizeObject= model.get('size_object')
                    sizeObject.on('blur',function(){
                        var sizeValue=sizeObject.getValue();
                        if (sizeValue.indexOf('%')>-1){
                            Ext.defer(function(){lockObject.enable();},125);
                            var numericSizeValue = sizeValue.substring(0,sizeValue.indexOf('%')-1)
                            if(isNaN(parseFloat(numericSizeValue))){
                                console.log('numero');
                                alert("test");
                            }else{
                                model.set('lock',true);
                            }
                        }
                        else{
                            console.log('isNumber');
                            lockObject.disable();
                        }
                    });
                    return lockObject;
                }

            },'title',{
                name: 'title_object',
                convert: function(newValue, model) {
                    var id = model.get('storeId')|| Ext.id(null,"MPAConnection-");
                    // //model.set('name',model.get('name')||id);

                    var titleObject = Ext.create('Ext.form.field.Text', {
                        //renderTo: id,
                        //text: model.get('size'),
                        id: Ext.id(),
                        width: 205,
                        listeners: {
                            'blur': function(){
                                model.set('title', titleObject.getValue())
                            },
                            'afterrender': function(){
                                console.log('afterRender');
                                titleObject.setValue(model.get('title'));
                            }
                        }

                    });
                    return titleObject;
                }

            }]
        })
        var myStore = Ext.create('Ext.data.Store', {
            storeId:'columnLayoutRowsStore',
            //autoLoad: false,
            //autoSync: false,
            model:'columnLayoutModel',
            //fields:['id','size','size_object', {name:'lock',type:'boolean', default: false},'lock_object', 'title','title_object'],
            data:{'items':[
                { 'id':1,'size':'100%','lock':false, title:'Column Title'}


            ]},
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'items'
                }
            }
        });


        Ext.applyIf(me,{
            items:[{
                xtype:"form",
                layout:'fit',
                border:false,
                id:"frmConfigColumn",
                items:[{
                    xtype: Ext.create('Ext.grid.Panel', {
                        store: myStore,
                        forceFit:true,
                        columns: [
                            { text: 'Size',  dataIndex: 'size', width:75,
                                renderer: function (value, metadata,record,rowIndex,colIndex,store) {
                                    var id = Ext.id();
                                    console.log(this);
                                    Ext.defer(function (value, metadata,record,rowIndex,colIndex,store) {
                                        if (Ext.getDom(id)){
                                            var sizeObject= record.get('size_object');
                                            sizeObject.setValue(record.get('size'));
                                            var containerObject= Ext.create('Ext.container.Container',{
                                                renderTo: id,
                                                height:20,
                                                width: 75,
                                                layout:'fit'
                                            });
                                            containerObject.add(sizeObject);
                                        }
                                    }, 50, this,[value, metadata,record,rowIndex,colIndex,store]);
                                    return Ext.String.format('<div id="{0}"></div>', id);
                                }

                            },
                            { text: 'Lock', dataIndex: 'lock', width:43,
                                renderer: function (value, metadata,record,rowIndex,colIndex,store) {
                                    var id = Ext.id();
                                    console.log(this);
                                    Ext.defer(function (value, metadata,record,rowIndex,colIndex,store) {
                                        if (Ext.getDom(id)){
                                            var lockObject=record.get('lock_object');
                                            var containerObject= Ext.create('Ext.container.Container',{
                                                renderTo: id,
                                                height:20,
                                                width: 43,
                                                layout:'fit'
                                            });
                                            containerObject.add(lockObject);
                                            lockObject.state= record.get('lock');
                                            lockObject.moveHandle(record.get('lock'));
                                        }
                                    }, 100,this,[value, metadata,record,rowIndex,colIndex,store]);
                                    return Ext.String.format('<div id="{0}"></div>', id);
                                }
                            },
                            { text: 'Title',  dataIndex: 'title', width:220,
                                renderer: function (value, metadata,record,rowIndex,colIndex,store) {
                                    var id = Ext.id();
                                    console.log(this);
                                    Ext.defer(function (value, metadata,record,rowIndex,colIndex,store) {
                                        if (Ext.getDom(id)){
                                            var titleObject= record.get('title_object');
                                            var containerObject= Ext.create('Ext.container.Container',{
                                                renderTo: id,
                                                height:20,
                                                width: 265,
                                                layout:'fit'
                                            });
                                            containerObject.add(titleObject);
                                        }
                                    }, 50, this,[value, metadata,record,rowIndex,colIndex,store]);
                                    return Ext.String.format('<div id="{0}"></div>', id);
                                }

                            },
                            { text: 'Tools', width:50,
                                renderer: function (value, metadata,record,rowIndex,colIndex,store) {
                                    var id = Ext.id();
                                    var id2 = Ext.id();
                                    Ext.defer(function () {
                                        if (Ext.getDom(id)){
                                            Ext.widget('button', {
                                                renderTo: id,
                                                icon:'guidesigner/resources/icons/fugue/icons/plus.png',
                                                width: 25,
                                                handler: function () {

                                                    console.log(record);
                                                    console.log(metadata);
                                                    console.log(metadata.recordIndex+1);
                                                    console.log(record.internalId);
                                                    console.log(store.getById(record.internalId));
                                                    console.log(store);
                                                    /*store.insert(metadata.recordIndex+1,{name:Ext.id()});
                                                     record.commit();
                                                     */
                                                    /*for( var x=0; x<store.data.items.length; x++){
                                                     if(store.data.items[x].internalId===record.internalId){
                                                     store.insert(x+1,{name: Ext.id()});
                                                     break;
                                                     //store.find('id',record.get('id'),0,false,false,true)
                                                     }
                                                     }*/
                                                    var index = store.find('id',record.get('id'),0,false,false,true);
                                                    var lockedArray = store.query("lock",true),
                                                        unLockedArray = store.query("lock",false);

                                                    var totalLock = 0, percentageLocked = 0;
                                                    lockedArray.each(function (record) { totalLock += record.get('size'); });
                                                    percentageLocked = totalLock/100;
                                                    var sizeValue = 100/(unLockedArray.length+1);
                                                    if (percentageLocked<1){
                                                        unLockedArray.each(function(item){
                                                            item.set("size",sizeValue.toString()+'%') ;
                                                        });
                                                    }
                                                    store.insert(index+1,{id: Ext.id(), size:sizeValue.toString()+'%', title:'Column Title'});

                                                }
                                            });
                                            Ext.widget('button', {
                                                renderTo: id,
                                                icon:'guidesigner/resources/icons/fugue/icons/minus.png',
                                                width: 25,
                                                handler: function () {
                                                    if (store.data.items.length === 1)
                                                        Ext.Msg.alert("Alert","This layout requires at least one column.")
                                                    else
                                                        store.remove(record)
                                                }
                                            });

                                        }
                                                                            }, 50);
                                    return Ext.String.format('<div id="{0}"></div><div id="{1}"></div>', id,id2);
                                } }
                        ],
                        height: 200
                        //width: 400
                    })
                }]
            }]
        })
        myStore.load();
        me.callParent(arguments);
    }
})
