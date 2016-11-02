/*
 * Copyright 2016 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.GroupsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.groups',

    requires: [
        'Traccar.view.GroupDialog',
        'Traccar.view.GroupGeofences',
        'Traccar.view.BaseWindow',
        'Traccar.model.Group'
    ],

    onAddClick: function () {
        var group, dialog;
        group = Ext.create('Traccar.model.Group');
        group.store = this.getView().getStore();
        dialog = Ext.create('Traccar.view.GroupDialog');
        dialog.down('form').loadRecord(group);
        dialog.show();
    },

    onEditClick: function () {
        var group, dialog;
        group = this.getView().getSelectionModel().getSelection()[0];
        dialog = Ext.create('Traccar.view.GroupDialog');
        dialog.down('form').loadRecord(group);
        dialog.show();
    },

    onRemoveClick: function () {
        var group = this.getView().getSelectionModel().getSelection()[0];
        Ext.Msg.show({
            title: Strings.groupDialog,
            message: Strings.sharedRemoveConfirm,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: Strings.sharedRemove,
                no: Strings.sharedCancel
            },
            fn: function (btn) {
                var store = Ext.getStore('Groups');
                if (btn === 'yes') {
                    store.remove(group);
                    store.sync();
                }
            }
        });
    },

    onGeofencesClick: function () {
        var admin, group;
        admin = Traccar.app.getUser().get('admin');
        group = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedGeofences,
            items: {
                xtype: 'groupGeofencesView',
                baseObjectName: 'groupId',
                linkObjectName: 'geofenceId',
                storeName: admin ? 'AllGeofences' : 'Geofences',
                urlApi: 'api/groups/geofences',
                baseObject: group.getId()
            }
        }).show();
    },

    onSelectionChange: function (selected) {
        var disabled = selected.length > 0;
        this.lookupReference('toolbarEditButton').setDisabled(disabled);
        this.lookupReference('toolbarRemoveButton').setDisabled(disabled);
        this.lookupReference('toolbarGeofencesButton').setDisabled(disabled);
    }
});
