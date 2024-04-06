/*
 * Copyright 2016 - 2018 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.dialog.AttributeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.attribute',

    onSaveClick: function (button) {
        var dialog, store, record;
        dialog = button.up('window').down('form');
        dialog.updateRecord();
        record = dialog.getRecord();
        store = record.store;
        if (store) {
            if (record.phantom) {
                store.add(record);
            }
            store.sync({
                failure: function (batch) {
                    store.rejectChanges();
                    Traccar.app.showError(batch.exceptions[0].getError().response);
                }
            });
        } else {
            record.save();
        }
        button.up('window').close();
    },

    onValidityChange: function (form, valid) {
        this.lookupReference('saveButton').setDisabled(!valid);
    },

    defaultFieldConfig: {
        name: 'value',
        reference: 'valueField',
        allowBlank: false,
        fieldLabel: Strings.stateValue
    },

    onNameChange: function (combobox, newValue) {
        var config, attribute, valueField = this.lookupReference('valueField');
        attribute = combobox.getStore().getById(newValue);
        if (attribute) {
            config = Ext.clone(this.defaultFieldConfig);
            switch (attribute.get('valueType')) {
                case 'number':
                    config.xtype = 'customNumberField';
                    if (attribute.get('allowDecimals') !== undefined) {
                        config.allowDecimals = attribute.get('allowDecimals');
                    } else {
                        config.allowDecimals = true;
                    }
                    config.dataType = attribute.get('dataType');
                    config.maxValue = attribute.get('maxValue');
                    config.minValue = attribute.get('minValue');
                    break;
                case 'boolean':
                    config.xtype = 'checkboxfield';
                    config.inputValue = true;
                    config.uncheckedValue = false;
                    break;
                case 'color':
                    config.xtype = 'customcolorpicker';
                    break;
                default:
                    if (attribute.get('dataType')) {
                        config.xtype = 'combobox';
                        config.queryMode = 'local';
                        config.editable = false;
                        switch (attribute.get('dataType')) {
                            case 'distanceUnit':
                                config.store = 'DistanceUnits';
                                config.displayField = 'name';
                                config.valueField = 'key';
                                break;
                            case 'speedUnit':
                                config.store = 'SpeedUnits';
                                config.displayField = 'name';
                                config.valueField = 'key';
                                break;
                            case 'volumeUnit':
                                config.store = 'VolumeUnits';
                                config.displayField = 'fullName';
                                config.valueField = 'key';
                                break;
                            case 'timezone':
                                config.store = 'AllTimezones';
                                config.displayField = 'key';
                                break;
                            default:
                                break;
                        }
                    } else {
                        config.xtype = 'textfield';
                    }
                    break;
            }
            if (valueField.getXType() !== config.xtype ||
                    config.xtype === 'customNumberField' && valueField.dataType !== config.dataType) {
                this.getView().down('form').insert(this.getView().down('form').items.indexOf(valueField), config);
                this.getView().down('form').remove(valueField);
            } else if (config.xtype === 'customNumberField') {
                valueField.setConfig(config);
                valueField.validate();
            } else if (config.xtype === 'combobox') {
                valueField.setConfig(config);
                valueField.setValue();
            }
        }
    }
});
