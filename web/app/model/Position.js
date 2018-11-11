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

Ext.define('Traccar.model.Position', {
    extend: 'Ext.data.Model',
    identifier: 'negative',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'protocol',
        type: 'string'
    }, {
        name: 'deviceId',
        type: 'int'
    }, {
        name: 'serverTime',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'deviceTime',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'fixTime',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'valid',
        type: 'boolean'
    }, {
        name: 'accuracy',
        type: 'float',
        convert: Traccar.AttributeFormatter.getConverter('accuracy')
    }, {
        name: 'latitude',
        type: 'float'
    }, {
        name: 'longitude',
        type: 'float'
    }, {
        name: 'altitude',
        type: 'float'
    }, {
        name: 'speed',
        type: 'float'/*,
        convert: Traccar.AttributeFormatter.getConverter('speed')*/
    }, {
        name: 'course',
        type: 'float'
    }, {
        name: 'alrm',
        convert: function (v, rec) {
            var alrm;
            if ((typeof  (rec.get('attributes')['alarm']) !== 'undefined')) {
                alrm = rec.get('attributes')['alarm'];
                return alrm;
            } else {
                return "nil";
            }
        }
    }, {
        name: 'ign',
        convert: function (v, rec) {
            var ign;
            if ((typeof  (rec.get('attributes')['ignition']) !== 'undefined')) {
                ign = rec.get('attributes')['ignition'];
                if (ign) {
                    return ign;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }, {
        name: 'mov',
        convert: function (v, rec) {
            var mov;
            if ((typeof  (rec.get('attributes')['motion']) !== 'motion')) {
                mov = rec.get('attributes')['motion'];
                return mov;
            } else {
                return false;
            }
        }
    }, {
        name: 'address',
        type: 'string'
    }, {
        name: 'attributes'
    }]
});
