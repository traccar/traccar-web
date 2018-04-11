/*
 * Copyright 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2018 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.dialog.MaintenanceController', {
    extend: 'Traccar.view.dialog.BaseEditController',
    alias: 'controller.maintenance',

    init: function () {
        this.startConfig = Ext.clone(this.lookupReference('startField').initialConfig);
        this.startConfig.value = 0;
        this.periodConfig = Ext.clone(this.lookupReference('periodField').initialConfig);
        this.periodConfig.value = 0;
        this.lookupReference('saveButton').setDisabled(true);
    },

    onValidityChange: function (form, valid) {
        this.lookupReference('saveButton').setDisabled(!valid);
    },

    onNameChange: function (combobox, newValue) {
        var attribute, startField, periodField, config = {};
        attribute = combobox.getStore().getById(newValue);
        if (attribute) {
            if (attribute.get('allowDecimals') !== undefined) {
                config.allowDecimals = attribute.get('allowDecimals');
            } else {
                config.allowDecimals = true;
            }
            config.dataType = attribute.get('dataType');
            config.maxValue = attribute.get('maxValue');
            config.minValue = attribute.get('minValue');
        }
        startField = this.lookupReference('startField');
        if (startField.dataType !== config.dataType) {
            this.getView().down('fieldset').insert(this.getView().down('fieldset').items.indexOf(startField),
                Ext.merge({}, this.startConfig, config));
            this.getView().down('fieldset').remove(startField);
            this.lookupReference('startField').validate();
        } else {
            startField.setConfig(config);
            startField.validate();
        }

        periodField = this.lookupReference('periodField');
        if (periodField.dataType !== config.dataType) {
            this.getView().down('fieldset').insert(this.getView().down('fieldset').items.indexOf(periodField),
                Ext.merge({}, this.periodConfig, config));
            this.getView().down('fieldset').remove(periodField);
            this.lookupReference('periodField').validate();
        } else {
            periodField.setConfig(config);
            periodField.validate();
        }
    }
});
