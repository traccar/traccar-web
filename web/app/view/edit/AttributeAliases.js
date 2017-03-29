/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 - 2017 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.edit.AttributeAliases', {
    extend: 'Ext.grid.Panel',
    xtype: 'attributeAliasesView',

    requires: [
        'Traccar.view.edit.AttributeAliasesController',
        'Traccar.view.edit.Toolbar'
    ],

    controller: 'attributeAliases',

    tbar: {
        xtype: 'editToolbar',
        items: ['-', {
            xtype: 'tbtext',
            html: Strings.sharedDevice
        }, {
            xtype: 'combobox',
            reference: 'deviceField',
            store: 'Devices',
            displayField: 'name',
            valueField: 'id',
            editable: false,
            listeners: {
                change: 'onDeviceChange'
            }
        }]
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    columns: {
        defaults: {
            flex: 1,
            minWidth: Traccar.Style.columnWidthNormal
        },
        items: [{
            text: Strings.sharedAttribute,
            dataIndex: 'attribute'
        }, {
            text: Strings.sharedAlias,
            dataIndex: 'alias'
        }]
    }
});
