/*
 * Copyright 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2017 Andrey Kunitsyn (andrey@traccar.org)
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
Ext.define('Traccar.view.CustomNumberField', {
    extend: 'Ext.form.field.Number',
    xtype: 'customNumberField',

    beforeEl: '<div style="width:100%;display:inline-table;">',
    unitEl: '<div style="display:table-cell;padding-left:10px;vertical-align:middle;">',

    constructor: function (config) {
        var unit;
        if (config.dataType === 'speed') {
            unit = Traccar.app.getPreference('speedUnit', 'kn');
            config.beforeSubTpl = this.beforeEl;
            config.afterSubTpl = this.unitEl + Ext.getStore('SpeedUnits').findRecord('key', unit).get('name') + '</div></div>';
            config.rawToValue = function (rawValue) {
                return Ext.getStore('SpeedUnits').convertValue(rawValue, Traccar.app.getPreference('speedUnit', 'kn'), true);
            };
            config.valueToRaw = function (value) {
                return Ext.getStore('SpeedUnits').convertValue(value, Traccar.app.getPreference('speedUnit', 'kn'));
            };
        } else if (config.dataType === 'distance') {
            config.beforeSubTpl = this.beforeEl;
            unit = Traccar.app.getPreference('distanceUnit', 'km');
            config.afterSubTpl = this.unitEl + Ext.getStore('DistanceUnits').findRecord('key', unit).get('name') + '</div></div>';
            config.rawToValue = function (rawValue) {
                return Ext.getStore('DistanceUnits').convertValue(rawValue, Traccar.app.getPreference('distanceUnit', 'km'), true);
            };
            config.valueToRaw = function (value) {
                return Ext.getStore('DistanceUnits').convertValue(value, Traccar.app.getPreference('distanceUnit', 'km'));
            };
        }
        this.callParent(arguments);
    }
});
