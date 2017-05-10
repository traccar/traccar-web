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

Ext.define('Traccar.view.dialog.ComputedAttribute', {
    extend: 'Traccar.view.dialog.BaseEdit',

    title: Strings.sharedComputedAttribute,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'textfield',
            name: 'description',
            fieldLabel: Strings.sharedDescription
        }, {
            xtype: 'textfield',
            name: 'attribute',
            fieldLabel: Strings.sharedAttribute,
            allowBlank: false
        }, {
            xtype: 'textareafield',
            name: 'expression',
            fieldLabel: Strings.sharedExpression,
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'type',
            fieldLabel: Strings.sharedType,
            allowBlank: false
        }]
    },

    buttons: [{
        glyph: 'xf00c@FontAwesome',
        tooltip: Strings.sharedSave,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'onSaveClick'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedCancel,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
