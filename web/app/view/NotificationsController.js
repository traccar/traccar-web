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

    init: function () {
        this.getView().getStore().load({
            params: {
                userId: this.getView().user.getId()
            }
        });
    },

    onCheckChange: function (column, rowIndex) {
        var record = this.getView().getStore().getAt(rowIndex);
        Ext.Ajax.request({
            scope: this,
            url: 'api/users/notifications',
            jsonData: record.data,
            callback: function (options, success, response) {
                if (!success) {
                    Traccar.app.showError(response);
                }
            }
        });
    }
});
