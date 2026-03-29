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

Ext.define('Traccar.view.dialog.SavedCommandController', {
    extend: 'Traccar.view.dialog.BaseEditController',
    alias: 'controller.savedCommand',

    defaultFieldConfig: {
        allowBlank: false
    },

    onTypeChange: function (combo, newValue) {
        var i, config, command, parameters, parameter, record;
        record = combo.up('window').down('form').getRecord();
        this.lookupReference('parameters').removeAll();
        command = Ext.getStore('KnownCommands').getById(newValue);
        if (command && command.get('parameters')) {
            parameters = command.get('parameters');
            for (i = 0; i < parameters.length; i++) {
                parameter = new Traccar.model.KnownAttribute(parameters[i]);
                config = Ext.clone(this.defaultFieldConfig);
                config.key = parameter.get('key');
                config.fieldLabel = parameter.get('name');
                if (record.get('attributes')) {
                    config.value = record.get('attributes')[parameter.get('key')];
                }
                config.disabled = combo.isDisabled();
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
                        if (parameter.get('dataType') === 'timezone') {
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

    fillAttributes: function (button) {
        var i, form, record, parameters, attributes = {};

        form = button.up('window').down('form');
        form.updateRecord();
        record = form.getRecord();
        parameters = this.lookupReference('parameters').items.items;

        for (i = 0; i < parameters.length; i++) {
            attributes[parameters[i].key] = parameters[i].getValue();
        }

        record.set('attributes', attributes);
    },

    onSaveClick: function (button) {
        this.fillAttributes(button);
        this.callParent(arguments);
    },

    onValidityChange: function (form, valid) {
        this.lookupReference('saveButton').setDisabled(!valid);
    }

});
