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

Ext.define('Traccar.view.MapPickerDialogController', {
    extend: 'Traccar.view.BaseEditDialogController',
    alias: 'controller.mapPickerDialog',

    config: {
        listen: {
            controller: {
                '*': {
                    mapstate: 'setMapState',
                    togglestate: 'setToggleState'
                }
            }
        }
    },

    getMapState: function (button) {
        this.fireEvent('mapstaterequest');
    },

    getToggleState: function (button) {
        this.fireEvent('togglestaterequest');
    },

    setMapState: function (lat, lon, zoom) {
        this.lookupReference('latitude').setValue(lat);
        this.lookupReference('longitude').setValue(lon);
        this.lookupReference('zoom').setValue(zoom);
    },

    setToggleState: function (state) {
        var record = this.getView().down('form').getRecord();
        record.set('attributes', Ext.merge(record.get('attributes'), state));
    }
});
