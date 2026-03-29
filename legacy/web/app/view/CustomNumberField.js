/*
 * Copyright 2017 - 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2017 - 2018 Andrey Kunitsyn (andrey@traccar.org)
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
    unitEl: '<div id="numberUnitEl" style="display:table-cell;padding-left:10px;vertical-align:middle;width:1px;white-space:nowrap;">',

    constructor: function (config) {
        var unitName = '';
        if (config.dataType) {
            config.beforeBodyEl = this.beforeEl;
            switch (config.dataType) {
                case 'speed':
                    config.units = {};
                    config.units.getStore = function () {
                        return Ext.getStore('SpeedUnits');
                    };
                    config.units.getValue = function () {
                        return Traccar.app.getAttributePreference('speedUnit', 'kn');
                    };
                    unitName = Ext.getStore('SpeedUnits').findRecord('key', config.units.getValue()).get('name');
                    break;
                case 'distance':
                    config.units = {};
                    config.units.getStore = function () {
                        return Ext.getStore('DistanceUnits');
                    };
                    config.units.getValue = function () {
                        return Traccar.app.getAttributePreference('distanceUnit', 'km');
                    };
                    unitName = Ext.getStore('DistanceUnits').findRecord('key', config.units.getValue()).get('name');
                    break;
                case 'frequency':
                    if (!config.listeners) {
                        config.listeners = {};
                    }
                    config.listeners.afterrender = function () {
                        if (!this.units) {
                            this.units = Ext.create({
                                xtype: 'combobox',
                                renderTo: 'numberUnitEl',
                                store: 'TimeUnits',
                                displayField: 'name',
                                valueField: 'key',
                                editable: false,
                                numberField: this,
                                value: 's',
                                width: '70px',
                                listeners: {
                                    select: function () {
                                        this.numberField.step = this.getStore().convertValue(1, this.getValue(), true);
                                    }
                                }
                            });
                        }
                    };
                    break;
                case 'hours':
                    config.units = {};
                    config.units.getStore = function () {
                        return Ext.getStore('HoursUnits');
                    };
                    config.units.getValue = function () {
                        return 'h';
                    };
                    unitName = Strings.sharedHourAbbreviation;
                    break;
                default:
                    break;
            }
            config.afterBodyEl = this.unitEl + unitName + '</div></div>';
            config.rawToValue = function (rawValue) {
                if (this.units) {
                    return this.units.getStore().convertValue(this.parseValue(rawValue), this.units.getValue(), true);
                } else {
                    return this.parseValue(rawValue);
                }
            };
            config.valueToRaw = function (value) {
                if (this.units) {
                    return String(this.units.getStore().convertValue(value, this.units.getValue(), false));
                } else {
                    return String(value);
                }
            };
            if (config.units) {
                config.step = config.units.getStore().convertValue(1, config.units.getValue(), true);
            }
        }
        this.callParent(arguments);
    }
});
