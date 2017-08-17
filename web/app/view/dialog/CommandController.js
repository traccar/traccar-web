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

    onSelect: function (selected) {
        this.lookupReference('paramPositionPeriodic').setHidden(
            selected.getValue() !== 'positionPeriodic');
        this.lookupReference('paramOutputControl').setHidden(
            selected.getValue() !== 'outputControl');
        this.lookupReference('paramSendSmsUssd').setHidden(
            selected.getValue() !== 'sendSms' && selected.getValue() !== 'sendUssd');
        this.lookupReference('paramSmsMessage').setHidden(
            selected.getValue() !== 'sendSms');
        this.lookupReference('paramSetTimezone').setHidden(
            selected.getValue() !== 'setTimezone');
        this.lookupReference('paramSetIndicator').setHidden(
            selected.getValue() !== 'setIndicator');
        this.lookupReference('paramCustom').setHidden(
            selected.getValue() !== 'custom');
    },

    onSendClick: function (button) {
        var attributes, value, record, form, index, phone;

        form = button.up('window').down('form');
        form.updateRecord();
        record = form.getRecord();

        switch (record.get('type')) {
            case 'positionPeriodic':
                attributes = this.lookupReference('paramPositionPeriodic');
                value = attributes.down('numberfield[name="frequency"]').getValue();
                value *= attributes.down('combobox[name="unit"]').getValue();
                record.set('attributes', {
                    frequency: value
                });
                break;
            case 'outputControl':
                attributes = this.lookupReference('paramOutputControl');
                index = attributes.down('numberfield[name="index"]').getValue();
                value = attributes.down('textfield[name="data"]').getValue();
                record.set('attributes', {
                    index: index,
                    data: value
                });
                break;
            case 'sendUssd':
                attributes = this.lookupReference('paramSendSmsUssd');
                phone = attributes.down('textfield[name="phone"]').getValue();
                record.set('attributes', {
                    phone: phone
                });
                break;
            case 'sendSms':
                attributes = this.lookupReference('paramSendSmsUssd');
                phone = attributes.down('textfield[name="phone"]').getValue();
                value = attributes.down('textfield[name="message"]').getValue();
                record.set('attributes', {
                    phone: phone,
                    message: value
                });
                break;
            case 'setTimezone':
                attributes = this.lookupReference('paramSetTimezone');
                value = attributes.down('numberfield[name="timezone"]').getValue();
                record.set('attributes', {
                    timezone: value * 3600
                });
                break;
            case 'setIndicator':
                attributes = this.lookupReference('paramSetIndicator');
                value = attributes.down('numberfield[name="data"]').getValue();
                record.set('attributes', {
                    data: value
                });
                break;
            case 'custom':
                value = this.lookupReference('paramCustom').getValue();
                record.set('attributes', {
                    data: value
                });
                break;
            default:
                break;
        }

        Ext.Ajax.request({
            scope: this,
            url: 'api/commands',
            jsonData: record.getData(),
            callback: this.onSendResult
        });
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
