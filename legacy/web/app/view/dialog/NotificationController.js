/*
 * Copyright 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2018 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.dialog.NotificationController', {
    extend: 'Traccar.view.dialog.BaseEditController',
    alias: 'controller.notification',

    init: function () {
        this.lookupReference('calendarCombo').setHidden(
            Traccar.app.getBooleanAttributePreference('ui.disableCalendars'));
    },

    onTypeChange: function (view, value) {
        this.lookupReference('alarmsField').setHidden(value !== 'alarm');
    },

    onAlarmsLoad: function (view) {
        var attributes, record = view.up('form').getRecord();
        attributes = record.get('attributes') || {};
        if (attributes['alarms']) {
            view.suspendEvents(false);
            view.setValue(attributes['alarms'].split(','));
            view.resumeEvents();
        }
    },

    onAlarmsChange: function (view, value) {
        var attributes, record = view.up('window').down('form').getRecord();
        attributes = record.get('attributes') || {};

        value = value.join();
        if (attributes['alarms'] !== value) {
            attributes['alarms'] = value;
            record.set('attributes', attributes);
            record.dirty = true;
        }
    }
});
