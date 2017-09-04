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

Ext.define('Traccar.view.dialog.CommandController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.command',

    defaultFieldConfig: {
        allowBlank: false
    },

    onSelect: function (selected) {
        var i, config, command, parameters, parameter;
        this.lookupReference('parameters').removeAll();
        command = Ext.getStore('KnownCommands').getById(selected.getValue());
        if (command && command.get('parameters')) {
            parameters = command.get('parameters');
            for (i = 0; i < parameters.length; i++) {
                parameter = new Traccar.model.KnownAttribute(parameters[i]);
                config = Ext.clone(this.defaultFieldConfig);
                config.key = parameter.get('key');
                config.fieldLabel = parameter.get('name');
                switch (parameter.get('valueType')) {
                    case 'number':
                        config.xtype = 'customNumberField';
                        if (parameter.get('allowDecimals') !== undefined) {
                            config.allowDecimals = parameter.get('allowDecimals');
                        } else {
                            config.allowDecimals = true;
                        }
                        config.dataType = parameter.get('dataType');
                        config.maxValue = parameter.get('maxValue');
                        config.minValue = parameter.get('minValue');
                        break;
                    case 'boolean':
                        config.xtype = 'checkboxfield';
                        config.inputValue = true;
                        config.uncheckedValue = false;
                        break;
                    default:
                        if (parameter.get('dataType') && parameter.get('dataType') === 'timezone') {
                            config.xtype = 'combobox';
                            config.queryMode = 'local';
                            config.displayField = 'key';
                            config.editable = false;
                            config.store = 'AllTimezones';
                        } else {
                            config.xtype = 'textfield';
                        }
                }
                this.lookupReference('parameters').add(config);
            }
        }
    },

    onSendClick: function (button) {
        var i, record, form, parameters, attributes = {};

        form = button.up('window').down('form');
        form.updateRecord();
        record = form.getRecord();
        parameters = this.lookupReference('parameters').items.items;

        for (i = 0; i < parameters.length; i++) {
            attributes[parameters[i].key] = parameters[i].getValue();
        }

        record.set('attributes', attributes);

        Ext.Ajax.request({
            scope: this,
            url: 'api/commands',
            jsonData: record.getData(),
            callback: this.onSendResult
        });
    },

    onValidityChange: function (form, valid) {
        this.lookupReference('sendButton').setDisabled(!valid);
    },

    onTextChannelChange: function (checkbox, newValue) {
        var typesStore = this.lookupReference('commandType').getStore();
        typesStore.getProxy().setExtraParam('textChannel', newValue);
        typesStore.reload();
    },

    onSendResult: function (options, success, response) {
        if (success) {
            this.closeView();
            Traccar.app.showToast(Strings.commandSent);
        } else {
            Traccar.app.showError(response);
        }
    }
});
