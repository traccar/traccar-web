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

Ext.define('Traccar.view.edit.SavedCommands', {
    extend: 'Traccar.view.GridPanel',
    xtype: 'savedCommandsView',

    requires: [
        'Traccar.view.edit.SavedCommandsController',
        'Traccar.view.edit.Toolbar'
    ],

    controller: 'savedCommands',
    store: 'Commands',

    tbar: {
        xtype: 'editToolbar'
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    columns: {
        defaults: {
            flex: 1,
            minWidth: Traccar.Style.columnWidthNormal
        },
        items: [{
            text: Strings.sharedDescription,
            dataIndex: 'description',
            filter: 'string'
        }, {
            text: Strings.sharedType,
            dataIndex: 'type',
            filter: {
                type: 'list',
                idField: 'type',
                labelField: 'name',
                store: 'AllCommandTypes'
            },
            renderer: Traccar.AttributeFormatter.getFormatter('commandType')
        }, {
            text: Strings.commandSendSms,
            dataIndex: 'textChannel',
            renderer: Traccar.AttributeFormatter.getFormatter('textChannel'),
            filter: 'boolean'
        }]
    }
});
