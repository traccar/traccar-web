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
            html: "<span><a href='./'><img src='./logo/back.png' class='showthat' vertical-align: middle;' alt='logo' height='27px' width='82px' /></a></span><span class='showthatmin'>Assets List</span>",
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
        selectionchange: 'onSelectionChange'
    },

    viewConfig: {
        enableTextSelection: true,
        disableCaching: true,
        preserveScrollOnRefresh: true,
        getRowClass: function (record) {
            var result = '', status = record.get('status'), movement = record.get('movement'), speed = record.get('speed');
            var lastupdate = "" + record.get('lastUpdate');
            var defTime = (Number(new Date()) - (Number(new Date(lastupdate))))/1000;
            var expirationTime = "" + record.get('expiration');
            var expTime = (Number(new Date(expirationTime)))/1000;
            var expCurTime = (Number(new Date()))/1000;
            var motion = record.get('motion');
            if (typeof record.get('ignition') !== undefined) {
                var ignition = record.get('ignition');
            } else {
                var ignition = false;
            }
            if (record.get('disabled') || (expCurTime >= expTime)) {
                result = 'view-item-disabled ';
            }
            if (status && movement) {
                if (status === 'nulled') {
                    result += 'view-color-red';
                } else {
                    if (defTime >= Traccar.Style.devicesTimeout || (((movement === '' || movement === undefined) && status === '') && defTime >= Traccar.Style.devicesTimeout) || (movement === 'moving' && defTime >= Traccar.Style.devicesTimeout)) {
                        result += 'view-color-red';
                    } else if (((typeof ignition !== undefined) && ignition === true) && (movement === 'moving' || movement === 'parked' || movement === 'idle') && ((typeof motion !== undefined) && motion === false)) {
                        result += 'view-color-yellow';
                    } else if (movement === 'parked') {
                        result += 'view-color-orange';
                    } else if (((movement === '' || movement === null || movement === undefined) && ((typeof motion !== undefined) && motion === false) && (lastupdate !== null || lastupdate !== ''))) {
                        result += 'view-color-orange';
                    } else if (((movement === 'idle' || movement === '') && ((typeof ignition !== undefined) && ignition === false && ignition !== null)) || (((typeof motion !== undefined) && motion === false && motion !== null) && (movement === '' || movement === null))) {
                        result += 'view-color-orange';
                    } else if (movement === 'idle' && ((typeof ignition !== undefined) && ignition === false && ignition !== null) && (((typeof motion !== undefined) && motion === true && motion !== null) && speed <= 7)) {
                        result += 'view-color-orange';
                    } else if (movement === 'moving' && ((typeof ignition !== undefined) && ignition === false && ignition !== null) && (((typeof motion !== undefined) && (motion === true || motion === false) && motion !== null) && speed <= 3)) {
                        result += 'view-color-orange';
                    } else if (movement === 'moving' && speed > 2) {
                        result += 'view-color-green';
                    } else if ((motion === true && speed > 2) && (motion === true && (movement === '' || movement === null || movement === undefined)) && (lastupdate !== null || lastupdate !== '')) {
                        result += 'view-color-green';
                    } else if (movement === 'idle') {
                        result += 'view-color-yellow';
                    } else if ((movement === '' || movement === null) && (lastupdate === null || lastupdate === '')) {
                        result += 'view-color-red';
                    } else {
                        result += 'view-color-yellow';
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
            },
            itemdblclick: function(dv, record, item, index, e) {
                posId = record.get('id');
                //console.log('working' + posId);
                Strings.setDeviceQuick = posId;
            }
           }
    },

    columns: {
        defaults: {
            flex: 1,
            minWidth: 60,
            autoSizeColumn : true
        },
        items: [{
            text: Strings.sharedAssetName,
            dataIndex: 'name',
            minWidth: 90,
            maxWidth: 185,
            filter: 'string',
            renderer: function (value, metaData, record) {
                var status = record.get('status');
                var lastupdate = "" + record.get('lastUpdate');
                var defTime = (Number(new Date()) - (Number(new Date(lastupdate))))/1000;
                if (status === 'online' || defTime < Traccar.Style.devicesTimeout) {
                    metaData.tdCls = 'view-color-green-text';
                } else if (status === 'offline' && record.get('lastUpdate') == null) {
                    metaData.tdCls = 'view-color-null-text';
                } else if (status === 'offline' && defTime >= Traccar.Style.devicesTimeout) {
                    metaData.tdCls = 'view-color-red-text';
                } else if (status === 'offline') {
                    metaData.tdCls = 'view-color-blue-text';
                } else if (status === 'unknown') {
                    metaData.tdCls = 'view-color-red-text';
                } else {
                    metaData.tdCls = 'view-color-gen-text';
                }
                return value;
                
            }
        }, {
            text: Strings.groupDialog,
            dataIndex: 'groupId',
            minWidth: 85,
            maxWidth: 185,
            hidden: false,
            filter: {
                type: 'list',
                labelField: 'name',
                store: 'Groups'
            },
            renderer: function (value, record) {
                if (value) {
                    return Traccar.AttributeFormatter.getFormatter('groupId')(value);
                } else {
                    return 'No Group';
                }
            }
        }, {
            text: Strings.deviceLastTime,
            dataIndex: 'lastUpdate',
            xtype: 'datecolumn',
            minWidth: 100,
            maxWidth: 100,
            renderer: function (value, metaData, record) {
                                var status = record.get('status');
                                var lastupdate = "" + value;
                                var defTime = (new Date(lastupdate));
                                function formatDate(date) {
                                var year = date.getFullYear().toString().substr(-2),
                                month = date.getMonth() + 1, // months are zero indexed
                                day = date.getDate()  < 10 ? "0" + date.getDate() : date.getDate(),
                                hour = date.getHours(),
                                minute = date.getMinutes(),
                                second = date.getSeconds(),
                                hourFormatted = hour  < 10 ? "0" + hour : hour,// hour returned in 24 hour format
                                minuteFormatted = minute < 10 ? "0" + minute : minute,
                                morning = hour < 12 ? "am" : "pm";
                                return day + "-" + month + "-" + year + " " + hourFormatted + ":" +
                                minuteFormatted;// + morning;
                                }
                                var returneder = formatDate(defTime);
                                if (status === 'offline' && value == null) {
                                    return 'No Info';
                                } else {
                                    return returneder;
                                }
                                
                            },
            filter: 'date'
        }, {
            text: 'Status',
            minWidth: 70,
            maxWidth: 70,
            dataIndex: 'movement',
            hidden: false,
            filter: {
                type: 'list'
            },
            renderer: function (value, metaData, record) {
                var status = record.get('status');
                var lastupdate = "" + record.get('lastUpdate');
                var expirationTime = "" + record.get('expiration');
                var expTime = (Number(new Date(expirationTime)))/1000;
                var expCurTime = (Number(new Date()))/1000;
                var defTime = (Number(new Date()) - (Number(new Date(lastupdate))))/1000;
                var motion = record.get('motion');
                var ignition = record.get('ignition');
                var alarm = record.get('alarms');
                var speed = record.get('speed');
                if (expCurTime >= expTime) {
                    return 'Expired';
                } else if (((status === 'offline' || status === 'unknown') && defTime >= Traccar.Style.devicesTimeout) || status === 'nulled') {
                    return 'Offline';
                } else if ((typeof alarm !== undefined) && alarm && alarm !== 'nil') {
                    return alarm;
                } else if (((typeof ignition !== undefined) && ignition === true) && ((typeof motion !== undefined) && motion === false) && (value === 'moving' || value === 'parked' || value === 'idle')) {
                    return 'Idle';
                } else if (value === 'parked') {
                    return 'Parked';
                } else if ((value === 'idle' && ((typeof ignition !== undefined) && ignition === false && ignition !== null)) || (((typeof motion !== undefined) && motion === false && motion !== null) && (value === '' || value === null))) {
                    return 'Parked';
                } else if ((value === 'idle' && ((typeof ignition !== undefined) && ignition === false && ignition !== null)) && (((typeof motion !== undefined) && motion === true && motion !== null) && speed <= 7)) {
                    return 'Parked';
                } else if ((value === 'moving' && ((typeof ignition !== undefined) && ignition === false && ignition !== null)) && (((typeof motion !== undefined) && (motion === true || motion === false) && motion !== null) && speed <= 3)) {
                    return 'Parked';
                } else if (value === 'moving' && speed > 2) {
                    return 'Moving';
                } else if ((value === 'moving' && speed > 2)  || (motion === true && (value === '' || value === null || value === undefined) && (lastupdate !== null || lastupdate !== ''))) {
                    return 'Moving';
                } else if (value === 'idle') {
                    return 'Idle';
                } else if (speed >= 0.1 && value !== null) {
                    return 'Idle';
                } else if (value === "" || value === null) {
                    return 'Pending';
                } else {
                    return 'Idle';
                }
                
            }
        }, {
            text: Strings.deviceStatus,
            dataIndex: 'status',
            minWidth: 60,
            maxWidth: 60,
            hidden: true,
            filter: {
                type: 'list',
                labelField: 'name',
                store: 'DeviceStatuses'
            },
            renderer: function (value, metaData, record) {
                var statusy;
                if (value) {
                    var status = record.get('status');
                    var lastupdate = "" + record.get('lastUpdate');
                    var defTime = (Number(new Date()) - (Number(new Date(lastupdate))))/1000;
                    statusy = Ext.getStore('DeviceStatuses').getById(value);
                    if (statusy) {
                        if ((status === 'offline' || status === 'unknown') && defTime >= Traccar.Style.devicesTimeout) {
                            return 'Offline';
                        } else if (status === 'offline' && record.get('lastUpdate') == null) {
                            return 'No Info';
                        } else {
                            return statusy.get('name');
                        }
                    }
                }
                return null;
            }
        }, {
            text: Strings.positionSpeed,
            dataIndex: 'speed',
            renderer: function (value) {
                spdft = Traccar.AttributeFormatter.getFormatter('speed')(0)
                spdval = '';
                if (spdft === '0.0 kph') {
                    spdval = ' kph';
                } else if (spdft === '0.0 kn') {
                    spdval = ' kn';
                } else {
                    spdval = ' mph';
                }
                if (value == null){
                    return null;
                } else {
                    lesSpeed = Math.round(Traccar.AttributeFormatter.getConverter('speed')(value));
                    if (lesSpeed == 'NaN km/h' || lesSpeed == 'NaN kn' || lesSpeed == 'NaN mph') {
                        return Traccar.AttributeFormatter.getFormatter('speed')(0);
                    } else {
                        return lesSpeed + spdval;
                    }
                }
            },
            hidden: false,
            minWidth: 60,
            maxWidth: 60,
            filter: 'string'
        }, {
            text: Strings.positionIgnition,
            dataIndex: 'status',
            renderer: function (value, metaData, record) {
                var spd = record.get('speed');
                if (typeof record.get('ignition') !== undefined) {
                    var ignition = record.get('ignition');
                } else {
                    var ignition = false;
                }
                if (ignition === true || (spd >= 14.2)) {
                    metaData.tdCls = 'ign-color-green-text';
                    return 'On';
                } else {
                    metaData.tdCls = 'ign-color-red-text';
                    return 'Off';
                }
            },
            hidden: false,
            minWidth: 50,
            maxWidth: 50,
            filter: 'boolean'
        }, {
            text: Strings.deviceModelMain,
            dataIndex: 'protocol',
            renderer: function (value) {
                valy = value + "";
                if (value === null) {
                    return 'No data';
                } else {
                    return valy;//.replace(/\b\w/g, l => l.toUpperCase());
                }
            },
            hidden: true,
            minWidth: 70,
            maxWidth: 70,
            filter: 'list'
        }, {
            text: Strings.positionAddress,
            dataIndex: 'address',
            minWidth: 165,
            renderer: function (value, metaData, record) {
                if (!value) {
                    if (Ext.fireEvent('routegeocode', record.getId()) === true){
                        return "No Location Data"
                    } else {
                        //geoCode function pending for devices panel
                        return Ext.fireEvent('routegeocode', record.getId());
                    }
                }
                return Traccar.AttributeFormatter.getFormatter('address')(value);
        },
            hidden: false,
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
            text: Strings.sharedDisabled,
            dataIndex: 'disabled',
            renderer: Traccar.AttributeFormatter.getFormatter('disabled'),
            hidden: true,
            filter: 'boolean'
        }, {
            text: Strings.userExpirationTime,
            dataIndex: 'expiration',
            xtype: 'datecolumn',
            hidden: true,
            minWidth: 100,
            maxWidth: 100,
            renderer: function (value, metaData, record) {
                var lastupdate = "" + value;
                var defTime = (new Date(lastupdate));
                function formatDate(date) {
                var year = date.getFullYear().toString().substr(-2),
                month = date.getMonth() + 1, // months are zero indexed
                day = date.getDate()  < 10 ? "0" + date.getDate() : date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds(),
                hourFormatted = hour  < 10 ? "0" + hour : hour,// hour returned in 24 hour format
                minuteFormatted = minute < 10 ? "0" + minute : minute,
                morning = hour < 12 ? "am" : "pm";
                return day + "-" + month + "-" + year + " " + hourFormatted + ":" +
                minuteFormatted;// + morning;
                }
                var returneder = formatDate(defTime);
                if (value == null) {
                    return 'Unlimited';
                } else {
                    return returneder;
                }
            },
            filter: 'date'
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
        }]
    },
    bbar: {items: [{
        xtype: 'pagingtoolbar',
        store: 'Devices',
        pluginId: 'devicespage',
        displayInfo: true,
        displayMsg: 'Total of {2} &nbsp;Assets ',
        emptyMsg: "No Asset to display&nbsp;"
    }]},
    includeHeaders: true,
    forceFit: true,
    selModel: {
       selType: 'rowmodel',
       mode: 'MULTI'
    }
});
