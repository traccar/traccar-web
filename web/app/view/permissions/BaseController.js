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

Ext.define('Traccar.view.permissions.BaseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.base',

    init: function () {
        var params = {}, linkStoreName, storeName;
        params[this.getView().baseObjectName] = this.getView().baseObject;
        linkStoreName = this.getView().linkStoreName;
        storeName = this.getView().storeName;
        linkStoreName = typeof linkStoreName === 'undefined' ? storeName : linkStoreName;
        this.getView().setStore(Ext.getStore(storeName));
        this.getView().getStore().load({
            scope: this,
            callback: function () {
                var linkStore = Ext.create('Traccar.store.' + linkStoreName);
                linkStore.load({
                    params: params,
                    scope: this,
                    callback: function (records, operation, success) {
                        var i, index;
                        if (success) {
                            for (i = 0; i < records.length; i++) {
                                index = this.getView().getStore().getById(records[i].getId());
                                this.getView().getSelectionModel().select(index, true, true);
                            }
                        }
                    }
                });
            }
        });
    },

    onBeforeSelect: function (selection, record) {
        var data = {};
        data[this.getView().baseObjectName] = this.getView().baseObject;
        data[this.getView().linkObjectName] = record.getId();
        Ext.Ajax.request({
            scope: this,
            url: 'api/permissions',
            jsonData: Ext.util.JSON.encode(data),
            callback: function (options, success, response) {
                if (!success) {
                    selection.deselect(record, true);
                    Traccar.app.showError(response);
                }
            }
        });
    },

    onBeforeDeselect: function (selection, record) {
        var data = {};
        data[this.getView().baseObjectName] = this.getView().baseObject;
        data[this.getView().linkObjectName] = record.getId();
        Ext.Ajax.request({
            scope: this,
            method: 'DELETE',
            url: 'api/permissions',
            jsonData: Ext.util.JSON.encode(data),
            callback: function (options, success, response) {
                if (!success) {
                    selection.select(record, true, true);
                    Traccar.app.showError(response);
                }
            }
        });
    }
});
