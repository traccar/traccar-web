/*
 * Copyright 2015 Anton Tananaev (anton.tananaev@gmail.com)
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

    panelPadding: 10,

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

    mapDefaultLat: 51.507222,
    mapDefaultLon: -0.1275,
    mapDefaultZoom: 6,

    mapRouteColor: [
        'rgba(21, 127, 204, 1.0)',
        'rgba(109, 46, 204, 1.0)',
        'rgba(204, 46, 162, 1.0)',
        'rgba(204, 46, 38, 1.0)',
        'rgba(128, 204, 46, 1.0)',
        'rgba(46, 204, 155, 1.0)'
    ],
    mapRouteWidth: 5,

    mapArrowStrokeColor: 'rgba(50, 50, 50, 1.0)',
    mapArrowStrokeWidth: 2,

    mapTextColor: 'rgba(50, 50, 50, 1.0)',
    mapTextStrokeColor: 'rgba(255, 255, 255, 1.0)',
    mapTextStrokeWidth: 2,
    mapTextOffset: 10,
    mapTextFont: 'bold 12px sans-serif',

    mapColorOnline: 'rgba(77, 250, 144, 1.0)',
    mapColorUnknown: 'rgba(250, 190, 77, 1.0)',
    mapColorOffline: 'rgba(255, 84, 104, 1.0)',

    mapRadiusNormal: 9,
    mapRadiusSelected: 14,

    mapMaxZoom: 19,
    mapDelay: 500,

    mapGeofenceColor: 'rgba(21, 127, 204, 1.0)',
    mapGeofenceOverlay: 'rgba(21, 127, 204, 0.2)',
    mapGeofenceWidth: 5,
    mapGeofenceRadius: 9,

    coordinatePrecision: 6,
    numberPrecision: 2,

    reportTagfieldWidth: 375
});
