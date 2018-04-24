/*
 * Copyright 2015 - 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2018 Mateusz Jończyk (mat.jonczyk@o2.pl)
 * Based on web/app/view/dialog/Server.js
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

Ext.define('Traccar.view.dialog.About', {
    extend: 'Traccar.view.dialog.Base',

    controller: 'about',
    title: Strings.sharedAboutTraccar,

    resizable: true,

    requires: [
        'Traccar.view.dialog.AboutController'
    ],

    items: [{
        xtype: 'box',
        autoEl: {
            tag: 'img',
            src: '/logo.svg',
            alt: 'Traccar'
        }
    }, {
        xtype: 'tbtext',
        // baseCls: 'x-panel-header-title-default',
        html: 'Modern GPS Tracking Platform'
    }, {
        xtype: 'tbtext',
        // baseCls: 'x-panel-header-title-default',
        html: 'Professional, Secure, Open Source'
    }, {

        /*
        xtype: 'tbtext',
        //baseCls: 'x-panel-header-title-default',
        html: 'Server version: '
    }, {
        xtype: 'tbtext',
        //baseCls: 'x-panel-header-title-default',
        html: 'Web client version: '
    }, {
        */
        xtype: 'tbtext',
        // baseCls: 'x-panel-header-title-default',
        html: 'Copyright &copy; 2010–2018 Anton Tananaev  <br>' +
              'Copyright &copy; 2016–2018 Andrey Kunitsyn <br>' +
              'Copyright &copy; other authors (see copyright notices in source code and git history) <br> &nbsp;'
    }, {
        xtype: 'tbtext',
        style: {
            // Inspired by Jukebox's comment at http://stackoverflow.com/a/35493572
            whiteSpace: 'normal'
        },
        /*
         * ExtJS is licensed under GNU GPLv3 "only", so even though files belonging to
         * traccar-web are licensed under GNU GPLv3 "or later", the whole work
         * is licensed under GNU GPLv3 "only".
         */
        html: 'This program is free software: you can redistribute it and/or modify ' +
              'it under the terms of the GNU General Public License version 3, as published by ' +
              'the Free Software Foundation, with conditions added under section 7 ' +
              'of the GNU General Public License version 3. <br>' +
              'The additional conditions are specified by the terms of the Apache 2.0 license and in ' +
              'license terms of libraries that this program uses. <br> &nbsp;'
               // TODO: add notice to translators about translating "free software",
               // TODO: czy trzeba by dać tutaj jeszcze jakieś zastrzeżenia dot. licencji Apache 2.0
               //
               //
    }, {
        xtype: 'tbtext',
        style: {
            whiteSpace: 'normal'
        },
        html: 'This program is distributed in the hope that it will be useful, ' +
              'but WITHOUT ANY WARRANTY; without even the implied warranty of ' +
              'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the ' +
              'GNU General Public License for more details. <br> &nbsp;'
    }, {
        xtype: 'button',
        text: 'Show the text of the GNU General Public License version 3',
        handler: 'onGplClick'
    }, {
        xtype: 'tbtext',
        style: {
            whiteSpace: 'normal'
        },
        html: 'This program makes use of many components and libraries, the most important of which are: '
    }, {
        /*
         * This is based on example source code in
         * https://docs.sencha.com/extjs/6.0.1/classic/Ext.Component.html#cfg-autoEl
         */
        xtype: 'container',
        autoEl: {
            tag: 'ul'
        },
        /*
         * Only libraries used by traccar-web are displayed below.
         */
        items: [{
            xtype: 'box',
            autoEl: 'li',
            tpl: 'ExtJS, version {extJSVersion}, distributed under the GNU GPLv3 license;',
            id: 'librariesListExtJS'
        }, {
            xtype: 'box',
            autoEl: 'li',
            tpl: 'OpenLayers, version {openLayersVersion}, distributed under the two-clause BSD license;',
            id: 'librariesListOpenLayers'
        }, {
            xtype: 'box',
            autoEl: 'li',
            tpl: 'Proj4js, version {proj4jsVersion}, distributed under the MIT license.',
            id: 'librariesListProj4js'
        }]
    }],

    buttons: [{
        xtype: 'tbfill'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedClose,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
