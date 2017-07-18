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
Ext.define('Traccar.view.edit.ToolbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.toolbarController',

    onAddClick: function () {
        var dialog, objectInstance = Ext.create(this.objectModel);
        objectInstance.store = this.getView().getStore();
        if (objectInstance.store instanceof Ext.data.ChainedStore) {
            objectInstance.store = objectInstance.store.getSource();
        }
        dialog = Ext.create(this.objectDialog);
        dialog.down('form').loadRecord(objectInstance);
        dialog.show();
    },

    onEditClick: function () {
        var dialog, objectInstance = this.getView().getSelectionModel().getSelection()[0];
        dialog = Ext.create(this.objectDialog);
        dialog.down('form').loadRecord(objectInstance);
        dialog.show();
    },

    onRemoveClick: function () {
        var objectInstance = this.getView().getSelectionModel().getSelection()[0];
        Ext.Msg.show({
            title: this.removeTitle,
            message: Strings.sharedRemoveConfirm,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: Strings.sharedRemove,
                no: Strings.sharedCancel
            },
            fn: function (btn) {
                var store = objectInstance.store;
                if (btn === 'yes') {
                    store.remove(objectInstance);
                    store.sync({
                        failure: function (batch) {
                            store.rejectChanges();
                            Traccar.app.showError(batch.exceptions[0].getError().response);
                        }
                    });
                }
            }
        });
    },

    onSelectionChange: function (selection, selected) {
        var disabled = selected.length === 0;
        this.lookupReference('toolbarEditButton').setDisabled(disabled);
        this.lookupReference('toolbarRemoveButton').setDisabled(disabled);
    }
});
