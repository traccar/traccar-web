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

Ext.define('Traccar.view.CalendarsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.calendars',

    requires: [
        'Traccar.view.CalendarDialog',
        'Traccar.model.Calendar'
    ],

    init: function () {
        Ext.getStore('Calendars').load();
    },

    onAddClick: function () {
        var calendar, dialog;
        calendar = Ext.create('Traccar.model.Calendar');
        calendar.store = this.getView().getStore();
        dialog = Ext.create('Traccar.view.CalendarDialog');
        dialog.down('form').loadRecord(calendar);
        dialog.show();
    },

    onEditClick: function () {
        var calendar, dialog;
        calendar = this.getView().getSelectionModel().getSelection()[0];
        dialog = Ext.create('Traccar.view.CalendarDialog');
        dialog.down('form').loadRecord(calendar);
        dialog.show();
    },

    onRemoveClick: function () {
        var calendar = this.getView().getSelectionModel().getSelection()[0];
        Ext.Msg.show({
            title: Strings.sharedCalendar,
            message: Strings.sharedRemoveConfirm,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: Strings.sharedRemove,
                no: Strings.sharedCancel
            },
            fn: function (btn) {
                var store = Ext.getStore('Calendars');
                if (btn === 'yes') {
                    store.remove(calendar);
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
