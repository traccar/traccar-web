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
    fields: ['key', 'name', 'svg', 'fillId', 'rotateId', 'scaleId', 'scale'],

    data: [{
        key: 'default',
        name: Strings.categoryDefault,
        svg: document.getElementById('arrowSvg').contentDocument,
        fillId: 'arrow',
        rotateId: 'arrow',
        scaleId: 'arrow',
        scale: 1
    }, {
        key: 'car',
        name: Strings.categoryCar,
        svg: document.getElementById('carSvg').contentDocument,
        fillId: 'path4148',
        rotateId: 'path4148',
        scaleId: 'layer2',
        scale: 1
    }, {
        key: 'bus',
        name: Strings.categoryBus,
        svg: document.getElementById('busSvg').contentDocument,
        fillId: 'path4148',
        rotateId: 'path4148',
        scaleId: 'layer2',
        scale: 1
    }, {
        key: 'truck',
        name: Strings.categoryTruck,
        svg: document.getElementById('truckSvg').contentDocument,
        fillId: 'path4148',
        rotateId: 'path4148',
        scaleId: 'layer2',
        scale: 1
    }]
});