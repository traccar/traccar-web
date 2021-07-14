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

Ext.define('Traccar.view.Events', {
  extend: 'Traccar.view.GridPanel',
  xtype: 'eventsView',

  requires: [
    'Traccar.view.EventsController'
  ],

  controller: 'events',

  store: 'Events',

  stateful: true,
  stateId: 'events-grid',

  title: Strings.reportEvents,

  sortableColumns: true,

  header: false,

  tbar: {
    componentCls: 'toolbar-header-style',
    defaults: {
      xtype: 'button',
      tooltipType: 'title',
      stateEvents: ['toggle'],
      enableToggle: true,
      stateful: {
        pressed: true
      }
    },
    items: [{
      xtype: 'tbtext',
      html: Strings.reportEvents,
      baseCls: 'x-panel-header-title-default'
    }, {
      xtype: 'tbfill'
    }, {
      glyph: 'xf063@FontAwesome',
      pressed: true,
      toggleHandler: 'onScrollToLastClick',
      stateId: 'events-scroll-to-last-button',
      tooltip: Strings.eventsScrollToLast,
      reference: 'scrollToLastButton'
    }, {
      id: 'soundButton',
      pressed: true,
      glyph: 'xf0a2@FontAwesome',
      tooltip: Strings.sharedSound,
      stateId: 'sound-button'
    }, {
      glyph: 'xf014@FontAwesome',
      tooltip: Strings.sharedRemove,
      handler: 'onRemoveClick',
      reference: 'removeEventButton',
      disabled: true,
      stateful: false,
      enableToggle: false
    }, {
      glyph: 'xf1f8@FontAwesome',
      tooltip: Strings.reportClear,
      handler: 'onClearClick',
      stateful: false,
      enableToggle: false
    }, {
      glyph: 'xf00d@FontAwesome',
      tooltip: Strings.sharedHide,
      handler: 'onHideEvents',
      reference: 'hideEventsButton',
      hidden: true,
      stateful: false,
      enableToggle: false
    }]
  },

  listeners: {
    selectionchange: 'onSelectionChange'
  },

  columns: {
    defaults: {
      flex: 1,
      minWidth: 60,
      autoSizeColumn: true
    },
    items: [{
      text: Strings.sharedAsset,
      dataIndex: 'deviceId',
      minWidth: 80,
      renderer: Traccar.AttributeFormatter.getFormatter('deviceId')
    }, {
      text: Strings.positionFixTime,
      dataIndex: 'serverTime',
      renderer: Traccar.AttributeFormatter.getFormatter('eventTime')
    }, {
      flex: 2,
      text: Strings.positionEvent,
      minWidth: 150,
      dataIndex: 'text',
      renderer: function (value, record) {
        return value;
      }
    }, {
      text: Strings.positionSpeed,
      dataIndex: 'attributes',
      minWidth: 60,
      renderer: function (value) {
        var speed = Traccar.AttributeFormatter.getConverter('speed')(value['speed']);
        var lesSpeed = Traccar.AttributeFormatter.speedFormatter(speed);
        if (lesSpeed == 'NaN km/h' || lesSpeed == 'NaN kph' || lesSpeed == 'NaN kn' || lesSpeed == 'NaN mph') {
          return 'Not gps';
        } else {
          return lesSpeed;
        }
      }
    }, {
      text: Strings.positionAddress,
      dataIndex: 'attributes',
      minWidth: 135,
      maxWidth: 255,
      renderer: function (value, metaData, record) {
        if (value && value['address'] !== undefined) {
          return Traccar.AttributeFormatter.getFormatter('address')(value['address']);
        } else {
          return 'Not gps';
        }
      }
    }, {
      text: Strings.sharedGeofence,
      dataIndex: 'geofenceId',
      minWidth: 110,
      renderer: Traccar.AttributeFormatter.getFormatter('geofenceId')
    }]
  }
});
