/*
 * Copyright 2017 - 2022 Anton Tananaev (anton@traccar.org)
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
Ext.define('Traccar.store.CommonUserAttributes', {
    extend: 'Ext.data.Store',
    model: 'Traccar.model.KnownAttribute',

    data: [{
        key: 'web.liveRouteLength',
        name: Strings.attributeWebLiveRouteLength,
        valueType: 'number',
        allowDecimals: false
    }, {
        key: 'web.selectZoom',
        name: Strings.attributeWebSelectZoom,
        valueType: 'number',
        allowDecimals: false,
        minValue: Traccar.Style.mapDefaultZoom,
        maxValue: Traccar.Style.mapMaxZoom
    }, {
        key: 'web.maxZoom',
        name: Strings.attributeWebMaxZoom,
        valueType: 'number',
        allowDecimals: false,
        minValue: Traccar.Style.mapDefaultZoom,
        maxValue: Traccar.Style.mapMaxZoom
    }, {
        key: 'ui.disableEvents',
        name: Strings.attributeUiDisableEvents,
        valueType: 'boolean'
    }, {
        key: 'ui.disableVehicleFeatures',
        name: Strings.attributeUiDisableVehicleFeatures,
        valueType: 'boolean'
    }, {
        key: 'ui.disableDrivers',
        name: Strings.attributeUiDisableDrivers,
        valueType: 'boolean'
    }, {
        key: 'ui.disableComputedAttributes',
        name: Strings.attributeUiDisableComputedAttributes,
        valueType: 'boolean'
    }, {
        key: 'ui.disableCalendars',
        name: Strings.attributeUiDisableCalendars,
        valueType: 'boolean'
    }, {
        key: 'ui.disableMaintenance',
        name: Strings.attributeUiDisableMaintenance,
        valueType: 'boolean'
    }, {
        key: 'ui.hidePositionAttributes',
        name: Strings.attributeUiHidePositionAttributes,
        valueType: 'string'
    }, {
        key: 'distanceUnit',
        name: Strings.settingsDistanceUnit,
        valueType: 'string',
        dataType: 'distanceUnit'
    }, {
        key: 'speedUnit',
        name: Strings.settingsSpeedUnit,
        valueType: 'string',
        dataType: 'speedUnit'
    }, {
        key: 'volumeUnit',
        name: Strings.settingsVolumeUnit,
        valueType: 'string',
        dataType: 'volumeUnit'
    }, {
        key: 'timezone',
        name: Strings.sharedTimezone,
        valueType: 'string',
        dataType: 'timezone'
    }]
});
