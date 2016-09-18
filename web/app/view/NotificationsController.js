/*
 * Copyright 2016 Anton Tananaev (anton.tananaev@gmail.com)
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

Ext.define('Traccar.view.NotificationsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.notificationsController',

    requires: [
        'Traccar.store.Notifications'
    ],

    init: function () {
        this.userId = this.getView().user.getId();
        this.getView().getStore().load({
            scope: this,
            callback: function (records, operation, success) {
                var notificationsStore = Ext.create('Traccar.store.Notifications');
                notificationsStore.load({
                    params: {
                        userId: this.userId
                    },
                    scope: this,
                    callback: function (records, operation, success) {
                        var i, index, attributes, storeRecord;
                        if (success) {
                            for (i = 0; i < records.length; i++) {
                                index = this.getView().getStore().findExact('type', records[i].get('type'));
                                attributes = records[i].get('attributes');
                                storeRecord = this.getView().getStore().getAt(index);
                                storeRecord.set('attributes', attributes);
                                storeRecord.commit();
                            }
                        }
                    }
                });
            }
        });
    },

    onBeforeCheckChange: function (column, rowIndex, checked, eOpts) {
        var fields, record, data;
        fields = column.dataIndex.split('\.', 2);
        record = this.getView().getStore().getAt(rowIndex);
        data = record.get(fields[0]);
        if (!data[fields[1]]) {
            data[fields[1]] = 'true';
        } else {
            delete data[fields[1]];
        }
        record.set(fields[0], data);
        record.commit();
    },

    onCheckChange: function (column, rowIndex, checked, eOpts) {
        var record = this.getView().getStore().getAt(rowIndex);
        Ext.Ajax.request({
            scope: this,
            url: 'api/users/notifications',
            jsonData: {
                userId: this.userId,
                type: record.get('type'),
                attributes: record.get('attributes')
            },
            callback: function (options, success, response) {
                if (!success) {
                    Traccar.app.showError(response);
                }
            }
        });
    }
});
