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

Ext.define('Traccar.view.AttributeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.attributeDialog',

    onSaveClick: function (button) {
        var dialog, store, record;
        dialog = button.up('window').down('form');
        dialog.updateRecord();
        record = dialog.getRecord();
        store = record.store;
        if (store) {
            if (record.phantom) {
                store.add(record);
            }
            store.sync({
                failure: function (batch) {
                    store.rejectChanges();
                    Traccar.app.showError(batch.exceptions[0].getError().response);
                }
            });
        } else {
            record.save();
        }
        button.up('window').close();
    }
});
