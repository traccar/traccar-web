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
        key: 'route',
        name: Strings.categoryRoute,
        svg: document.getElementById('routeSvg').contentDocument,
        fillId: 'arrow',
        rotateId: 'arrow',
        scaleId: 'arrow'
    }, {
        key: 'default',
        name: Strings.categoryDefault,
        svg: document.getElementById('defaultSvg').contentDocument,
        fillId: ['path4148', 'path4149'],
        rotateId: 'path4148',
        scaleId: 'layer2'
    }, {
        key: 'car',
        name: Strings.categoryCar,
        svg: document.getElementById('carSvg').contentDocument,
        fillId: ['path4148', 'path4157'],
        rotateId: 'path4148',
        scaleId: 'layer2'
    }, {
        key: 'bus',
        name: Strings.categoryBus,
        svg: document.getElementById('busSvg').contentDocument,
        fillId: ['path4148', 'path4200'],
        rotateId: 'path4148',
        scaleId: 'layer2'
    }, {
        key: 'truck',
        name: Strings.categoryTruck,
        svg: document.getElementById('truckSvg').contentDocument,
        fillId: ['path4148', 'path4336'],
        rotateId: 'path4148',
        scaleId: 'layer2'
    }, {
        key: 'ship',
        name: Strings.categoryShip,
        svg: document.getElementById('shipSvg').contentDocument,
        fillId: ['path4148', 'path4177'],
        rotateId: 'path4148',
        scaleId: 'layer2'
    }, {
        key: 'plane',
        name: Strings.categoryPlane,
        svg: document.getElementById('planeSvg').contentDocument,
        fillId: ['path4148', 'path4203'],
        rotateId: 'path4148',
        scaleId: 'layer2'
    }, {
        key: 'motorcycle',
        name: Strings.categoryMotorcycle,
        svg: document.getElementById('motorcycleSvg').contentDocument,
        fillId: ['path4148', 'path4256'],
        rotateId: 'path4148',
        scaleId: 'layer2'
    }, {
        key: 'bicycle',
        name: Strings.categoryBicycle,
        svg: document.getElementById('bicycleSvg').contentDocument,
        fillId: ['path4148', 'path4282'],
        rotateId: 'path4148',
        scaleId: 'layer2'
    }, {
        key: 'person',
        name: Strings.categoryPerson,
        svg: document.getElementById('personSvg').contentDocument,
        fillId: ['path4148', 'path4308'],
        rotateId: 'path4148',
        scaleId: 'layer2'
    }]
});