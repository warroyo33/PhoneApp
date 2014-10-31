/**
 * Created by Desar_6 on 23/09/2014.
 */
Ext.define('Ext.ux.finder.model.Items', {
    extend: 'Ext.data.Model',
    fields: ['uuid',
        'text',
        'id',
        'creationDate',
        'creationUser',
        'thumbnail',
        'securityNode',
        'modificationDate',
        'modificationUser'
    ]
});