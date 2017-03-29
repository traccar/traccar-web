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

Ext.define('Traccar.view.edit.AttributesController', {
    extend: 'Traccar.view.edit.ToolbarController',
    alias: 'controller.attributes',

    requires: [
        'Traccar.view.dialog.Attribute',
        'Traccar.store.Attributes',
        'Traccar.model.Attribute'
    ],

    objectModel: 'Traccar.model.Attribute',
    objectDialog: 'Traccar.view.dialog.Attribute',
    removeTitle: Strings.stateName,

    init: function () {
        var store, propertyName, i = 0, attributes;
        store = Ext.create('Traccar.store.Attributes');
        store.setProxy(Ext.create('Ext.data.proxy.Memory'));
        if (typeof this.getView().record.get('attributes') === 'undefined') {
            this.getView().record.set('attributes', {});
        }
        attributes = this.getView().record.get('attributes');
        for (propertyName in attributes) {
            if (attributes.hasOwnProperty(propertyName)) {
                store.add(Ext.create('Traccar.model.Attribute', {
                    priority: i++,
                    name: propertyName,
                    value: this.getView().record.get('attributes')[propertyName]
                }));
            }
        }
        store.addListener('add', function (store, records, index, eOpts) {
            var i;
            for (i = 0; i < records.length; i++) {
                this.getView().record.get('attributes')[records[i].get('name')] = records[i].get('value');
            }
            this.getView().record.dirty = true;
        }, this);
        store.addListener('update', function (store, record, operation, modifiedFieldNames, details, eOpts) {
            if (operation === Ext.data.Model.EDIT) {
                if (record.modified.name !== record.get('name')) {
                    delete this.getView().record.get('attributes')[record.modified.name];
                }
                this.getView().record.get('attributes')[record.get('name')] = record.get('value');
                this.getView().record.dirty = true;
            }
        }, this);
        store.addListener('remove', function (store, records, index, isMove, eOpts) {
            var i;
            for (i = 0; i < records.length; i++) {
                delete this.getView().record.get('attributes')[records[i].get('name')];
            }
            this.getView().record.dirty = true;
        }, this);

        this.getView().setStore(store);
    }
});
