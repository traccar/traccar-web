/*
 * Copyright 2015 - 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2018 Mateusz Jończyk (mat.jonczyk@o2.pl)
 * Based on web/app/view/dialog/BaseEditController.js
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

Ext.define('Traccar.view.dialog.AboutController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.about',


    requires: [
        'Traccar.view.dialog.ShowIframe'
    ],

    init: function () {
        Ext.getCmp('librariesListExtJS').update({extJSVersion: Ext.getVersion()});
        Ext.getCmp('librariesListOpenLayers').update({openLayersVersion: ol.VERSION});
        Ext.getCmp('librariesListProj4js').update({proj4jsVersion: proj4.version});
    },


    onLibrariesClick: function () {
        window.alert('Libraries click');
    },

    onGplClick: function () {
        var dialog = Ext.create('Traccar.view.dialog.ShowIframe', {
            fileToDisplay: '/LICENSE_GPL.html',
            // Title matches <title> inside LICENSE_GPL.html
            titleToDisplay: 'GNU General Public License v3.0'
        });
        dialog.show();
    }
});
