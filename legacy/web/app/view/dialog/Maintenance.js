/*
 * Copyright 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2018 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.dialog.Maintenance', {
    extend: 'Traccar.view.dialog.BaseEdit',

    requires: [
        'Traccar.view.dialog.MaintenanceController',
        'Traccar.view.CustomNumberField',
        'Traccar.view.UnescapedTextField'
    ],

    controller: 'maintenance',

    title: Strings.sharedMaintenance,

    items: {
        xtype: 'form',
        listeners: {
            validitychange: 'onValidityChange'
        },
        items: [{
            xtype: 'fieldset',
            title: Strings.sharedRequired,
            items: [{
                xtype: 'unescapedTextField',
                name: 'name',
                fieldLabel: Strings.sharedName,
                allowBlank: false
            }, {
                xtype: 'combobox',
                name: 'type',
                reference: 'typeComboField',
                fieldLabel: Strings.sharedType,
                displayField: 'name',
                valueField: 'key',
                allowBlank: false,
                queryMode: 'local',
                store: 'MaintenanceTypes',
                listeners: {
                    change: 'onNameChange'
                }
            }, {
                xtype: 'customNumberField',
                name: 'start',
                reference: 'startField',
                fieldLabel: Strings.maintenanceStart
            }, {
                xtype: 'customNumberField',
                name: 'period',
                reference: 'periodField',
                allowBlank: false,
                fieldLabel: Strings.maintenancePeriod,
                validator: function (value) {
                    return this.parseValue(value) !== 0 ? true : Strings.errorZero;
                }
            }]
        }]
    }
});
