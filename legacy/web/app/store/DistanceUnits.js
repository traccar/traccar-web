/*
 * Copyright 2015 - 2016 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.store.DistanceUnits', {
    extend: 'Ext.data.Store',
    fields: ['key', 'name', 'factor'],

    data: [{
        key: 'km',
        name: Strings.sharedKm,
        factor: 0.001
    }, {
        key: 'mi',
        name: Strings.sharedMi,
        factor: 0.000621371
    }, {
        key: 'nmi',
        name: Strings.sharedNmi,
        factor: 0.000539957
    }],

    convertValue: function (value, unit, back) {
        var model;
        if (!unit) {
            unit = 'km';
        }
        model = this.findRecord('key', unit);
        return back ? value / model.get('factor') : value * model.get('factor');
    },

    formatValue: function (value, unit, convert) {
        var model;
        if (!unit) {
            unit = 'km';
        }
        model = this.findRecord('key', unit);
        return (convert ? this.convertValue(value, unit) : value).toFixed(2) + ' ' + model.get('name');
    }
});
