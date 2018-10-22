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

    refreshPeriod: 60 * 1000,
    reconnectTimeout: 60 * 1000,
    reportTimeout: 1200 * 90000000,

    normalPadding: 10,

    windowWidth: 800,
    windowHeight: 600,

    formFieldWidth: 345,

    dateTimeFormat24: 'd-m-Y H:i:s',
    dateTimeFormat12: 'd-m-Y g:i:s a',
    timeFormat24: 'H:i',
    timeFormat12: 'g:i a',
    dateFormat: 'd-m-Y',
    weekStartDay: 1,

    deviceWidth: 610,
    toastWidth: 195,

    reportHeight: 378,

    columnWidthNormal: 100,

    mapDefaultLat: 3.56545,
    mapDefaultLon: 14.948848,
    mapDefaultZoom: 4,

    mapRouteColor: [
        '#F06292',
        '#BA68C8',
        '#4DD0E1',
        '#4DB6AC',
        '#FF8A65',
        '#A1887F'
    ],
    mapRouteWidth: 3,

    mapTextColor: 'rgba(50, 50, 50, 1.0)',
    mapTextStrokeColor: 'rgba(255, 255, 255, 1.0)',
    mapTextStrokeWidth: 1,
    mapTextOffset: 1,
    mapTextFont: 'bold 10px sans-serif',

    mapColorGreen: 'rgba(77, 250, 144, 1.0)',
    mapColorYellow: 'rgba(250, 190, 77, 1.0)',
    mapColorOrange: 'rgba(255, 165, 0, 1.0)',
    mapColorRed: 'rgba(255, 162, 173, 1.0)',

    mapScaleNormal: 0.49,
    mapScaleSelected: 0.73,

    mapMaxZoom: 20,
    mapDelay: 500,

    mapAccuracyColor: 'rgba(96, 96, 96, 1.0)',

    mapGeofenceTextColor: 'rgba(14, 88, 141, 1.0)',
    mapGeofenceColor: 'rgba(21, 127, 204, 1.0)',
    mapGeofenceOverlayOpacity: 0.2,
    mapGeofenceWidth: 5,
    mapGeofenceRadius: 9,

    coordinatePrecision: 6,
    numberPrecision: 2,

    reportGridStyle: 'borderTop: 1px solid lightgray',

    chartPadding: '20 40 10 10',
    chartMarkerRadius: 3,
    chartMarkerHighlightScaling: 1.5
});
