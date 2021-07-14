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

Ext.define('Traccar.view.dialog.Login', {
  extend: 'Traccar.view.dialog.Base',
  alias: 'widget.login',

  requires: [
    'Traccar.view.dialog.LoginController'
  ],

  controller: 'login',

  header: false,
  closable: false,
  minWidth: 320,

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
      src: './logo/front.png',
      alt: Strings.loginLogo,
      width: 122,
      height: 43,
      style: {
        display: 'block',
        margin: '10px auto 25px'
      }
    }, {
      xtype: 'textfield',
      name: 'email',
      reference: 'userField',
      emptyText: Strings.userEmail,
      /*fieldLabel: Strings.userEmail,*/
      allowBlank: false,
      enableKeyEvents: true,
      minWidth: 320,
      listeners: {
        specialKey: 'onSpecialKey',
        afterrender: 'onAfterRender'
      },
      inputAttrTpl: ['autocomplete="on" autocapitalize="none"']
    }, {
      height: 1
    }, {
      xtype: 'textfield',
      name: 'password',
      reference: 'passwordField',
      emptyText: Strings.userPassword,
      /*fieldLabel: Strings.userPassword,*/
      inputType: 'password',
      allowBlank: false,
      enableKeyEvents: true,
      minWidth: 320,
      listeners: {
        specialKey: 'onSpecialKey'
      },
      inputAttrTpl: ['autocomplete="on"']
    }, {
      height: 1
    }, {
      xtype: 'combobox',
      name: 'language',
      /*fieldLabel: Strings.loginLanguage,*/
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
      xtype: 'checkboxfield',
      inputValue: true,
      uncheckedValue: false,
      reference: 'rememberField',
      labelAlign: 'left',
      hideLabel: true,
      checked: true,
      fieldLabel: Strings.userRemember,
      boxLabel: Strings.userRemember
    }, {
      xtype: 'component',
      html: '<iframe id="submitTarget" name="submitTarget" style="display:none"></iframe>'
    }, {
      xtype: 'component',
      html: '<input type="submit" id="submitButton" style="display:none">'
    }]
  },

  buttons: [{
    text: Strings.loginReset,
    handler: 'onResetClick',
    reference: 'resetButton'
  },
  /**{{
         text: Strings.loginRegister,
         handler: 'onRegisterClick',
         reference: 'registerButton'
     }, **/
  {
    text: Strings.loginLogin,
    handler: 'onLoginClick'
  }
  ]
});
