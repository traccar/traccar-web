/*
 * Copyright 2014 Vitaly Litvak (vitavaque@gmail.com)
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

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.FlexTable;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;
import com.sencha.gxt.core.client.Style;
import com.sencha.gxt.widget.core.client.Popup;
import com.sencha.gxt.widget.core.client.form.TextArea;
import com.sencha.gxt.widget.core.client.tips.ToolTip;
import com.sencha.gxt.widget.core.client.tips.ToolTipConfig;
import org.gwtopenmaps.openlayers.client.Pixel;
import org.traccar.web.client.ApplicationContext;
import org.traccar.web.client.model.StateItem;
import org.traccar.web.shared.model.Position;

public class PositionInfoPopup {
    private static PositionInfoPopupUiBinder uiBinder = GWT.create(PositionInfoPopupUiBinder.class);

    interface PositionInfoPopupUiBinder extends UiBinder<Widget, PositionInfoPopup> {
    }

    final Position position;

    public PositionInfoPopup(Position position) {
        uiBinder.createAndBindUi(this);

        this.position = position;
    }

    public void show(MapView mapView) {
        long diff = System.currentTimeMillis() - position.getTime().getTime();

        long diffSeconds = diff / 1000 % 60;
        long diffMinutes = diff / (60 * 1000) % 60;
        long diffHours = diff / (60 * 60 * 1000) % 24;
        long diffDays = diff / (24 * 60 * 60 * 1000);

        String diffString = diffDays > 0 ? diffDays + " days " + diffHours + " hours" :
                            diffHours > 0 ? diffHours + " hours " + diffMinutes + " minutes" :
                            diffMinutes > 0 ? diffMinutes + " minutes " + diffSeconds + " seconds" :
                            diffSeconds + " seconds";

        String body = "<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">" +
                "<tr><td style=\"border-width: 1px 0px 1px 0px; border-style: solid; border-color: #000000; padding: 3px 0px 3px 0px;\" width=\"100%\" colspan=\"2\">" + diffString + " ago<br>(" + ApplicationContext.getInstance().getFormatterUtil().getTimeFormat().format(position.getTime()) + ")</td></tr>" +
                (position.getAddress() == null || position.getAddress().isEmpty() ? "" : ("<tr><td colspan=\"2\">" + position.getAddress() + "</td></tr>")) +
                "<tr>" +
                    "<td style=\"font-size: 12pt; border-width: 0px 1px 1px 0px; border-style: solid; border-color: #000000; padding: 3px 10px 3px 0px;\" valign=\"bottom\">" + ApplicationContext.getInstance().getFormatterUtil().getSpeedFormat().format(position.getSpeed()) + "</td>" +
                    "<td style=\"font-size: 10pt; border-bottom: 1px solid #000000; padding: 3px 10px 3px 10px;\" valign=\"bottom\">" + position.getAltitude() + "</td>" +
                "</tr>";
        String other = position.getOther();
        if (other != null) {
            try {
                NodeList nodes = XMLParser.parse(other).getFirstChild().getChildNodes();
                for (int i = 0; i < nodes.getLength(); i++) {
                    Node node = nodes.item(i);
                    String value = node.getFirstChild().getNodeValue();
                    if (!value.isEmpty()) {
                        body += "<tr><td style=\"padding: 3px 0px 3px 0px;\">" + node.getNodeName() + "</td><td>" + value + "</td></tr>";
                    }
                }
            } catch (Exception error) {
            }
        }

        body += "</table>";

        ToolTipConfig config = new ToolTipConfig();
        config.setTitleHtml(position.getDevice().getName());

        config.setBodyHtml(body);
        ToolTip toolTip = new ToolTip(config);

        Pixel pixel = mapView.getMap().getPixelFromLonLat(mapView.createLonLat(position.getLongitude(), position.getLatitude()));
        toolTip.showAt(mapView.getView().getAbsoluteLeft() +  pixel.x(), mapView.getView().getAbsoluteTop() + pixel.y());
    }

    public void hide() {
    }
}
