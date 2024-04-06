/*
 * Copyright 2016 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 Andrey Kunitsyn (andrey@traccar.org)
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
Ext.define('Traccar.store.DeviceImages', {
    extend: 'Ext.data.Store',
    fields: ['key', 'name', 'svg', 'fillId', 'rotateId', 'scaleId'],

    data: (function () {
        var i, key, data = [];
        for (i = 0; i < window.Images.length; i++) {
            key = window.Images[i];
            data.push({
                key: key,
                name: Strings['category' + key.charAt(0).toUpperCase() + key.slice(1)],
                svg: document.getElementById(key + 'Svg').contentDocument,
                fillId: key === 'arrow' ? 'arrow' : 'background',
                rotateId: key === 'arrow' ? 'arrow' : 'background',
                scaleId: key === 'arrow' ? 'arrow' : 'layer1'
            });
        }
        return data;
    })()
});
