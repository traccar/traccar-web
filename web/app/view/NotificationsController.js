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
                Ext.create('Traccar.store.Notifications').load({
                    params: {
                        userId: this.userId
                    },
                    scope: this,
                    callback: function (records, operation, success) {
                        if (success) {
                            this.getView().getStore().loadData(records);
                        }
                    }
                });
            }
        });
    },

    onCheckChange: function (column, rowIndex, checked, eOpts) {
        var record, attributes = {};
        record = this.getView().getStore().getAt(rowIndex);
        if (record.get('attributes.web')) {
            attributes.web = 'true';
        }
        if (record.get('attributes.mail')) {
            attributes.mail = 'true';
        }
        Ext.Ajax.request({
            scope: this,
            url: 'api/users/notifications',
            jsonData: {
                userId: this.userId,
                type: record.get('type'),
                attributes: attributes
            },
            callback: function (options, success, response) {
                if (!success) {
                    Traccar.app.showError(response);
                }
            }
        });
    }
});
