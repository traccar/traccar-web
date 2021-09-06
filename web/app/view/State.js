/*
 * Copyright 2015 - 2022 Anton Tananaev (anton@traccar.org)
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
    extend: 'Traccar.view.GridPanel',
    xtype: 'stateView',

    requires: [
        'Traccar.view.StateController'
    ],

    controller: 'state',
    store: 'Attributes',

    stateful: true,
    stateId: 'state-grid',

    tbar: {
        componentCls: 'toolbar-header-style',
        items: [{
            xtype: 'tbtext',
            html: Strings.stateTitle,
            baseCls: 'x-panel-header-title-default'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            disabled: true,
            handler: 'onComputedAttributesClick',
            reference: 'computedAttributesButton',
            glyph: 'xf0ae@FontAwesome',
            tooltip: Strings.sharedComputedAttributes,
            tooltipType: 'title'
        }]
    },

    columns: {
        defaults: {
            minWidth: Traccar.Style.columnWidthNormal,
            flex: 1
        },
        items: [{
            text: Strings.stateName,
            dataIndex: 'name'
        }, {
            text: Strings.stateValue,
            dataIndex: 'value',
            cellWrap: true,
            renderer: function (value, metaData, record) {
                var position, device, attribute;
                attribute = record.get('attribute');
                if (attribute === 'alarm') {
                    metaData.tdCls = 'view-color-red';
                } else if (attribute === 'address' && !value) {
                    return '<a href="#" onclick="Ext.fireEvent(\'stategeocode\')" >' +
                        Strings.sharedShowAddress + '</a>';
                } else if (attribute === 'image' || attribute === 'video' || attribute === 'audio') {
                    position = this.getController().position;
                    if (position) {
                        device = Ext.getStore('Devices').getById(position.get('deviceId'));
                        if (device) {
                            return '<a target="_blank" href="/api/media/' +
                                device.get('uniqueId') + '/' + value + '" >' + value + '</a>';
                        }
                    }
                }
                return value;
            }
        }]
    }
});
