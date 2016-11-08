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
    fields: ['key', 'name', 'url', 'svg', 'fillId', 'rotateId', 'scale'],

    data: [{
        key: 'default',
        name: Strings.categoryDefault,
        svg: document.getElementById('arrowSvg').contentDocument,
        rotateId: 'arrow',
        fillId: 'arrow',
        scale: 1
    }, {
        key: 'car',
        name: Strings.categoryCar,
        svg: document.getElementById('carSvg').contentDocument,
        fillId: 'path4149',
        rotateId: 'g4207',
        scale: 0.06,
    }, {
        key: 'bus',
        name: Strings.categoryBus,
        svg: document.getElementById('busSvg').contentDocument,
        fillId: 'path4713',
        rotateId: 'layer2',
        scale: 0.12,
    }, {
        key: 'truck',
        name: Strings.categoryTruck,
        svg: document.getElementById('truckSvg').contentDocument,
        fillId: 'path4718',
        rotateId: 'layer2',
        scale: 0.1,
    }]
});