/*
 * Copyright 2013 Anton Tananaev (anton.tananaev@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.traccar.web.client.view;

import org.gwtopenmaps.openlayers.client.Icon;
import org.gwtopenmaps.openlayers.client.Pixel;
import org.gwtopenmaps.openlayers.client.Size;

class MarkerIconFactory {

    private static final Size iconSize = new Size(21, 25);
    private static final Pixel iconOffset = new Pixel(-10.5f, -25.0f);

    private static final String iconUrl = "http://cdnjs.cloudflare.com/ajax/libs/openlayers/2.13.1/img/";

    public static enum IconType {
        iconLatest(iconUrl + "marker-green.png", iconUrl + "marker.png"),
        iconArchive(iconUrl + "marker-gold.png", iconUrl + "marker-blue.png");

        private final String selectedURL;
        private final String notSelectedURL;

        IconType(String selectedURL, String notSelectedURL) {
            this.selectedURL = selectedURL;
            this.notSelectedURL = notSelectedURL;
        }

        String getURL(boolean selected) {
            return selected ? selectedURL : notSelectedURL;
        }

        Icon getIcon(boolean selected) {
            return new Icon(getURL(selected), iconSize, iconOffset);
        }
    };

    public static String getIconUrl(IconType type, boolean selected) {
        return type == null ? null : type.getURL(selected);
    }

    public static Icon getIcon(IconType type, boolean selected) {
        return type == null ? null : type.getIcon(selected);
    }

}
