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

Ext.define('Traccar.view.dialog.SavedCommand', {
    extend: 'Traccar.view.dialog.BaseEdit',

    requires: [
        'Traccar.view.dialog.SavedCommandController',
        'Traccar.view.UnescapedTextField'
    ],

    controller: 'savedCommand',
    title: Strings.sharedSavedCommand,

    items: [{
        xtype: 'form',
        listeners: {
            validitychange: 'onValidityChange'
        },
        items: [{
            xtype: 'fieldset',
            title: Strings.sharedRequired,
            items: [{
                xtype: 'unescapedTextField',
                name: 'description',
                fieldLabel: Strings.sharedDescription
            }, {
                xtype: 'checkboxfield',
                name: 'textChannel',
                inputValue: true,
                uncheckedValue: false,
                fieldLabel: Strings.commandSendSms
            }, {
                xtype: 'combobox',
                name: 'type',
                reference: 'commandType',
                fieldLabel: Strings.sharedType,
                store: 'AllCommandTypes',
                queryMode: 'local',
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
        glyph: 'xf00c@FontAwesome',
        reference: 'saveButton',
        tooltip: Strings.sharedSave,
        tooltipType: 'title',
        minWidth: 0,
        disabled: true,
        handler: 'onSaveClick'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedCancel,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
