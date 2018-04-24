/*
 * Copyright 2015 - 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2018 Mateusz Jończyk (mat.jonczyk@o2.pl)
 *      - Mateusz's work on this file was funded by Partner Security
 *        (www.partnersecurity.pl)
 *
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

    defaults: {
        style: {
            // Inspired by Jukebox's comment at http://stackoverflow.com/a/35493572
            whiteSpace: 'normal',
            marginTop: '0.5em',
            marginBottom: '0.5em'
        }
    },

    items: [{
        xtype: 'box',
        autoEl: {
            tag: 'img',
            src: '/logo.svg',
            alt: 'Traccar'
        },
        style: {
            // This is a way to center an image:
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',

            marginTop: '1em',
            marginBottom: '0.5em'
        }
    }, {
        xtype: 'tbtext',
        html: Strings.aboutDescription,
        style: {
            textAlign: 'center',
            fontSize: 'large',
            fontWeight: 'bold',
            marginTop: '1em',
            marginBottom: '0.5em'
        }
    }, {
        xtype: 'tbtext',
        html: Strings.aboutAdvertisement,
        style: {
            textAlign: 'center',
            fontSize: 'large',
            fontWeight: 'bold',
            marginTop: '0.5em',
            marginBottom: '2em'
        }
    }, {

        /*
         * TODO: Display here information about client and server version.
         */
        xtype: 'tbtext',

        /*
         * See: https://en.wikipedia.org/wiki/Copyright_notice
         *
         * According to notices in source code, the server and web code when
         * taken as a whole is
         *      Copyright &copy; 2010–2018 Anton Tananaev
         * but the web code when taken alone is
         *      Copyright &copy; 2015–2018 Anton Tananaev
         *
         * In both cases
         *      Copyright &copy; 2016–2018 Andrey Kunitsyn
         *
         * It is unclear if the server code and web code are considered a single
         * work under the terms of GNU GPLv3.
         *
         */
        html: 'Copyright &copy; 2015–2018 Anton Tananaev  <br>' +
              'Copyright &copy; 2016–2018 Andrey Kunitsyn <br>' +
              'Copyright &copy; ' + Strings.aboutOtherAuthorsNote
    }, {
        xtype: 'tbtext',

        /*
         * ExtJS is licensed under GNU GPLv3 "only", so even though files belonging to
         * traccar-web are licensed under GNU GPLv3 "or later", the whole work
         * is licensed under GNU GPLv3 "only".
         *
         * The license notice below should be probably written both in English and
         * native language of the interface. So just leave it untranslated for now.
         */
        html: 'This program is <strong>free <!-- notice to translators: the word "free" ' +
              'here is connected with "freedom", not "no cost" --> software</strong>: you can ' +
              'redistribute it and/or modify ' +
              'it under the terms of the <strong>GNU General Public License version 3</strong>, ' +
              'as published by ' +
              'the Free Software Foundation, with conditions added under section 7 ' +
              'of the GNU General Public License version 3 ' +

              /*
               * The note below is important: Traccar contributors must be
               * aware that they are submitting work under GNU GPLv3 "or later".
               */
              '(note that Traccar source code is distributed under the terms of ' +
              'GNU GPL version 3 "or any later version", but use of some libraries ' +
              'requires dropping the "or any later version" clause when distributing ' +
              'the whole work).'
    }, {
        xtype: 'tbtext',
        html: 'The additional conditions are specified by the terms of the Apache 2.0 ' +
              'license (if the Traccar server and the Traccar web interface are ' +
              'considered a single work for the purposes of GNU GPL version 3) and in ' +
              'license terms of libraries that this program uses.'
    }, {
        xtype: 'tbtext',
        html: 'This program is distributed in the hope that it will be useful, ' +
              'but <strong>WITHOUT ANY WARRANTY</strong>; without even the implied warranty of ' +
              '<strong>MERCHANTABILITY</strong> or <strong>FITNESS FOR A PARTICULAR PURPOSE</strong>.  See the ' +
              'GNU General Public License for more details.'
    }, {
        xtype: 'button',

        /*
         * The text on this button should also probably be written both in
         * English and native language - for consistency.
         */
        text: 'Show the text of the GNU General Public License version 3',
        handler: 'onGplClick'
    }, {
        xtype: 'tbtext',
        html: Strings.aboutLibrariesListHeader,
        style: {
            whiteSpace: 'normal',
            marginTop: '0.5em',
            marginBottom: '0'
        }
    }, {

        /*
         * This is based on example source code in
         * https://docs.sencha.com/extjs/6.0.1/classic/Ext.Component.html#cfg-autoEl
         */
        xtype: 'container',
        autoEl: {
            tag: 'ul'
        },
        style: {
            whiteSpace: 'normal',
            marginTop: '0',
            marginBottom: '0.5em'
        },

        defaults: {
            style: {
                whiteSpace: 'normal',
                marginTop: '0em',
                marginBottom: '0em'
            }
        },

        /*
         * Only libraries used by traccar-web are displayed below.
         */
        items: [{
            xtype: 'box',
            autoEl: 'li',
            tpl: Strings.aboutLibraryExtJS,
            id: 'librariesListExtJS'
        }, {
            xtype: 'box',
            autoEl: 'li',
            tpl: Strings.aboutLibraryOpenLayers,
            id: 'librariesListOpenLayers'
        }, {
            xtype: 'box',
            autoEl: 'li',
            tpl: Strings.aboutLibraryProj4js,
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
