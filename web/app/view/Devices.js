/*
 * Copyright 2015 - 2016 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.Devices', {
    extend: 'Ext.grid.Panel',
    xtype: 'devicesView',

    requires: [
        'Traccar.view.DevicesController',
        'Traccar.view.EditToolbar'
    ],

    controller: 'devices',
    rootVisible: false,

    initComponent: function () {
        this.store = Ext.create('Ext.data.ChainedStore', {
            source: 'Devices',
            groupField: 'groupId'
        });
        this.callParent();
    },

    selType: 'rowmodel',

    tbar: {
        componentCls: 'toolbar-header-style',
        items: [{
            xtype: 'tbtext',
            html: Strings.deviceTitle,
            baseCls: 'x-panel-header-title-default'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            handler: 'onAddClick',
            reference: 'toolbarAddButton',
            glyph: 'xf067@FontAwesome',
            tooltip: Strings.sharedAdd,
            tooltipType: 'title'
        }, {
            xtype: 'button',
            disabled: true,
            handler: 'onEditClick',
            reference: 'toolbarEditButton',
            glyph: 'xf040@FontAwesome',
            tooltip: Strings.sharedEdit,
            tooltipType: 'title'
        }, {
            xtype: 'button',
            disabled: true,
            handler: 'onRemoveClick',
            reference: 'toolbarRemoveButton',
            glyph: 'xf00d@FontAwesome',
            tooltip: Strings.sharedRemove,
            tooltipType: 'title'
        }, {
            xtype: 'button',
            disabled: true,
            handler: 'onGeofencesClick',
            reference: 'toolbarGeofencesButton',
            glyph: 'xf21d@FontAwesome',
            tooltip: Strings.sharedGeofences,
            tooltipType: 'title'
        }, {
            disabled: true,
            handler: 'onCommandClick',
            reference: 'deviceCommandButton',
            glyph: 'xf093@FontAwesome',
            tooltip: Strings.deviceCommand,
            tooltipType: 'title'
        }]
    },

    bbar: [{
        xtype: 'tbtext',
        html: Strings.groupParent
    }, {
        xtype: 'combobox',
        store: 'Groups',
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        flex: 1,
        listeners: {
            change: function () {
                if (Ext.isNumber(this.getValue())) {
                    this.up('grid').store.filter({
                        id: 'groupFilter',
                        filterFn: function (item) {
                            var groupId, group, groupStore, filter = true;
                            groupId = item.get('groupId');
                            groupStore = Ext.getStore('Groups');

                            while (groupId) {
                                group = groupStore.getById(groupId);
                                if (group) {
                                    if (group.get('id') === this.getValue()) {
                                        filter = false;
                                        break;
                                    }
                                    groupId = group.get('groupId');
                                } else {
                                    groupId = 0;
                                }
                            }

                            return !filter;
                        },
                        scope: this
                    });
                } else {
                    this.up('grid').store.removeFilter('groupFilter');
                }
            }
        }
    }, {
        xtype: 'tbtext',
        html: Strings.sharedSearch
    }, {
        xtype: 'textfield',
        flex: 1,
        listeners: {
            change: function () {
                this.up('grid').store.filter('name', this.getValue());
            }
        }
    }],

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    forceFit: true,

    columns: {
        defaults: {
            minWidth: Traccar.Style.columnWidthNormal
        },
        items: [{
            text: Strings.sharedName,
            dataIndex: 'name'
        }, {
            text: Strings.deviceIdentifier,
            dataIndex: 'uniqueId',
            hidden: true
        }, {
            text: Strings.devicePhone,
            dataIndex: 'phone',
            hidden: true
        }, {
            text: Strings.deviceModel,
            dataIndex: 'model',
            hidden: true
        }, {
            text: Strings.deviceContact,
            dataIndex: 'contact',
            hidden: true
        }, {
            text: Strings.deviceLastUpdate,
            dataIndex: 'lastUpdate',
            renderer: function (value, metaData, record) {
                switch (record.get('status')) {
                    case 'online':
                        metaData.tdCls = 'view-color-green';
                        break;
                    case 'offline':
                        metaData.tdCls = 'view-color-red';
                        break;
                    default:
                        metaData.tdCls = 'view-color-yellow';
                        break;
                }
                if (Traccar.app.getPreference('twelveHourFormat', false)) {
                    return Ext.Date.format(value, Traccar.Style.dateTimeFormat12);
                } else {
                    return Ext.Date.format(value, Traccar.Style.dateTimeFormat24);
                }
            }
        }]
    }
});
