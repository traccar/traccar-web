/*
 * Copyright 2015 - 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2018 Mateusz Jończyk (mat.jonczyk@o2.pl)
 *      - Mateusz's work on this file was funded by Partner Security
 *        (www.partnersecurity.pl)
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
Ext.define('Traccar.view.dialog.ShowIframe', {
    extend: 'Traccar.view.dialog.Base',

    title: 'Empty iframe',

    resizable: true,

    /*
     * Example use of this class:
     *          var dialog = Ext.create('Traccar.view.dialog.ShowIframe', {
     *              fileToDisplay: '/LICENSE_GPL.html',
     *              titleToDisplay: 'GNU General Public License 3.0'
     *          });
     *          dialog.show();
     */


    items: [{
        xtype: 'component',
        autoEl: {
            // Create an empty iframe
            tag: 'iframe',
            src: 'about:blank'
        },
        width: '100%',
        height: '100%',
        id: 'mainIframe'
    }],

    initComponent: function () {
        var iframe;

        // Modified version of web/app/view/dialog/Base.js -> initComponent
        if (window.innerWidth) {
            this.maxWidth = window.innerWidth - Traccar.Style.normalPadding * 2;

            // If we are on mobile devices
            if (window.innerWidth < 600) {
                this.width = this.maxWidth;
            } else {
                this.width = 0.75 * this.maxWidth;
            }
        }

        if (window.innerHeight) {
            this.maxHeight = window.innerHeight - Traccar.Style.normalPadding * 2;

            // If we are on mobile devices
            if (window.innerWidth && window.innerWidth < 600) {
                this.height = this.maxHeight;
            } else {
                this.height = 0.75 * this.maxHeight;
            }
        }
        this.callParent();

        /*
         * Inside a controller we would use
         *      this.getView().fileToDisplay
         * and
         *      this.getView().titleToDisplay
         */
        iframe = Ext.getCmp('mainIframe');
        iframe.autoEl.src = this.fileToDisplay;

        this.setTitle(this.titleToDisplay);
    }

});
