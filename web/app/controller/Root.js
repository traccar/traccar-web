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

Ext.define('Traccar.controller.Root', {
    extend: 'Ext.app.Controller',

    requires: [
        'Traccar.view.Login',
        'Traccar.view.Main',
        'Traccar.view.MainMobile',
        'Traccar.model.Position'
    ],

    onLaunch: function () {
        Ext.Ajax.request({
            scope: this,
            url: 'api/server',
            callback: this.onServerReturn
        });
    },

    onServerReturn: function (options, success, response) {
        var token, parameters = {};
        if (success) {
            Traccar.app.setServer(Ext.decode(response.responseText));
            token = Ext.Object.fromQueryString(window.location.search).token;
            if (token) {
                parameters.token = token;
            }
            Ext.Ajax.request({
                scope: this,
                url: 'api/session',
                method: 'GET',
                params: parameters,
                callback: this.onSessionReturn
            });
        } else {
            Traccar.app.showError(response);
        }
    },

    onSessionReturn: function (options, success, response) {
        Ext.get('spinner').setVisible(false);
        if (success) {
            Traccar.app.setUser(Ext.decode(response.responseText));
            this.loadApp();
        } else {
            this.login = Ext.create('widget.login', {
                listeners: {
                    scope: this,
                    login: this.onLogin
                }
            });
            this.login.show();
        }
    },

    onLogin: function () {
        this.login.close();
        this.loadApp();
    },

    loadApp: function () {
        var attribution, eventId;
        Ext.getStore('Groups').load();
        Ext.getStore('Geofences').load();
        Ext.getStore('AttributeAliases').load();
        Ext.getStore('Devices').load({
            scope: this,
            callback: function () {
                this.asyncUpdate(true);
            }
        });
        attribution = Ext.get('attribution');
        if (attribution) {
            attribution.remove();
        }
        if (Traccar.app.isMobile()) {
            Ext.create('widget.mainMobile');
        } else {
            Ext.create('widget.main');
        }
        eventId = Ext.Object.fromQueryString(window.location.search).eventId;
        if (eventId) {
            this.fireEvent('showsingleevent', eventId);
            this.removeUrlParameter('eventId');
        }
    },

    beep: function () {
        if (!this.beepSound) {
            this.beepSound = new Audio('beep.wav');
        }
        this.beepSound.play();
    },

    mutePressed: function () {
        var muteButton = Ext.getCmp('muteButton');
        return muteButton && !muteButton.pressed;
    },

    removeUrlParameter: function (param) {
        var params = Ext.Object.fromQueryString(window.location.search);
        delete params[param];
        if (Ext.Object.isEmpty(params)) {
            window.history.pushState(null, null, window.location.pathname);
        } else {
            window.history.pushState(null, null, window.location.pathname + '?' + Ext.Object.toQueryString(params));
        }
    },

    asyncUpdate: function (first) {
        var self = this, protocol, pathname, socket;
        protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        socket = new WebSocket(protocol + '//' + window.location.host + pathname + 'api/socket');

        socket.onclose = function (event) {
            Ext.toast(Strings.errorSocket, Strings.errorTitle, 'br');

            Ext.Ajax.request({
                url: 'api/devices',
                success: function (response) {
                    self.updateDevices(Ext.decode(response.responseText));
                }
            });

            Ext.Ajax.request({
                url: 'api/positions',
                headers: {
                    Accept: 'application/json'
                },
                success: function (response) {
                    self.updatePositions(Ext.decode(response.responseText));
                }
            });

            setTimeout(function () {
                self.asyncUpdate(false);
            }, Traccar.Style.reconnectTimeout);
        };

        socket.onmessage = function (event) {
            var data = Ext.decode(event.data);

            if (data.devices) {
                self.updateDevices(data.devices);
            }
            if (data.positions) {
                self.updatePositions(data.positions);
            }
            if (data.events) {
                self.updateEvents(data.events);
            }
        };
    },

    updateDevices: function (array) {
        var i, store, entity;
        store = Ext.getStore('Devices');
        for (i = 0; i < array.length; i++) {
            entity = store.getById(array[i].id);
            if (entity) {
                entity.set({
                    status: array[i].status,
                    lastUpdate: array[i].lastUpdate
                }, {
                    dirty: false
                });
            }
        }
    },

    updatePositions: function (array) {
        var i, store, entity;
        store = Ext.getStore('LatestPositions');
        for (i = 0; i < array.length; i++) {
            entity = store.findRecord('deviceId', array[i].deviceId, 0, false, false, true);
            if (entity) {
                entity.set(array[i]);
            } else {
                store.add(Ext.create('Traccar.model.Position', array[i]));
            }
        }
    },

    updateEvents: function (array) {
        var i, store, device, alarmKey, text, geofence;
        store = Ext.getStore('Events');
        for (i = 0; i < array.length; i++) {
            store.add(array[i]);
            if (array[i].type === 'commandResult') {
                text = Strings.eventCommandResult + ': ' + array[i].attributes.result;
            } else if (array[i].type === 'alarm') {
                alarmKey = 'alarm' + array[i].attributes.alarm.charAt(0).toUpperCase() + array[i].attributes.alarm.slice(1);
                text = Strings[alarmKey] || alarmKey;
            } else {
                text = Traccar.app.getEventString(array[i].type);
            }
            if (array[i].geofenceId !== 0) {
                geofence = Ext.getStore('Geofences').getById(array[i].geofenceId);
                if (geofence) {
                    text += ' \"' + geofence.get('name') + '"';
                }
            }
            device = Ext.getStore('Devices').getById(array[i].deviceId);
            if (device) {
                if (this.mutePressed()) {
                    this.beep();
                }
                Ext.toast(text, device.get('name'), 'br');
            }
        }
    }
});
