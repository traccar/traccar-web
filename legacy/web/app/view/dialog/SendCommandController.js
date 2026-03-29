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

Ext.define('Traccar.view.dialog.SendCommandController', {
    extend: 'Traccar.view.dialog.SavedCommandController',
    alias: 'controller.sendCommand',

    requires: [
        'Traccar.view.permissions.SavedCommands'
    ],

    onSendClick: function (button) {
        var record;
        this.fillAttributes(button);
        record = button.up('window').down('form').getRecord();

        Ext.Ajax.request({
            scope: this,
            url: 'api/commands/send',
            jsonData: record.getData(),
            callback: this.onSendResult
        });
    },

    onValidityChange: function (form, valid) {
        this.lookupReference('sendButton').setDisabled(!valid ||
                this.lookupReference('commandsComboBox').getValue() === null);
    },

    onTextChannelChange: function (checkbox, newValue) {
        var typesStore = this.lookupReference('commandType').getStore();
        typesStore.getProxy().setExtraParam('textChannel', newValue);
        typesStore.reload();
    },

    onCommandSelect: function (selected) {
        var record, form, command = selected.getStore().getById(selected.getValue());
        command.set('deviceId', this.getView().deviceId);
        form = selected.up('window').down('form');
        record = form.getRecord();
        form.loadRecord(command);
        if (record && command.get('type') === record.get('type')) {
            this.onTypeChange(this.lookupReference('commandType'), command.get('type'));
        }

        this.lookupReference('newCommandFields').setDisabled(command.getId() !== 0);
        this.lookupReference('sendButton').setDisabled(command.getId() === 0);
    },

    onSendResult: function (options, success, response) {
        if (success) {
            this.closeView();
            Traccar.app.showToast(response.status === 202 ? Strings.commandQueued : Strings.commandSent);
        } else {
            Traccar.app.showError(response);
        }
    },

    closeView: function () {
        this.lookupReference('commandsComboBox').getStore().removeAll();
        this.callParent(arguments);
    }
});
