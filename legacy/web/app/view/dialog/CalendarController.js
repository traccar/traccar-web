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

Ext.define('Traccar.view.dialog.CalendarController', {
    extend: 'Traccar.view.dialog.BaseEditController',
    alias: 'controller.calendar',

    onFileChange: function (fileField) {
        var reader;
        if (fileField.fileInputEl.dom.files.length > 0) {
            reader = new FileReader();
            reader.onload = function (event) {
                fileField.up('window').lookupReference('dataField').setValue(
                    event.target.result.substr(event.target.result.indexOf(',') + 1));
            };
            reader.onerror = function (event) {
                Traccar.app.showError(event.target.error);
            };
            reader.readAsDataURL(fileField.fileInputEl.dom.files[0]);
        }
    }
});
