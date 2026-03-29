/*
 * Copyright 2018 Anton Tananaev (anton@traccar.org)
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

/*
 * Workaround for bug in ExtJs 6.2.0.
 * Resolved in current yet unreleased version
 */

Ext.define('Traccar.view.TouchFix62', {
    override: 'Ext.dom.Element'
},
function () {
    var additiveEvents = this.prototype.additiveEvents,
        eventMap = this.prototype.eventMap;
    if (Ext.supports.TouchEvents && Ext.firefoxVersion >= 52 && Ext.os.is.Desktop) {
        eventMap['touchstart'] = 'mousedown';
        eventMap['touchmove'] = 'mousemove';
        eventMap['touchend'] = 'mouseup';
        eventMap['touchcancel'] = 'mouseup';
        eventMap['click'] = 'click';
        eventMap['dblclick'] = 'dblclick';
        additiveEvents['mousedown'] = 'mousedown';
        additiveEvents['mousemove'] = 'mousemove';
        additiveEvents['mouseup'] = 'mouseup';
        additiveEvents['touchstart'] = 'touchstart';
        additiveEvents['touchmove'] = 'touchmove';
        additiveEvents['touchend'] = 'touchend';
        additiveEvents['touchcancel'] = 'touchcancel';
        additiveEvents['pointerdown'] = 'mousedown';
        additiveEvents['pointermove'] = 'mousemove';
        additiveEvents['pointerup'] = 'mouseup';
        additiveEvents['pointercancel'] = 'mouseup';
    }
});
