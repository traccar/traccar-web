/*
 * Copyright 2015 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.ServerDialog', {
    extend: 'Traccar.view.BaseEditDialog',

    requires: [
        'Traccar.view.MapPickerDialogController'
    ],

    controller: 'mapPickerDialog',
    title: Strings.serverTitle,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'checkboxfield',
            inputValue: true,
            uncheckedValue: false,
            name: 'registration',
            fieldLabel: Strings.serverRegistration,
            allowBlank: false
        }, {
            xtype: 'checkboxfield',
            inputValue: true,
            uncheckedValue: false,
            name: 'readonly',
            fieldLabel: Strings.serverReadonly,
            allowBlank: false
        }, {
            xtype: 'combobox',
            name: 'map',
            fieldLabel: Strings.mapLayer,
            store: 'MapTypes',
            displayField: 'name',
            valueField: 'key',
            editable: false
        }, {
            xtype: 'textfield',
            name: 'bingKey',
            fieldLabel: Strings.mapBingKey
        }, {
            xtype: 'textfield',
            name: 'mapUrl',
            fieldLabel: Strings.mapCustom
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
            xtype: 'checkboxfield',
            inputValue: true,
            uncheckedValue: false,
            name: 'forceSettings',
            fieldLabel: Strings.serverForceSettings,
            allowBlank: false
        }, {
            xtype: 'combobox',
            name: 'coordinateFormat',
            fieldLabel: Strings.settingsCoordinateFormat,
            store: 'CoordinateFormats',
            displayField: 'name',
            valueField: 'key',
            editable: false
        }]
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
