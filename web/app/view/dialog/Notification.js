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

Ext.define('Traccar.view.dialog.Notification', {
    extend: 'Traccar.view.dialog.BaseEdit',

    title: Strings.sharedNotification,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'fieldset',
            title: Strings.sharedRequired,
            items: [{
                xtype: 'combobox',
                name: 'type',
                fieldLabel: Strings.sharedType,
                store: 'AllNotificationTypes',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'type',
                editable: false,
                allowBlank: false
            }, {
                xtype: 'checkboxfield',
                inputValue: true,
                uncheckedValue: false,
                name: 'always',
                fieldLabel: Strings.notificationAlways
            }, {
                xtype: 'checkboxfield',
                inputValue: true,
                uncheckedValue: false,
                name: 'web',
                fieldLabel: Strings.notificationWeb
            }, {
                xtype: 'checkboxfield',
                inputValue: true,
                uncheckedValue: false,
                name: 'mail',
                fieldLabel: Strings.notificationMail
            }, {
                xtype: 'checkboxfield',
                inputValue: true,
                uncheckedValue: false,
                name: 'sms',
                fieldLabel: Strings.notificationSms
            }]
        }]
    }
});
