/*
 * Copyright 2015 - 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.store.TimeUnits', {
    extend: 'Ext.data.Store',
    fields: ['key', 'name', 'factor'],

    data: [{
        key: 's',
        name: Strings.sharedSecondAbbreviation,
        factor: 1
    }, {
        key: 'm',
        name: Strings.sharedMinuteAbbreviation,
        factor: 60
    }, {
        key: 'h',
        name: Strings.sharedHourAbbreviation,
        factor: 3600
    }],

    convertValue: function (value, unit, back) {
        var model;
        if (!unit) {
            unit = 'kn';
        }
        model = this.findRecord('key', unit);
        return back ? value * model.get('factor') : value / model.get('factor');
    }
});
