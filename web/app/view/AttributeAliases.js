/*
 * Copyright 2016 Anton Tananaev (anton.tananaev@gmail.com)
 * Copyright 2016 Andrey Kunitsyn (abyss@fox5.ru)
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

Ext.define('Traccar.view.AttributeAliases', {
    extend: 'Ext.grid.Panel',
    xtype: 'attributeAliasesView',

    requires: [
        'Traccar.view.AttributeAliasesController',
        'Traccar.view.EditToolbar'
    ],

    controller: 'attributeAliases',

    selType: 'rowmodel',

    tbar: {
        xtype: 'editToolbar',
        items: ['-', {
            xtype: 'combobox',
            reference: 'deviceField',
            store: 'Devices',
            displayField: 'name',
            valueField: 'id',
            typeAhead: true,
            listeners: {
                change: 'onDeviceChange'
            }
        }]
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    columns: [{
        text: Strings.sharedAttribute,
        dataIndex: 'attribute',
        flex: 1
    }, {
        text: Strings.sharedAlias,
        dataIndex: 'alias',
        flex: 1
    }]
});
