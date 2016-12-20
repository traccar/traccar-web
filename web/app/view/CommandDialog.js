/*
 * Copyright 2015 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.CommandDialog', {
    extend: 'Traccar.view.BaseDialog',

    requires: [
        'Traccar.view.CommandDialogController'
    ],

    controller: 'commandDialog',
    title: Strings.commandTitle,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'combobox',
            name: 'type',
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
            reference: 'paramPositionPeriodic',
            name: 'attributes',
            hidden: true,

            items: [{
                xtype: 'numberfield',
                fieldLabel: Strings.commandFrequency,
                name: 'frequency'
            }, {
                xtype: 'combobox',
                fieldLabel: Strings.commandUnit,
                name: 'unit',
                store: 'TimeUnits',
                displayField: 'name',
                valueField: 'factor'
            }]
        }, {
            xtype: 'fieldcontainer',
            reference: 'paramOutputControl',
            name: 'attributes',
            hidden: true,

            items: [{
                xtype: 'numberfield',
                fieldLabel: Strings.commandIndex,
                name: 'index',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: Strings.commandData,
                name: 'data'
            }]
        }, {
            xtype: 'fieldcontainer',
            reference: 'paramSendSmsUssd',
            name: 'attributes',
            hidden: true,

            items: [{
                xtype: 'textfield',
                fieldLabel: Strings.commandPhone,
                name: 'phone'
            }, {
                xtype: 'textfield',
                reference: 'paramSmsMessage',
                fieldLabel: Strings.commandMessage,
                name: 'message',
                hidden: true
            }]
        }, {
            xtype: 'fieldcontainer',
            reference: 'paramSetTimezone',
            name: 'attributes',
            hidden: true,

            items: [{
                xtype: 'numberfield',
                fieldLabel: Strings.commandTimezone,
                name: 'timezone',
                minValue: -12,
                step: 0.5,
                maxValue: +14
            }]
        }, {
            xtype: 'fieldcontainer',
            reference: 'paramSetIndicator',
            name: 'attributes',
            hidden: true,

            items: [{
                xtype: 'numberfield',
                fieldLabel: Strings.commandData,
                name: 'data',
                minValue: 0,
                maxValue: 99
            }]
        }, {
            xtype: 'textfield',
            reference: 'paramCustom',
            fieldLabel: Strings.commandCustom,
            name: 'customCommand',
            hidden: true,
            allowBlank: false
        }]
    },

    buttons: [{
        text: Strings.commandSend,
        handler: 'onSendClick'
    }, {
        text: Strings.sharedCancel,
        handler: 'closeView'
    }]
});
