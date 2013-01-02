package org.traccar.web.client.controller;

import java.util.List;

import org.traccar.web.client.Traccar;
import org.traccar.web.client.view.MapPanel;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.smartgwt.client.widgets.Canvas;

public class MapController implements PanelController {

    private static final int UPDATE_INTERVAL = 10000;

    private final MapPanel mapPanel;

    private final Timer updateTimer;

    public MapController() {
        mapPanel = new MapPanel();
        updateTimer = new Timer() {
            @Override
            public void run() {
                update();
            }
        };
        update();
    }

    @Override
    public Canvas getView() {
        return mapPanel;
    }

    public void select(Device device) {
        mapPanel.select(device, true);
    }

    public void update() {
        updateTimer.cancel();
        Traccar.getDatabaseService().getLatestPositions(new AsyncCallback<List<Position>>() {
            @Override
            public void onSuccess(List<Position> result) {
                mapPanel.showPositions(result);
                updateTimer.schedule(UPDATE_INTERVAL);
            }
            @Override
            public void onFailure(Throwable caught) {
                updateTimer.schedule(UPDATE_INTERVAL);
            }
        });
    }

}
