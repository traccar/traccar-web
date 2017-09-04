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

Ext.define('Traccar.view.dialog.Command', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.CommandController'
    ],

    controller: 'command',
    title: Strings.commandTitle,

    items: {
        xtype: 'form',
        listeners: {
            validitychange: 'onValidityChange'
        },
        items: [{
            xtype: 'checkboxfield',
            name: 'textChannel',
            reference: 'textChannelCheckBox',
            inputValue: true,
            uncheckedValue: false,
            fieldLabel: Strings.notificationSms,
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
            listeners: {
                select: 'onSelect'
            }
        }, {
            xtype: 'fieldcontainer',
            reference: 'parameters'
        }]
    },

    buttons: [{
        text: Strings.commandSend,
        reference: 'sendButton',
        handler: 'onSendClick'
    }, {
        text: Strings.sharedCancel,
        handler: 'closeView'
    }]
});
