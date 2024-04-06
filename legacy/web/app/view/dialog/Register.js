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

Ext.define('Traccar.view.dialog.Register', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.RegisterController'
    ],

    controller: 'register',

    title: Strings.loginRegister,

    items: {
        xtype: 'form',
        reference: 'form',
        jsonSubmit: true,

        items: [{
            xtype: 'textfield',
            name: 'name',
            fieldLabel: Strings.sharedName,
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'email',
            fieldLabel: Strings.userEmail,
            validator: function (val) {
                if (/(.+)@(.+)\.(.{2,})/.test(val)) {
                    return true;
                } else {
                    return Ext.form.field.VTypes.emailText;
                }
            },
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'password',
            fieldLabel: Strings.userPassword,
            inputType: 'password',
            allowBlank: false
        }]
    },

    buttons: [{
        text: Strings.sharedSave,
        handler: 'onCreateClick'
    }, {
        text: Strings.sharedCancel,
        handler: 'closeView'
    }]
});
