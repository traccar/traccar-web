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

Ext.define('Traccar.controller.Root', {
    extend: 'Ext.app.Controller',
    alias: 'controller.root',

    requires: [
        'Traccar.view.dialog.Login',
        'Traccar.view.Main',
        'Traccar.view.MainMobile',
        'Traccar.model.Position'
    ],

    init: function () {
        var i, data, attribute, chartTypesStore, maintenanceTypesStore;
        chartTypesStore = Ext.getStore('ReportChartTypes');
        maintenanceTypesStore = Ext.getStore('MaintenanceTypes');
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        data = Ext.getStore('PositionAttributes').getData().items;
        for (i = 0; i < data.length; i++) {
            attribute = data[i];
            Traccar.model.Position.addFields([{
                name: 'attribute.' + attribute.get('key'),
                attributeKey: attribute.get('key'),
                calculate: this.calculateAttribute,
                persist: false
            }]);
            if (attribute.get('valueType') === 'number') {
                chartTypesStore.add({
                    key: 'attribute.' + attribute.get('key'),
                    name: attribute.get('name')
                });
                maintenanceTypesStore.add(attribute);
            }
        }
    },

    calculateAttribute: function (data) {
        var value = data.attributes[this.attributeKey];
        if (value !== undefined) {
            return Traccar.AttributeFormatter.getAttributeConverter(this.attributeKey)(value);
        }
        return value;
    },

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

        if (window.webkit && window.webkit.messageHandlers.appInterface) {
            window.webkit.messageHandlers.appInterface.postMessage('login');
        }
        if (window.appInterface) {
            window.appInterface.postMessage('login');
        }

        Ext.getStore('Groups').load();
//        Ext.getStore('Drivers').load();
        Ext.getStore('Geofences').load();
//        Ext.getStore('Calendars').load();
//        Ext.getStore('Maintenances').load();
//        Ext.getStore('ComputedAttributes').load();
        Ext.getStore('AllCommandTypes').load();
        Ext.getStore('Commands').load();
        Ext.getStore('AllNotificationTypes').load({
            callback: function (records, operation, success) {
                var store = Ext.getStore('ReportEventTypes');
                if (success) {
                    store.add({
                        type: Traccar.store.ReportEventTypes.allEvents,
                        name: Strings.eventAll
                    });
                    store.loadData(records, true);
                }
            }
        });
        Ext.getStore('AllNotificators').load();
        Ext.getStore('Notifications').load();

        Ext.getStore('ServerAttributes').loadData(Ext.getStore('CommonDeviceAttributes').getData().items, true);
        Ext.getStore('ServerAttributes').loadData(Ext.getStore('CommonUserAttributes').getData().items, true);
        Ext.getStore('UserAttributes').loadData(Ext.getStore('CommonUserAttributes').getData().items, true);
        Ext.getStore('DeviceAttributes').loadData(Ext.getStore('CommonDeviceAttributes').getData().items, true);
        Ext.getStore('GroupAttributes').loadData(Ext.getStore('CommonDeviceAttributes').getData().items, true);

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

    soundPressed: function () {
        var soundButton = Ext.getCmp('soundButton');
        return soundButton && soundButton.pressed;
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

        socket.onclose = function () {
            Traccar.app.showToast(Strings.errorSocket, Strings.errorTitle);

            Ext.Ajax.request({
                url: 'api/devices',
                success: function (response) {
                    self.updateDevices(Ext.decode(response.responseText));
                },
                failure: function (response) {
                    if (response.status === 401) {
                        window.location.reload();
                    }
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
                self.updatePositions(data.positions, first);
                first = false;
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
                    lastUpdate: array[i].lastUpdate,
                    geofenceIds: array[i].geofenceIds
                }, {
                    dirty: false
                });
            }
        }
    },

    updatePositions: function (array, first) {
        var i, store, entity, deviceId, device;
        store = Ext.getStore('LatestPositions');
        for (i = 0; i < array.length; i++) {
            entity = store.findRecord('deviceId', array[i].deviceId, 0, false, false, true);
            if (entity) {
                entity.set(array[i]);
            } else {
                store.add(Ext.create('Traccar.model.Position', array[i]));
            }
            if (Ext.getStore('Events').findRecord('positionId', array[i].id, 0, false, false, true)) {
                Ext.getStore('EventPositions').add(Ext.create('Traccar.model.Position', array[i]));
            }
        }
        if (first) {
            deviceId = Ext.Object.fromQueryString(window.location.search).deviceId;
            if (deviceId) {
                device = Ext.getStore('VisibleDevices').findRecord('id', deviceId, 0, false, true, true);
                if (device) {
                    this.fireEvent('selectdevice', device, true);
                }
            }
            if (!device) {
                this.zoomToAllDevices();
            }
        }
    },

    updateEvents: function (array) {
        var i, store, device;
        store = Ext.getStore('Events');
        for (i = 0; i < array.length; i++) {
            store.add(array[i]);
            device = Ext.getStore('Devices').getById(array[i].deviceId);
            if (device) {
                if (this.soundPressed()) {
                    this.beep();
                }
                Traccar.app.showToast(array[i].text, device.get('name'));
            } else {
                Traccar.app.showToast(array[i].text);
            }
        }
    },

    zoomToAllDevices: function () {
        var lat, lon, zoom;
        lat = Traccar.app.getPreference('latitude', 0);
        lon = Traccar.app.getPreference('longitude', 0);
        zoom = Traccar.app.getPreference('zoom', 0);
        if (lat === 0 && lon === 0 && zoom === 0) {
            this.fireEvent('zoomtoalldevices');
        }
    }
});
