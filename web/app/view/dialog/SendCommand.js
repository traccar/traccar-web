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

Ext.define('Traccar.view.dialog.SendCommand', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.SendCommandController'
    ],

    controller: 'sendCommand',
    title: Strings.commandTitle,

    items: [{
        xtype: 'combobox',
        reference: 'commandsComboBox',
        fieldLabel: Strings.deviceCommand,
        displayField: 'description',
        valueField: 'id',
        store: 'DeviceCommands',
        queryMode: 'local',
        editable: false,
        allowBlank: false,
        listeners: {
            select: 'onCommandSelect'
        }
    }, {
        xtype: 'form',
        listeners: {
            validitychange: 'onValidityChange'
        },
        items: [{
            xtype: 'fieldset',
            reference: 'newCommandFields',
            disabled: true,
            items: [{
                xtype: 'checkboxfield',
                name: 'textChannel',
                reference: 'textChannelCheckBox',
                inputValue: true,
                uncheckedValue: false,
                fieldLabel: Strings.commandSendSms,
                listeners: {
                    change: 'onTextChannelChange'
                }
            }, {
                xtype: 'combobox',
                name: 'type',
                reference: 'commandType',
                fieldLabel: Strings.sharedType,
                store: 'CommandTypes',
                displayField: 'name',
                valueField: 'type',
                editable: false,
                allowBlank: false,
                listeners: {
                    change: 'onTypeChange'
                }
            }, {
                xtype: 'fieldcontainer',
                reference: 'parameters'
            }]
        }]
    }],

    buttons: [{
        xtype: 'tbfill'
    }, {
        glyph: 'xf093@FontAwesome',
        tooltip: Strings.sharedSend,
        tooltipType: 'title',
        minWidth: 0,
        disabled: true,
        reference: 'sendButton',
        handler: 'onSendClick'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedCancel,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
