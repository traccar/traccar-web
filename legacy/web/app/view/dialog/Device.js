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

Ext.define('Traccar.view.dialog.Device', {
    extend: 'Traccar.view.dialog.BaseEdit',

    requires: [
        'Traccar.view.ClearableComboBox',
        'Traccar.view.dialog.DeviceController',
        'Traccar.view.UnescapedTextField'
    ],

    controller: 'device',
    title: Strings.sharedDevice,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'fieldset',
            title: Strings.sharedRequired,
            items: [{
                xtype: 'unescapedTextField',
                name: 'name',
                fieldLabel: Strings.sharedName,
                allowBlank: false
            }, {
                xtype: 'unescapedTextField',
                name: 'uniqueId',
                fieldLabel: Strings.deviceIdentifier,
                allowBlank: false
            }]
        }, {
            xtype: 'fieldset',
            title: Strings.sharedExtra,
            collapsible: true,
            collapsed: true,
            items: [{
                xtype: 'clearableComboBox',
                name: 'groupId',
                fieldLabel: Strings.groupParent,
                store: 'Groups',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id'
            }, {
                xtype: 'unescapedTextField',
                name: 'phone',
                fieldLabel: Strings.sharedPhone
            }, {
                xtype: 'unescapedTextField',
                name: 'model',
                fieldLabel: Strings.deviceModel
            }, {
                xtype: 'unescapedTextField',
                name: 'contact',
                fieldLabel: Strings.deviceContact
            }, {
                xtype: 'combobox',
                name: 'category',
                fieldLabel: Strings.deviceCategory,
                store: 'DeviceImages',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'key',
                editable: false,
                listConfig: {
                    getInnerTpl: function () {
                        return '<table><tr valign="middle" ><td><div align="center" style="width:40px;height:40px;" >' +
                        '{[new XMLSerializer().serializeToString(Traccar.DeviceImages.getImageSvg(' +
                        'Traccar.Style.mapColorOnline, false, 0, values.key))]}</div></td>' +
                        '<td>{name}</td></tr></table>';
                    }
                }
            }, {
                xtype: 'checkboxfield',
                inputValue: true,
                uncheckedValue: false,
                name: 'disabled',
                fieldLabel: Strings.sharedDisabled,
                hidden: true,
                reference: 'disabledField'
            }]
        }]
    }
});
