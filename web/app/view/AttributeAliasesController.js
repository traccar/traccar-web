/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 - 2017 Andrey Kunitsyn (andrey@traccar.org)
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
    extend: 'Traccar.view.EditToolbarController',
    alias: 'controller.attributeAliases',

    requires: [
        'Traccar.view.AttributeAliasDialog',
        'Traccar.model.AttributeAlias'
    ],

    objectModel: 'Traccar.model.AttributeAlias',
    objectDialog: 'Traccar.view.AttributeAliasDialog',
    removeTitle: Strings.sharedAttributeAlias,

    init: function () {
        var manager = Traccar.app.getUser().get('admin') || Traccar.app.getUser().get('userLimit') > 0;
        this.lookupReference('deviceField').setStore(manager ? 'AllDevices' : 'Devices');
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

    onSelectionChange: function (selected) {
        var disabled = !this.lookupReference('deviceField').getValue();
        this.lookupReference('toolbarAddButton').setDisabled(disabled);
        disabled = selected.length === 0 || !this.lookupReference('deviceField').getValue();
        this.lookupReference('toolbarEditButton').setDisabled(disabled);
        this.lookupReference('toolbarRemoveButton').setDisabled(disabled);
    },

    onDeviceChange: function (combobox, newValue, oldValue) {
        var manager = Traccar.app.getUser().get('admin') || Traccar.app.getUser().get('userLimit') > 0;
        this.onSelectionChange('');
        if (newValue !== null) {
            this.getView().getStore().filter('deviceId', newValue);
            if (manager && this.getView().getStore().getCount() === 0) {
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
