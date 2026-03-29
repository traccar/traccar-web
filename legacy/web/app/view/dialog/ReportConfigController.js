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

Ext.define('Traccar.view.dialog.ReportConfigController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reportConfig',

    requires: [
        'Traccar.store.ReportEventTypes',
        'Traccar.store.AllNotifications'
    ],

    onSaveClick: function (button) {
        var eventType, callingPanel;
        callingPanel = this.getView().callingPanel;

        callingPanel.deviceId = this.lookupReference('deviceField').getValue();
        callingPanel.groupId = this.lookupReference('groupField').getValue();
        eventType = this.lookupReference('eventTypeField').getValue();
        if (eventType.indexOf(Traccar.store.ReportEventTypes.allEvents) > -1) {
            eventType = [Traccar.store.ReportEventTypes.allEvents];
        } else if (eventType.length === this.lookupReference('eventTypeField').getStore().getCount() - 1) {
            eventType = [Traccar.store.ReportEventTypes.allEvents];
        }
        callingPanel.eventType = eventType;
        callingPanel.chartType = this.lookupReference('chartTypeField').getValue();
        callingPanel.showMarkers = this.lookupReference('showMarkersField').getValue();
        callingPanel.fromDate = this.lookupReference('fromDateField').getValue();
        callingPanel.fromTime = this.lookupReference('fromTimeField').getValue();
        callingPanel.toDate = this.lookupReference('toDateField').getValue();
        callingPanel.toTime = this.lookupReference('toTimeField').getValue();
        callingPanel.period = this.lookupReference('periodField').getValue();
        callingPanel.updateButtons();
        button.up('window').close();
    },

    onPeriodChange: function (combobox, newValue) {
        var day, first, from, to, custom = newValue === 'custom';
        this.lookupReference('fromContainer').setHidden(!custom);
        this.lookupReference('toContainer').setHidden(!custom);
        if (!custom) {
            from = new Date();
            to = new Date();
            switch (newValue) {
                case 'today':
                    to.setDate(to.getDate() + 1);
                    break;
                case 'yesterday':
                    from.setDate(to.getDate() - 1);
                    break;
                case 'thisWeek':
                    day = from.getDay();
                    first = from.getDate() - day + (day === 0 ? -6 : 1);
                    from.setDate(first);
                    to.setDate(first + 7);
                    break;
                case 'previousWeek':
                    day = from.getDay();
                    first = from.getDate() - day + (day === 0 ? -6 : 1);
                    from.setDate(first - 7);
                    to.setDate(first);
                    break;
                case 'thisMonth':
                    from.setDate(1);
                    to.setDate(1);
                    to.setMonth(from.getMonth() + 1);
                    break;
                case 'previousMonth':
                    from.setDate(1);
                    from.setMonth(from.getMonth() - 1);
                    to.setDate(1);
                    break;
                default:
                    break;
            }
            from.setHours(0, 0, 0, 0);
            to.setHours(0, 0, 0, 0);
            this.lookupReference('fromDateField').setValue(from);
            this.lookupReference('fromTimeField').setValue(from);
            this.lookupReference('toDateField').setValue(to);
            this.lookupReference('toTimeField').setValue(to);
        }
    }
});
