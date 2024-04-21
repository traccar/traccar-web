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

Ext.define('Traccar.view.dialog.Calendar', {
    extend: 'Traccar.view.dialog.BaseEdit',

    requires: [
        'Traccar.view.dialog.CalendarController',
        'Traccar.view.UnescapedTextField'
    ],

    controller: 'calendar',
    title: Strings.sharedCalendar,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'fieldset',
            title: Strings.sharedRequired,
            items: [{
                xtype: 'unescapedTextField',
                name: 'name',
                fieldLabel: Strings.sharedName,
                allowBlank: false
            }, {
                xtype: 'filefield',
                name: 'file',
                fieldLabel: Strings.sharedFile,
                allowBlank: false,
                buttonConfig: {
                    glyph: 'xf093@FontAwesome',
                    text: '',
                    tooltip: Strings.sharedSelectFile,
                    tooltipType: 'title',
                    minWidth: 0
                },
                listeners: {
                    change: 'onFileChange'
                }
            }]
        }, {
            xtype: 'hiddenfield',
            name: 'data',
            allowBlank: false,
            reference: 'dataField'
        }]
    }
});
