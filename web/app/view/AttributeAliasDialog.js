/*
 * Copyright 2016 Anton Tananaev (anton.tananaev@gmail.com)
 * Copyright 2016 Andrey Kunitsyn (abyss@fox5.ru)
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

Ext.define('Traccar.view.AttributeAliasDialog', {
    extend: 'Traccar.view.BaseDialog',

    requires: [
        'Traccar.view.AttributeController'
    ],

    controller: 'attributeDialog',
    title: Strings.sharedAttributeAlias,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'textfield',
            name: 'attribute',
            fieldLabel: Strings.sharedAttribute,
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'alias',
            fieldLabel: Strings.sharedAlias,
            allowBlank: false
        }]
    },

    buttons: [{
        text: Strings.sharedSave,
        handler: 'onSaveClick'
    }, {
        text: Strings.sharedCancel,
        handler: 'closeView'
    }]
});
