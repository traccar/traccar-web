/*
 * Copyright 2016 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.AttributeAliasesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.attributeAliases',

    requires: [
        'Traccar.view.AttributeAliasDialog',
        'Traccar.model.AttributeAlias'
    ],

    init: function () {
        var admin = Traccar.app.getUser().get('admin');
        this.lookupReference('deviceField').setStore(admin ? 'AllDevices' : 'Devices');
        this.lookupReference('toolbarAddButton').setDisabled(true);
        this.lookupReference('toolbarEditButton').setDisabled(true);
        this.lookupReference('toolbarRemoveButton').setDisabled(true);
        this.getView().setStore(Ext.create('Ext.data.ChainedStore', {
            storeId: 'EditorAttributeAliases',
            source: 'AttributeAliases'
        }));
        this.getView().getStore().filter('deviceId', 0);
    },

    onAddClick: function () {
        var attributeAlias, dialog, deviceId;
        attributeAlias = Ext.create('Traccar.model.AttributeAlias');
        attributeAlias.store = Ext.getStore('AttributeAliases');
        deviceId = this.lookupReference('deviceField').getValue();
        attributeAlias.set('deviceId', deviceId);
        dialog = Ext.create('Traccar.view.AttributeAliasDialog');
        dialog.down('form').loadRecord(attributeAlias);
        dialog.show();
    },

    onEditClick: function () {
        var attributeAlias, dialog;
        attributeAlias = this.getView().getSelectionModel().getSelection()[0];
        attributeAlias.store = Ext.getStore('AttributeAliases');
        dialog = Ext.create('Traccar.view.AttributeAliasDialog');
        dialog.down('form').loadRecord(attributeAlias);
        dialog.show();
    },

    onRemoveClick: function () {
        var attributeAlias = this.getView().getSelectionModel().getSelection()[0];
        Ext.Msg.show({
            title: Strings.sharedAttributeAlias,
            message: Strings.sharedRemoveConfirm,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: Strings.sharedRemove,
                no: Strings.sharedCancel
            },
            scope: this,
            fn: function (btn) {
                var store = Ext.getStore('AttributeAliases');
                if (btn === 'yes') {
                    store.remove(attributeAlias);
                    store.sync();
                }
            }
        });
    },

    onSelectionChange: function (selected) {
        var disabled = !this.lookupReference('deviceField').getValue();
        this.lookupReference('toolbarAddButton').setDisabled(disabled);
        disabled = selected.length === 0 || !this.lookupReference('deviceField').getValue();
        this.lookupReference('toolbarEditButton').setDisabled(disabled);
        this.lookupReference('toolbarRemoveButton').setDisabled(disabled);
    },

    onDeviceChange: function (combobox, newValue, oldValue) {
        var admin = Traccar.app.getUser().get('admin');
        this.onSelectionChange('');
        if (newValue !== null) {
            this.getView().getStore().filter('deviceId', newValue);
            if (admin && this.getView().getStore().getCount() === 0) {
                Ext.getStore('AttributeAliases').getProxy().setExtraParam('deviceId', newValue);
                Ext.getStore('AttributeAliases').load({
                    addRecords: true
                });
            }
        } else {
            this.getView().getStore().filter('deviceId', 0);
        }
    }
});
