/**
 * Created by Desar_6 on 27/10/2014.
 */
Ext.define('Ext.ux.notification.Bubble',{
    extend:'Ext.ux.callout.Callout',
    xtype: 'notificationBubble',
    initComponent: function(){
        var me = this,
            Ex= Ext,
            ExLocale= Ext.localization,
            ExArray= Ex.Array;
        Ex.applyIf(me,{
            type: 'default',
            form: null,
            data: null,
            message: 'Notification Panel'
        });
        var typeCls;
        switch(me.type){
            case 'error':
                typeCls='red';
                break;
            case 'default':
                typeCls='default';
                break;
            default :
                typeCls='default';
                break;
        }
        var notificationBubbleStore= Ext.StoreManager.lookup("notificationStore");

        function columnWrap(val){
            return '<div style="white-space:normal !important;">'+ val +'</div>';
        }
        var contentView = Ext.create('Ext.ux.notification.TableView',{
            border: 0,
            //title: 'The following errors prevent to continue the process',
            style: 'border: 0px solid white; background-color: transparent; ',
            store: notificationBubbleStore,
            region: 'center',
            //features: [{ftype:'grouping'}],
            width: 200,
            height: 275
        });

        var headerMessage = Ext.create('Ext.container.Container',{
            region: 'north',
            //heigth: 40,
            html: '<table style="width:100%" border=0>' +
            '<tr>' +
            '<td style="width: 34px">' +
            '<img src= "js/lib/resources/images/monitorLogoHD.png" class ="monitorLogoHD" />'+
            '</td>'+
            '<td >' +
                //'<b>' + t + '</b>' +
            '<p>' + me.message + '</p>' +
            '</td>' +
            '<td style="width:20px" align="right">' +

            '</td>' +
            '</tr>' +
            '</table>'
        });
        var todayDate = new Date(),
            ExLocale = Ext.localization.notifications,
            dateText = ExLocale.dateText(todayDate),
            newsPanel = Ext.widget('panel',{
                title: ExLocale.title.news,
                collapsible:true,
                minHeight: 100
            }),
            calendarPanel = Ext.widget('panel',{
                title: ExLocale.title.calendar,
                collapsible:true,
                minHeight: 100
            }),
            remindersPanel = Ext.widget('panel',{
                title: ExLocale.title.reminders,
                collapsible:true,
                minHeight: 100
            }),
            tomorrowPanel = Ext.widget('panel',{
                title: ExLocale.title.tomorrow,
                collapsible:true,
                minHeight: 100
            }),
            todayView = Ext.widget('container',{
                layout:'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype:'panel',
                        bodyPadding: 5,
                        border: false,
                        heigth: 120,
                        bodyStyle: 'border: 0px solid white; background-color: transparent',
                        items:[{
                            xtype:'label',
                            text: dateText,
                            padding: '15 0 0 0',
                            style: 'font-size: 50px; color: rgba(122, 138, 155, 0.8)'
                        }]
                    },
                    newsPanel,
                    calendarPanel,
                    remindersPanel,
                    tomorrowPanel
                ]
            }),
            notificationView= Ext.widget('panel',{
                layout: 'fit',
                bodyStyle: 'background-color: transparent; ',
                autoScroll: true,
                bbar:[{
                    text: ExLocale.toolbar.markAllRead,
                    iconCls: 'mpaUI-deleteStroke',
                    style: 'color: #157fcc; font-size: 16px;',
                    handler: function(){
                        notificationBubbleStore.removeAll();
                    }
                },'->',{
                    text: ExLocale.toolbar.addNew,
                    iconCls: 'mpaUI-addStroke',
                    style: 'color: #157fcc; font-size: 16px;',

                    handler: function(){
                        notificationBubbleStore.removeAll();
                    }
                }],
                items:[/*headerMessage,*/contentView]
            });
        var contentBody = Ext.create('Ext.panel.Panel',{
            border: false,
            //title: Ext.localization.apiName+" - "+Ext.localization.msgText.errorHeader,
            layout: 'card',
            //bodyCls: 'jumerror',
            bodyBorder:0,
            bodyStyle: 'background-color: transparent; border: 0px solid white',
            tbar:[{
                text: ExLocale.toolbar.today,
                width: '50%',
                enableToggle: true,
                toggleGroup: 'headerNotificationBar',
                handler: function(){
                    contentBody.getLayout().setActiveItem(0);
                }
            },{
                text: ExLocale.toolbar.notifications,
                width: '50%',
                enableToggle: true,
                toggleGroup: 'headerNotificationBar',
                handler: function(){
                    contentBody.getLayout().setActiveItem(1);
                }
            }],
            items:[todayView,notificationView],
            width: 350,
            height: 300
        });

        Ext.applyIf(me,{
            //cls: 'red',
            items: [contentBody],
            style: 'padding: 5px;',
            layout: 'fit',
            height: document.body.clientHeight-35
        });
        me.callParent(arguments);

        window.onresize=function(){
            me.setHeight(document.body.clientHeight-35);
            //me.doLayout();
        }
    }
});