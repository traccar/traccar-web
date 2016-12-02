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
        window.history.pushState(null, null, window.location.pathname + '?' + Ext.Object.toQueryString(params));
    },

    asyncUpdate: function (first) {
        var protocol, pathname, socket, self = this;
        protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        socket = new WebSocket(protocol + '//' + window.location.host + pathname + 'api/socket');

        socket.onclose = function (event) {
            self.asyncUpdate(false);
        };

        socket.onmessage = function (event) {
            var i, j, store, data, array, entity, device, alarmKey, text, geofence;

            data = Ext.decode(event.data);

            if (data.devices) {
                array = data.devices;
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
            }

            if (data.positions && !data.events) {
                array = data.positions;
                store = Ext.getStore('LatestPositions');
                for (i = 0; i < array.length; i++) {
                    entity = store.findRecord('deviceId', array[i].deviceId, 0, false, false, true);
                    if (entity) {
                        entity.set(array[i]);
                    } else {
                        store.add(Ext.create('Traccar.model.Position', array[i]));
                    }
                }
            }

            if (data.events) {
                array = data.events;
                store = Ext.getStore('Events');
                for (i = 0; i < array.length; i++) {
                    store.add(array[i]);
                    if (array[i].type === 'commandResult' && data.positions) {
                        for (j = 0; j < data.positions.length; j++) {
                            if (data.positions[j].id === array[i].positionId) {
                                text = data.positions[j].attributes.result;
                                break;
                            }
                        }
                        text = Strings.eventCommandResult + ': ' + text;
                    } else if (array[i].type === 'alarm' && data.positions) {
                        alarmKey = 'alarm';
                        text = Strings[alarmKey];
                        if (!text) {
                            text = alarmKey;
                        }
                        for (j = 0; j < data.positions.length; j++) {
                            if (data.positions[j].id === array[i].positionId && data.positions[j].attributes.alarm !== null) {
                                if (typeof data.positions[j].attributes.alarm === 'string' && data.positions[j].attributes.alarm.length >= 2) {
                                    alarmKey = 'alarm' + data.positions[j].attributes.alarm.charAt(0).toUpperCase() + data.positions[j].attributes.alarm.slice(1);
                                    text = Strings[alarmKey];
                                    if (!text) {
                                        text = alarmKey;
                                    }
                                }
                                break;
                            }
                        }
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
                        if (self.mutePressed()) {
                            self.beep();
                        }
                        Ext.toast(text, device.get('name'));
                    }
                }
            }
        };
    }
});
