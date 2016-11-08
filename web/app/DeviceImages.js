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
    
    getImageIcon: function(color, zoom, angle, category) {
        var image, device, svg, width, height, rotateTransform, scaleTransform, transform, fill;
        // Get right image or fallback to default arrow
        if (category) {
            device = Ext.getStore('DeviceImages').findRecord('key', category);
        }
        if (device === undefined || device === null) {
            device = Ext.getStore('DeviceImages').findRecord('key', 'default');
        }

        // Duplicate svg object to not brake origin
        svg = Ext.clone(device.get('svg'));

        // Get original dimensions
        width = parseFloat(svg.documentElement.getAttribute('width'));
        height = parseFloat(svg.documentElement.getAttribute('height'));
        // Colorize
        fill = device.get('fillId');
        if (!Ext.isArray(fill)) {
            fill = [fill];
        }
        for (i = 0; i < fill.length; i++) {
            svg.getElementById(fill[i]).style.fill = color;
        }
        // Prepare rotate transformation
        rotateTransform = 'rotate(' + angle + ' ' + (width / 2) + ' ' + (height / 2) + ')';
        svg.getElementById(device.get('rotateId')).setAttribute('transform', rotateTransform);

        // Adjust size and prepare scale transformation
        width *= device.get('scale');
        height *= device.get('scale');
        if (zoom) {
            width *= Traccar.Style.mapScaleSelected;
            height *= Traccar.Style.mapScaleSelected;
            scaleTransform = 'scale(' + device.get('scale') * Traccar.Style.mapScaleSelected + ') ';
        } else {
            scaleTransform = 'scale(' + device.get('scale') + ') ';
        }

        if (device.get('scaleId') !== device.get('rotateId')) {
            svg.getElementById(device.get('scaleId')).setAttribute('transform', scaleTransform);
        } else {
            svg.getElementById(device.get('scaleId')).setAttribute('transform', scaleTransform + ' ' + rotateTransform);
        }
        //transform = scaleTransform + ' ' + rotateTransform;
        

        // Set dimension attributes
        svg.documentElement.setAttribute('width', width);
        svg.documentElement.setAttribute('height', height);
        svg.documentElement.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
   
        image =  new ol.style.Icon({
            imgSize: [width, height], // Workaround for IE
            src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg.documentElement))
        });
        image.fill = color;
        image.zoom = zoom;
        image.angle = angle;
        image.category = category;
        
        return image;
    }        
});