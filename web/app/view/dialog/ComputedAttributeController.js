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

Ext.define('Traccar.view.dialog.ComputedAttributeController', {
    extend: 'Traccar.view.dialog.BaseEditController',
    alias: 'controller.computedAttribute',

    requires: [
        'Traccar.view.dialog.SelectDevice'
    ],

    onAttributeChange: function (combobox, newValue) {
        var attribute = Ext.getStore('PositionAttributes').getById(newValue);
        if (attribute) {
            this.getView().lookupReference('typeComboField').setValue(attribute.get('valueType'));
            this.getView().lookupReference('typeComboField').setReadOnly(true);
        } else {
            this.getView().lookupReference('typeComboField').setReadOnly(false);
        }
    },

    onCheckClick: function (button) {
        var dialog, form;
        dialog = Ext.create('Traccar.view.dialog.SelectDevice');
        form = button.up('window').down('form');
        form.updateRecord();
        dialog.record = form.getRecord();
        dialog.show();
    }
});
