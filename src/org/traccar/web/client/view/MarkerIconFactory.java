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

import com.google.gwt.http.client.*;

class MarkerIconFactory {

    private static final Size iconSize = new Size(21, 25);
    private static final Pixel iconOffset = new Pixel(-10.5f, -25.0f);

    private static String iconUrl = "http://www.openlayers.org/api/img/";
    private static final String iconRed = iconUrl + "marker.png";
    private static final String iconBlue = iconUrl + "marker-blue.png";
    private static final String iconGreen = iconUrl + "marker-green.png";
    private static final String iconGold = iconUrl + "marker-gold.png";
    
    public MarkerIconFactory() {
    	String url = "http://www.openlayers.org/api/OpenLayers.js";
    	RequestBuilder builder = new RequestBuilder(RequestBuilder.GET, URL.encode(url));
    	
    	try {
    		Request request = builder.sendRequest(null, new RequestCallback() {
    			public void onError(Request request, Throwable exception) {
    				iconUrl = "http://cdnjs.cloudflare.com/ajax/libs/openlayers/2.13.1/img/";
    			}

    			public void onResponseReceived(Request request, Response response) {
    				if (200 == response.getStatusCode()) {
    					;
    				} else {
    					iconUrl = "http://cdnjs.cloudflare.com/ajax/libs/openlayers/2.13.1/img/";
    				}
    			}
    		});
    	} catch (RequestException e) {
    		iconUrl = "http://cdnjs.cloudflare.com/ajax/libs/openlayers/2.13.1/img/";      
		}    	
    }
    
    
    public static enum IconType {
        iconLatest,
        iconArchive
    };

    public static String getIconUrl(IconType type, boolean selected) {
        if (type == IconType.iconLatest) {
            return selected ? iconGreen : iconRed;
        } else if (type == IconType.iconArchive) {
            return selected ? iconGold : iconBlue;
        }
        return null;
    }

    public static Icon getIcon(IconType type, boolean selected) {
        return new Icon(getIconUrl(type, selected), iconSize, iconOffset);
    }

}
