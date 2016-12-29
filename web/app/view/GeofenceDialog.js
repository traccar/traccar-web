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

Ext.define('Traccar.view.GeofenceDialog', {
    extend: 'Traccar.view.BaseEditDialog',

    requires: [
        'Traccar.view.GeofenceDialogController'
    ],

    controller: 'geofenceDialog',
    title: Strings.sharedGeofence,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'textfield',
            name: 'name',
            fieldLabel: Strings.sharedName
        }, {
            xtype: 'textfield',
            name: 'description',
            fieldLabel: Strings.sharedDescription
        }, {
            xtype: 'combobox',
            name: 'calendarId',
            store: 'Calendars',
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            fieldLabel: Strings.sharedCalendar
        }, {
            xtype: 'hiddenfield',
            name: 'area',
            allowBlank: false,
            reference: 'areaField'
        }]
    },

    buttons: [{
        text: Strings.sharedArea,
        glyph: 'xf21d@FontAwesome',
        handler: 'onAreaClick'
    }, {
        text: Strings.sharedAttributes,
        handler: 'showAttributesView'
    }, {
        xtype: 'tbfill'
    }, {
        glyph: 'xf00c@FontAwesome',
        tooltip: Strings.sharedSave,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'onSaveClick'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedCancel,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
