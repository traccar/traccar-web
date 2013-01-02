package org.traccar.web.client.controller;

import org.traccar.web.client.view.ArchivePanel;

import com.smartgwt.client.widgets.Canvas;

public class ArchiveController implements PanelController {

    @Override
    public Canvas getView() {
        return new ArchivePanel();
    }

}
