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

Ext.define('Traccar.view.Login', {
    extend: 'Traccar.view.BaseDialog',
    alias: 'widget.login',

    requires: [
        'Traccar.view.LoginController'
    ],

    controller: 'login',

    header: false,
    closable: false,
    modal: false,

    items: {
        xtype: 'form',
        reference: 'form',

        autoEl: {
            tag: 'form',
            method: 'POST',
            action: 'fake-login.html',
            target: 'submitTarget'
        },

        items: [{
            xtype: 'image',
            src: 'logo.svg',
            alt: Strings.loginLogo,
            width: 180,
            height: 48,
            style: {
                display: 'block',
                margin: '10px auto 25px'
            }
        }, {
            xtype: 'combobox',
            name: 'language',
            fieldLabel: Strings.loginLanguage,
            store: 'Languages',
            displayField: 'name',
            valueField: 'code',
            editable: false,
            submitValue: false,
            listeners: {
                select: 'onSelectLanguage'
            },
            reference: 'languageField'
        }, {
            xtype: 'textfield',
            name: 'email',
            reference: 'userField',
            fieldLabel: Strings.userEmail,
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                specialKey: 'onSpecialKey',
                afterrender: 'onAfterRender'
            },
            inputAttrTpl: ['autocomplete="on"']
        }, {
            xtype: 'textfield',
            name: 'password',
            reference: 'passwordField',
            fieldLabel: Strings.userPassword,
            inputType: 'password',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                specialKey: 'onSpecialKey'
            },
            inputAttrTpl: ['autocomplete="on"']
        }, {
            xtype: 'checkboxfield',
            inputValue: true,
            uncheckedValue: false,
            reference: 'rememberField',
            fieldLabel: Strings.userRemember
        }, {
            xtype: 'component',
            html: '<iframe id="submitTarget" name="submitTarget" style="display:none"></iframe>'
        }, {
            xtype: 'component',
            html: '<input type="submit" id="submitButton" style="display:none">'
        }]
    },

    buttons: [{
        text: Strings.loginRegister,
        handler: 'onRegisterClick',
        reference: 'registerButton'
    }, {
        text: Strings.loginLogin,
        handler: 'onLoginClick'
    }]
});
