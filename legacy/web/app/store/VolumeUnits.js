/*
 * Copyright 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.store.VolumeUnits', {
    extend: 'Ext.data.Store',
    fields: ['key', 'name', 'fullName', 'factor'],

    data: [{
        key: 'ltr',
        name: Strings.sharedLiterAbbreviation,
        fullName: Strings.sharedLiter,
        factor: 1
    }, {
        key: 'impGal',
        name: Strings.sharedGallonAbbreviation,
        fullName: Strings.sharedImpGallon,
        factor: 4.546
    }, {
        key: 'usGal',
        name: Strings.sharedGallonAbbreviation,
        fullName: Strings.sharedUsGallon,
        factor: 3.785
    }],

    convertValue: function (value, unit, back) {
        var model;
        if (!unit) {
            unit = 'ltr';
        }
        model = this.findRecord('key', unit);
        return back ? value * model.get('factor') : value / model.get('factor');
    },

    formatValue: function (value, unit, convert) {
        var model;
        if (!unit) {
            unit = 'ltr';
        }
        model = this.findRecord('key', unit);
        return (convert ? this.convertValue(value, unit) : value).toFixed(1) + ' ' + model.get('name');
    }
});
