Ext.require(['Ext.data.*', 'Ext.grid.*']);

Ext.define('Book', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true,
            persist: false

    },
        'title', 'author', 'year', 'in_stock', 'pages']
    ,
    validations: [{
        type: 'length',
        field: 'title',
        max: 120
    }, {
        type: 'length',
        field: 'author',
        max: 120
    }]
});

var token = Ext.util.Cookies.get('csrftoken');

Ext.onReady(function() {

    var store = Ext.create('Ext.data.Store', {

            autoLoad: true,
            autoSync: true,
            model: 'Book',
            id: 'bookStore',
            proxy: {
                type: 'rest',
                url: '/api/books/',
                headers: {
                    'X-CSRFToken': token
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                writer: {
                    type: 'json'
                },
            },
        }),


        grid = Ext.create('Ext.grid.Panel', {

            renderTo: document.body,
            plugins: {
                rowediting: {
                    listeners: {
                        cancelEdit: function(rowEditing, context) {
                            if (context.record.phantom) {
                                store.remove(context.record);
                            }
                        }
                    }
                }
            },
            width: 600,
            height: 360,
            frame: false,
            title: 'Books storage',
            id: 'bookGrid',
            store: store,
            columns: [
                {
                    text: 'Title',
                    flex: 2,
                    sortable: true,
                    dataIndex: 'title',
                    field: {
                        xtype: 'textfield'
                    },
                    renderer: function(v) {
                        return Ext.String.htmlEncode(v);
                    }
                    },

                {
                    header: 'Author',
                    width: 180,
                    sortable: true,
                    dataIndex: 'author',
                    field: {
                    xtype: 'textfield'
                    },
                    renderer: function(v) {
                        return Ext.String.htmlEncode(v);
                    }
                    },

                {
                    text: 'Year',
                    width: 80,
                    sortable: true,
                    dataIndex: 'year',
                    field: {
                    xtype: 'numberfield'
                    },
                    renderer: function(v) {
                        return Ext.String.htmlEncode(v);
                    }
                    },

                {
                    text: 'In stock',
                    width: 80,
                    sortable: true,
                    dataIndex: 'in_stock',
                    field: {
                    xtype: 'checkbox'
                    }
                    },

                {
                    text: 'Pages',
                    width: 80,
                    sortable: true,
                    dataIndex: 'pages',
                    field: {
                    xtype: 'numberfield'
                },
                    renderer: function(v) {
                        return Ext.String.htmlEncode(v);
                    }
                }

                ],
            dockedItems: [{
                xtype: 'toolbar',
                items: [ {
                    itemId: 'delete',
                    text: 'Delete',
                    disabled: true,
                    handler: function() {
                        var selection = grid.getView().getSelectionModel().getSelection()[0];

                        if (selection) {
                            store.remove(selection);
                        }
                    }
                }]
            }]
        });


    var comboData = [
        [1, 'Yes'],
        [0, 'No']
    ];

    var loginForm=Ext.create('Ext.form.Panel',{
        title: 'Add book',
        width: 600,
        height: 360,
        bodyPadding: 40,
        id: 'bookForm',
        bodyStyle: 'margin-left: 100px; background-color: #f6f6f6;',
        renderTo: Ext.getBody(),
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Title',
                name: 'title',
                maxLength: 120,
                allowBlank: false
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Author',
                name: 'author',
                maxLength: 120,
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                type: 'int',
                fieldLabel: 'Year',
                name: 'year',
                allowBlank: false,
                validator: function (val) {
                    if (parseInt(val, 10) <= 2021 && parseInt(val, 10) >= 1)  {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
            {
                xtype: 'combobox',
                fieldLabel: 'In stock',
                name: 'in_stock',
                allowBlank: false,
                store: Ext.data.Store({
                    id: 0,
                    fields:
                        [
                            'value',
                            'display'
                        ],
                    data: comboData
                }),
                valueField: 'value',
                displayField: 'display',
                queryMode: 'local',
                vtype: 'alpha',
                validator: function (val) {
                    if (val==='Yes' || val==='No') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
        },
            {
                xtype: 'numberfield',
                fieldLabel: 'Pages',
                type: 'int',
                name: 'pages',
                allowBlank: false,
                validator: function (val) {
                    if (parseInt(val, 10) <= 2147483647 && parseInt(val, 10) >= 1)  {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            ],
        buttons: [{
            text: 'Submit',
            id: 'submitButton',
            handler: function() {
                loginForm.getForm().submit({
                    url: '/api/books/',
                    headers: {
                        'X-CSRFToken': token
                    },
                    success: function(form, action){
                        Ext.getCmp('bookGrid').getStore().load();
                    },
                    failure: function(form, action){
                        Ext.getCmp('bookGrid').getStore().load();
                    }
                });
            }
        }]
    });

    Ext.getCmp('bookGrid').showAt(540, 0);
    Ext.getCmp('bookForm').showAt(540, 360);

    grid.getSelectionModel().on('selectionchange', function(selModel, selections) {
        grid.down('#delete').setDisabled(selections.length === 0);
    });
});