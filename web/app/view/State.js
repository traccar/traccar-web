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

Ext.define('Traccar.view.State', {
    extend: 'Ext.grid.Panel',
    xtype: 'stateView',

    requires: [
        'Traccar.view.StateController'
    ],

    controller: 'state',
    store: 'Attributes',

    header: {
        xtype: 'header',
        title: Strings.stateTitle,
        items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                disabled: true,
                handler: 'onAliasEditClick',
                reference: 'aliasEditButton',
                glyph: 'xf040@FontAwesome',
                tooltip: Strings.sharedEdit,
                tooltipType: 'title'
            }]
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    columns: [{
        text: Strings.stateName,
        dataIndex: 'name',
        flex: 1
    }, {
        text: Strings.stateValue,
        dataIndex: 'value',
        flex: 1,
        renderer: function (value, metaData, record) {
            if (record.get('attribute') === 'alarm') {
                metaData.tdCls = 'view-color-red';
            }
            return value;
        }
    }]
});
