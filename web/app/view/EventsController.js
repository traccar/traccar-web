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

Ext.define('Traccar.view.EventsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.events',

    config: {
        listen: {
            controller: {
                '*': {
                    deselectevent: 'deselectEvent'
                }
            },
            store: {
                '#Events': {
                    add: 'onAddEvent'
                }
            }
        }
    },

    init: function () {
        var self = this;
        setInterval(function () {
            self.getView().getView().refresh();
        }, Traccar.Style.refreshPeriod);

        if (Traccar.app.isMobile()) {
            this.lookupReference('hideEventsButton').setHidden(false);
        }
    },

    onRemoveClick: function (button) {
        var event, positionId;
        event = this.getView().getSelectionModel().getSelection()[0];
        if (event) {
            Ext.getStore('Events').remove(event);
            positionId = event.get('positionId');
            if (positionId && !Ext.getStore('Events').findRecord('positionId', positionId, 0, false, false, true)) {
                Ext.getStore('EventPositions').remove(Ext.getStore('EventPositions').getById(positionId));
            }
        }
    },

    onClearClick: function (button) {
        Ext.getStore('Events').removeAll();
        Ext.getStore('EventPositions').removeAll();
    },

    onAddEvent: function (store, data) {
        if (this.lookupReference('scrollToLastButton').pressed) {
            this.getView().scrollBy(0, Number.POSITIVE_INFINITY, true);
        }
    },

    onScrollToLastClick: function (button, pressed) {
        if (pressed) {
            this.onAddEvent();
        }
    },

    onHideEvents: function () {
        Traccar.app.showEvents(false);
    },

    deselectEvent: function () {
        this.getView().getSelectionModel().deselectAll();
    },

    onSelectionChange: function (selection, selected) {
        var event, positionId;
        event = selected.length > 0 ? selected[0] : null;
        if (event) {
            positionId = event.get('positionId');
            if (positionId) {
                this.fireEvent('selectevent', Ext.getStore('EventPositions').getById(positionId));
            } else {
                this.fireEvent('selectevent');
            }
        }
        this.lookupReference('removeEventButton').setDisabled(!event);
    }
});
