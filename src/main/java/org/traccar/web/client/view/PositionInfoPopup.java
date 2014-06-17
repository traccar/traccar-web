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
import com.sencha.gxt.core.client.Style;
import com.sencha.gxt.widget.core.client.Popup;
import com.sencha.gxt.widget.core.client.form.TextArea;
import org.gwtopenmaps.openlayers.client.Pixel;
import org.traccar.web.client.ApplicationContext;
import org.traccar.web.shared.model.Position;

public class PositionInfoPopup {
    private static PositionInfoPopupUiBinder uiBinder = GWT.create(PositionInfoPopupUiBinder.class);

    interface PositionInfoPopupUiBinder extends UiBinder<Widget, PositionInfoPopup> {
    }

    @UiField
    Popup popup;

    @UiField
    FlexTable positionInfo;

    final Position position;

    public PositionInfoPopup(Position position) {
        uiBinder.createAndBindUi(this);

        this.position = position;
    }

    public void show(MapView mapView) {
        int nextRow = -1;

        positionInfo.setCellSpacing(5);
        positionInfo.setCellPadding(3);
        positionInfo.setText(++nextRow, 0, position.getDevice().getName());
        positionInfo.getFlexCellFormatter().setColSpan(nextRow, 0, 2);

        if (position.getAddress() != null && !position.getAddress().isEmpty()) {
            positionInfo.setText(++nextRow, 0, position.getAddress());
            positionInfo.getFlexCellFormatter().setColSpan(nextRow, 0, 2);
            nextRow++;
        }
        positionInfo.setText(++nextRow, 0, ApplicationContext.getInstance().getFormatterUtil().getSpeedFormat().format(position.getSpeed()));
        positionInfo.setText(nextRow, 1, position.getAltitude() + "");

        Pixel pixel = mapView.getMap().getPixelFromLonLat(mapView.createLonLat(position.getLongitude(), position.getLatitude()));
        popup.showAt(mapView.getView().getAbsoluteLeft() +  pixel.x(), mapView.getView().getAbsoluteTop() + pixel.y());
    }

    public void hide() {
        popup.hide();
    }
}
