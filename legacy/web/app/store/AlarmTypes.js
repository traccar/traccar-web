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
Ext.define('Traccar.store.AlarmTypes', {
    extend: 'Ext.data.Store',
    fields: ['key', 'name'],

    data: (function () {
        var key, items = [];
        for (key in Strings) {
            if (Strings.hasOwnProperty(key) && key.lastIndexOf('alarm', 0) === 0) {
                items.push({
                    key: key.charAt(5).toLowerCase() + key.slice(6),
                    name: Strings[key]
                });
            }
        }
        return items;
    })()
});
