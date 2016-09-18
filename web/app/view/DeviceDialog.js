/*
 * Copyright 2015 Anton Tananaev (anton.tananaev@gmail.com)
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

Ext.define('Traccar.view.DeviceDialog', {
    extend: 'Traccar.view.BaseEditDialog',

    requires: [
        'Traccar.view.BaseEditDialog'
    ],

    controller: 'baseEditDialog',
    title: Strings.deviceDialog,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'textfield',
            name: 'name',
            fieldLabel: Strings.sharedName,
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'uniqueId',
            fieldLabel: Strings.deviceIdentifier,
            allowBlank: false
        }, {
            xtype: 'combobox',
            name: 'groupId',
            fieldLabel: Strings.groupParent,
            store: 'Groups',
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id'
        }]
    }
});
