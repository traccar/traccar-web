package org.traccar.web.client.controller;

import org.traccar.web.client.view.MapPanel;

import com.smartgwt.client.widgets.Canvas;

public class MapController implements PanelController {

    @Override
    public Canvas getView() {
        return new MapPanel();
    }

}
