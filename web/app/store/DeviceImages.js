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
        svg: (new DOMParser())
                .parseFromString('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="26">'
                + '<polygon id="arrow" points="13,4 19,22 13,19 7,22" '
                + 'style="fill:#008000;stroke:#000000;stroke-width:2px;" transform="" /></svg>', "image/svg+xml"),
        rotateId: 'arrow',
        fillId: 'arrow',
        scale: 1
    }, {
        key: 'car',
        name: Strings.categoryCar,
        url: 'images/car.svg',
        fillId: 'path4149',
        rotateId: 'g4207',
        scale: 0.06,
    }, {
        key: 'bus',
        name: Strings.categoryBus,
        url: 'images/bus.svg',
        fillId: 'path4713',
        rotateId: 'layer2',
        scale: 0.12,
    }, {
        key: 'truck',
        name: Strings.categoryTruck,
        url: 'images/truck.svg',
        fillId: 'path4718',
        rotateId: 'layer2',
        scale: 0.1,
    }],
    
    constructor: function() {
        this.callParent(arguments);
        this.config.data.forEach(function (device) {
            if (device.url) {
                Ext.Ajax.request({
                    url: device.url,
                    scope: device,
                    success: function (response) {
                        this.svg = (new DOMParser()).parseFromString(response.responseText, "image/svg+xml");
                    }
                });
            }
        });
    }
});