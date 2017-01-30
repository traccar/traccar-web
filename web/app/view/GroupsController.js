/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
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
    extend: 'Traccar.view.EditToolbarController',
    alias: 'controller.groups',

    requires: [
        'Traccar.view.GroupDialog',
        'Traccar.view.GroupGeofences',
        'Traccar.view.BaseWindow',
        'Traccar.model.Group'
    ],

    objectModel: 'Traccar.model.Group',
    objectDialog: 'Traccar.view.GroupDialog',
    removeTitle: Strings.groupDialog,

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
        this.lookupReference('toolbarGeofencesButton').setDisabled(disabled);
        this.callParent(arguments);
    }
});
