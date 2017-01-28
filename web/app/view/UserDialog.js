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

Ext.define('Traccar.view.UserDialog', {
    extend: 'Traccar.view.BaseEditDialog',

    requires: [
        'Traccar.view.UserDialogController'
    ],

    controller: 'userDialog',
    title: Strings.settingsUser,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'textfield',
            name: 'name',
            fieldLabel: Strings.sharedName
        }, {
            xtype: 'textfield',
            name: 'email',
            fieldLabel: Strings.userEmail,
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'password',
            fieldLabel: Strings.userPassword,
            inputType: 'password',
            allowBlank: false
        }, {
            xtype: 'checkboxfield',
            inputValue: true,
            uncheckedValue: false,
            name: 'readonly',
            fieldLabel: Strings.serverReadonly,
            allowBlank: false,
            hidden: true,
            reference: 'readonlyField'
        }, {
            xtype: 'checkboxfield',
            inputValue: true,
            uncheckedValue: false,
            name: 'admin',
            fieldLabel: Strings.userAdmin,
            allowBlank: false,
            hidden: true,
            reference: 'adminField'
        }, {
            xtype: 'combobox',
            name: 'map',
            fieldLabel: Strings.mapLayer,
            store: 'MapTypes',
            displayField: 'name',
            valueField: 'key',
            editable: false
        }, {
            xtype: 'combobox',
            name: 'distanceUnit',
            fieldLabel: Strings.sharedDistance,
            store: 'DistanceUnits',
            displayField: 'name',
            valueField: 'key',
            editable: false
        }, {
            xtype: 'combobox',
            name: 'speedUnit',
            fieldLabel: Strings.settingsSpeedUnit,
            store: 'SpeedUnits',
            displayField: 'name',
            valueField: 'key',
            editable: false
        }, {
            xtype: 'numberfield',
            reference: 'latitude',
            name: 'latitude',
            fieldLabel: Strings.positionLatitude,
            decimalPrecision: Traccar.Style.coordinatePrecision
        }, {
            xtype: 'numberfield',
            reference: 'longitude',
            name: 'longitude',
            fieldLabel: Strings.positionLongitude,
            decimalPrecision: Traccar.Style.coordinatePrecision
        }, {
            xtype: 'numberfield',
            reference: 'zoom',
            name: 'zoom',
            fieldLabel: Strings.serverZoom
        }, {
            xtype: 'checkboxfield',
            inputValue: true,
            uncheckedValue: false,
            name: 'twelveHourFormat',
            fieldLabel: Strings.settingsTwelveHourFormat,
            allowBlank: false
        }, {
            xtype: 'combobox',
            name: 'coordinateFormat',
            fieldLabel: Strings.settingsCoordinateFormat,
            store: 'CoordinateFormats',
            displayField: 'name',
            valueField: 'key',
            editable: false
        }, {
            xtype: 'checkboxfield',
            inputValue: true,
            uncheckedValue: false,
            name: 'disabled',
            fieldLabel: Strings.userDisabled,
            hidden: true,
            reference: 'disabledField'
        }, {
            xtype: 'datefield',
            name: 'expirationTime',
            fieldLabel: Strings.userExpirationTime,
            disabled: true,
            reference: 'expirationTimeField',
            startDay: Traccar.Style.weekStartDay,
            format: Traccar.Style.dateFormat
        }, {
            xtype: 'numberfield',
            name: 'deviceLimit',
            fieldLabel: Strings.userDeviceLimit,
            disabled: true,
            reference: 'deviceLimitField'
        }, {
            xtype: 'numberfield',
            name: 'userLimit',
            fieldLabel: Strings.userUserLimit,
            disabled: true,
            reference: 'userLimitField'
        }, {
            xtype: 'checkboxfield',
            inputValue: true,
            uncheckedValue: false,
            name: 'deviceReadonly',
            fieldLabel: Strings.userDeviceReadonly,
            disabled: true,
            reference: 'deviceReadonlyField'
        }, {
            xtype: 'textfield',
            name: 'token',
            reference: 'tokenField',
            fieldLabel: Strings.userToken,
            triggers: {
                generate: {
                    cls: 'iconCls: x-fa fa-refresh',
                    handler: 'generateToken'
                }
            }
        }]
    },

    listeners: {
        show: 'onShow'
    },

    buttons: [{
        text: Strings.sharedAttributes,
        handler: 'showAttributesView'
    }, {
        glyph: 'xf041@FontAwesome',
        minWidth: 0,
        handler: 'getMapState',
        tooltip: Strings.sharedGetMapState,
        tooltipType: 'title'
    }, {
        glyph: 'xf205@FontAwesome',
        minWidth: 0,
        handler: 'getToggleState',
        tooltip: Strings.sharedGetToggleState,
        tooltipType: 'title'
    }, {
        glyph: 'xf003@FontAwesome',
        minWidth: 0,
        handler: 'testMail',
        hidden: true,
        reference: 'testMailButton',
        tooltip: Strings.sharedTestMail,
        tooltipType: 'title'
    }, {
        xtype: 'tbfill'
    }, {
        glyph: 'xf00c@FontAwesome',
        tooltip: Strings.sharedSave,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'onSaveClick'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedCancel,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
