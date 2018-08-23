/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 - 2017 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.dialog.DeviceAccumulators', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.DeviceAccumulatorsController'
    ],

    controller: 'deviceAccumulators',
    title: Strings.sharedDeviceAccumulators,

    items: [{
        xtype: 'customNumberField',
        dataType: 'distance',
        reference: 'totalDistance',
        fieldLabel: Strings.deviceTotalDistance
    }, {
        xtype: 'customNumberField',
        dataType: 'hours',
        reference: 'hours',
        fieldLabel: Strings.positionHours
    }],

    buttons: [{
        reference: 'setButton',
        glyph: 'xf00c@FontAwesome',
        tooltip: Strings.sharedSet,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'onSetClick'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedCancel,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
