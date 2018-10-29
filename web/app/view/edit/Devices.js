/*
 * Copyright 2015 - 2017 Anton Tananaev (anton@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.view.edit.Devices', {
    extend: 'Traccar.view.GridPanel',
    xtype: 'devicesView',

    requires: [
        'Traccar.AttributeFormatter',
        'Traccar.view.edit.DevicesController',
        'Traccar.view.ArrayListFilter',
        'Traccar.view.DeviceMenu'
    ],

    controller: 'devices',

    store: 'VisibleDevices',

    stateful: true,
    stateId: 'devices-grid',

    tbar: {
        componentCls: 'toolbar-header-style',
        defaults: {
            xtype: 'button',
            disabled: true,
            tooltipType: 'title'
        },
        items: [{
            xtype: 'tbtext',
            html: "<span><a href='./'><img src='./images/logo.png' class='showthat' vertical-align: middle;' alt='logo' height='27px' width='82px' /></a></span><span class='showthatmin'>Assets List</span>",
            baseCls: 'x-panel-header-title-default'
        }, {
            xtype: 'tbfill',
            disabled: false
        }, {
            handler: 'onAddClick',
            reference: 'toolbarAddButton',
            glyph: 'xf067@FontAwesome',
            tooltip: Strings.sharedAdd
        }, {
            handler: 'onEditClick',
            reference: 'toolbarEditButton',
            glyph: 'xf040@FontAwesome',
            tooltip: Strings.sharedEdit
        }, {
            handler: 'onRemoveClick',
            reference: 'toolbarRemoveButton',
            glyph: 'xf00d@FontAwesome',
            tooltip: Strings.sharedRemove
        }, {
            handler: 'onCommandClick',
            reference: 'deviceCommandButton',
            glyph: 'xf093@FontAwesome',
            tooltip: Strings.deviceCommand
        }, {
            xtype: 'deviceMenu',
            reference: 'toolbarDeviceMenu',
            enableToggle: false
        }]
    },

    listeners: {
        rowclick: 'onSelectionChange',
        itemkeyup: 'onSelectionChange'
    },

    viewConfig: {
        enableTextSelection: true,
        preserveScrollOnRefresh: true,
        getRowClass: function (record) {
            var result = '', status = record.get('status');var result = '', status = record.get('status'), movement = record.get('movement');
            if (record.get('disabled')) {
                result = 'view-item-disabled ';
            }
            if (status && movement) {
                if (status === 'unknown') {
                    result += 'view-color-red';
                } else {
                    if (movement === 'moving' && status === 'unknown') {
                        result += 'view-color-red';
                    } else if (movement === 'moving') {
                        result += 'view-color-green';
                    } else if (movement === 'idle') {
                        result += 'view-color-yellow';
                    } else {
                        result += 'view-color-orange';
                    }
                }
            }
            return result;
        },
        listeners : {
            refresh : function (dataview) {
             Ext.each(dataview.panel.columns, function (column) {
              if (column.autoSizeColumn === true)
               column.autoSize();
             })
            }
           }
    },

    columns: {
        defaults: {
            flex: 1,
            minWidth: 70,
            autoSizeColumn : true
        },
        items: [{
            text: Strings.sharedName,
            dataIndex: 'name',
            minWidth: 100,
            maxWidth: 100,
            filter: 'string'
        }, {
            text: Strings.deviceIdentifier,
            dataIndex: 'uniqueId',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.sharedPhone,
            dataIndex: 'phone',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.deviceModel,
            dataIndex: 'model',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.deviceContact,
            dataIndex: 'contact',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.groupDialog,
            dataIndex: 'groupId',
            minWidth: 100,
            maxWidth: 100,
            hidden: false,
            filter: {
                type: 'list',
                labelField: 'name',
                store: 'Groups'
            },
            renderer: Traccar.AttributeFormatter.getFormatter('groupId')
        }, {
            text: Strings.sharedDisabled,
            dataIndex: 'disabled',
            renderer: Traccar.AttributeFormatter.getFormatter('disabled'),
            hidden: true,
            filter: 'boolean'
        }, {
            text: Strings.sharedGeofences,
            dataIndex: 'geofenceIds',
            hidden: true,
            filter: {
                type: 'arraylist',
                idField: 'id',
                labelField: 'name',
                store: 'Geofences'
            },
            renderer: function (value) {
                var i, name, result = '';
                if (Ext.isArray(value)) {
                    for (i = 0; i < value.length; i++) {
                        name = Traccar.AttributeFormatter.geofenceIdFormatter(value[i]);
                        if (name) {
                            result += name + (i < value.length - 1 ? ', ' : '');
                        }
                    }
                }
                return result;
            }
        }, {
            text: Strings.deviceStatus,
            dataIndex: 'status',
            minWidth: 60,
            maxWidth: 60,
            filter: {
                type: 'list',
                labelField: 'name',
                store: 'DeviceStatuses'
            },
            renderer: function (value) {
                var status;
                if (value) {
                    status = Ext.getStore('DeviceStatuses').getById(value);
                    if (status) {
                        return status.get('name');
                    }
                }
                return null;
            }
        }, {
            text: 'Status',
            minWidth: 60,
            maxWidth: 60,
            dataIndex: 'movement',
            hidden: false,
            filter: 'list'
        }, {
            text: Strings.deviceLastUpdate,
            dataIndex: 'lastUpdate',
            xtype: 'datecolumn',
            renderer: function (value, metaData, record) {
                                var status = record.get('status');
                                var lastupdate = record.get('lastUpdate');
                                if (status === 'online') {
                                    metaData.tdCls = 'view-color-green-text';
                                } else if (status === 'offline' && lastupdate == null) {
                                    metaData.tdCls = 'view-color-null-text';
                                } else if (status === 'offline') {
                                    metaData.tdCls = 'view-color-blue-text';
                                } else if (status === 'unknown') {
                                    metaData.tdCls = 'view-color-red-text';
                                } else {
                                    metaData.tdCls = 'view-color-gen-text';
                                }
                                return Traccar.AttributeFormatter.getFormatter('lastUpdate')(value);
                            },
            filter: 'date'
        }]
    },
    bbar: {items: [{
        xtype: 'pagingtoolbar',
        store: 'Devices',
        pluginId: 'devicespage',
        displayInfo: true,
        displayMsg: '{0} to {1} of {2} &nbsp;Assets ',
        emptyMsg: "No Asset to display&nbsp;"
    }]},
    includeHeaders: true,
    forceFit: true,
    selModel: {
       selType: 'rowmodel',
       mode: 'MULTI'
    }
});
