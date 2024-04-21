/*
 * Copyright 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2017 Andrey Kunitsyn (andrey@traccar.org)
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
Ext.define('Traccar.store.AttributeValueTypes', {
    extend: 'Ext.data.Store',
    fields: ['id', 'name'],
    proxy: 'memory',

    data: [{
        id: 'string',
        name: Strings.sharedTypeString
    }, {
        id: 'number',
        name: Strings.sharedTypeNumber
    }, {
        id: 'boolean',
        name: Strings.sharedTypeBoolean
    }]
});
