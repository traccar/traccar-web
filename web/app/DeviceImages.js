/*
 * Copyright 2016 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.DeviceImages', {
    singleton: true,

    getImageSvg: function (color, zoom, angle, category) {
        var i, device, svg, width, height, rotateTransform, scaleTransform, fill;

        if (category) {
            device = Ext.getStore('DeviceImages').findRecord('key', category, 0, false, false, true);
        }
        if (device === undefined || device === null) {
            device = Ext.getStore('DeviceImages').findRecord('key', 'default', 0, false, false, true);
        }
        svg = Ext.clone(device.get('svg'));

        width = parseFloat(svg.documentElement.getAttribute('width'));
        height = parseFloat(svg.documentElement.getAttribute('height'));

        fill = device.get('fillId');
        if (!Ext.isArray(fill)) {
            fill = [fill];
        }
        for (i = 0; i < fill.length; i++) {
            svg.getElementById(fill[i]).style.fill = color;
        }

        rotateTransform = 'rotate(' + angle + ' ' + (width / 2) + ' ' + (height / 2) + ')';
        svg.getElementById(device.get('rotateId')).setAttribute('transform', rotateTransform);

        width *= Traccar.Style.mapScaleNormal;
        height *= Traccar.Style.mapScaleNormal;
        if (zoom) {
            width *= Traccar.Style.mapScaleSelected;
            height *= Traccar.Style.mapScaleSelected;
            scaleTransform = 'scale(' + Traccar.Style.mapScaleSelected + ') ';
        } else {
            scaleTransform = 'scale(' + Traccar.Style.mapScaleNormal + ') ';
        }

        if (device.get('scaleId') !== device.get('rotateId')) {
            svg.getElementById(device.get('scaleId')).setAttribute('transform', scaleTransform);
        } else {
            svg.getElementById(device.get('scaleId')).setAttribute('transform', scaleTransform + ' ' + rotateTransform);
        }

        svg.documentElement.setAttribute('width', width);
        svg.documentElement.setAttribute('height', height);
        svg.documentElement.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

        return svg;
    },

    getImageIcon: function (color, zoom, angle, category) {
        var image, svg, width, height;

        svg = this.getImageSvg(color, zoom, angle, category);
        width = parseFloat(svg.documentElement.getAttribute('width'));
        height = parseFloat(svg.documentElement.getAttribute('height'));

        image =  new ol.style.Icon({
            imgSize: [width, height],
            src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg.documentElement))
        });
        image.fill = color;
        image.zoom = zoom;
        image.angle = angle;
        image.category = category;

        return image;
    }
});
