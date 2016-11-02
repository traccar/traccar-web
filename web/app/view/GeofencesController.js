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

Ext.define('Traccar.view.GeofencesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.geofences',

    requires: [
        'Traccar.view.GeofenceDialog',
        'Traccar.model.Geofence'
    ],

    init: function () {
        Ext.getStore('Geofences').load();
    },

    onAddClick: function () {
        var geofence, dialog;
        geofence = Ext.create('Traccar.model.Geofence');
        geofence.store = this.getView().getStore();
        dialog = Ext.create('Traccar.view.GeofenceDialog');
        dialog.down('form').loadRecord(geofence);
        dialog.show();
    },

    onEditClick: function () {
        var geofence, dialog;
        geofence = this.getView().getSelectionModel().getSelection()[0];
        dialog = Ext.create('Traccar.view.GeofenceDialog');
        dialog.down('form').loadRecord(geofence);
        dialog.show();
    },

    onRemoveClick: function () {
        var geofence = this.getView().getSelectionModel().getSelection()[0];
        Ext.Msg.show({
            title: Strings.sharedGeofence,
            message: Strings.sharedRemoveConfirm,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: Strings.sharedRemove,
                no: Strings.sharedCancel
            },
            fn: function (btn) {
                var store = Ext.getStore('Geofences');
                if (btn === 'yes') {
                    store.remove(geofence);
                    store.sync();
                }
            }
        });
    },

    onSelectionChange: function (selected) {
        var disabled = selected.length > 0;
        this.lookupReference('toolbarEditButton').setDisabled(disabled);
        this.lookupReference('toolbarRemoveButton').setDisabled(disabled);
    }
});
