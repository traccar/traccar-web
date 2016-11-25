/*
 * Copyright 2015 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.Style', {
    singleton: true,

    normalPadding: 10,

    windowWidth: 640,
    windowHeight: 480,

    dateTimeFormat24: 'Y-m-d H:i:s',
    dateTimeFormat12: 'Y-m-d g:i:s a',
    timeFormat24: 'H:i',
    timeFormat12: 'g:i a',
    dateFormat: 'Y-m-d',
    weekStartDay: 1,

    deviceWidth: 350,

    reportHeight: 250,
    reportTime: 100,

    columnWidthNormal: 100,

    mapDefaultLat: 12.966667,
    mapDefaultLon: 77.566667,
    mapDefaultZoom: 4,

    mapRouteColor: [
        '#F06292',
        '#BA68C8',
        '#4DD0E1',
        '#4DB6AC',
        '#FF8A65',
        '#A1887F'
    ],
    mapRouteWidth: 5,

    mapTextColor: 'rgba(50, 50, 50, 1.0)',
    mapTextStrokeColor: 'rgba(255, 255, 255, 1.0)',
    mapTextStrokeWidth: 2,
    mapTextOffset: 2,
    mapTextFont: 'bold 12px sans-serif',

    mapColorOnline: 'rgba(77, 250, 144, 1.0)',
    mapColorUnknown: 'rgba(250, 190, 77, 1.0)',
    mapColorOffline: 'rgba(255, 162, 173, 1.0)',

    mapScaleNormal: 1,
    mapScaleSelected: 1.5,

    mapMaxZoom: 19,
    mapDelay: 500,

    mapGeofenceTextColor: 'rgba(14, 88, 141, 1.0)',
    mapGeofenceColor: 'rgba(21, 127, 204, 1.0)',
    mapGeofenceOverlay: 'rgba(21, 127, 204, 0.2)',
    mapGeofenceWidth: 5,
    mapGeofenceRadius: 9,

    coordinatePrecision: 6,
    numberPrecision: 2,

    reportTagfieldWidth: 375
});
