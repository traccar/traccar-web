package org.traccar.web.client.controller;

import org.traccar.web.client.view.MapView;
import org.traccar.web.shared.model.Device;

import com.google.gwt.user.client.Timer;
import com.sencha.gxt.widget.core.client.ContentPanel;

public class MapController implements ContentController {

    private static final int UPDATE_INTERVAL = 10000;

    private MapView mapView;

    public MapController() {
        mapView = new MapView();
    }

    @Override
    public ContentPanel getView() {
        return mapView.getView();
    }

    private Timer updateTimer;

    @Override
    public void run() {
        updateTimer = new Timer() {
            @Override
            public void run() {
                update();
            }
        };
        update();
    }

    public void update() {
        updateTimer.cancel();
        /*Application.getDataService().getLatestPositions(new AsyncCallback<List<Position>>() {
            @Override
            public void onSuccess(List<Position> result) {
                mapView.showPositions(result);
                updateTimer.schedule(UPDATE_INTERVAL);
            }
            @Override
            public void onFailure(Throwable caught) {
                updateTimer.schedule(UPDATE_INTERVAL);
            }
        });*/
    }

    public void select(Device device) {
        mapView.select(device, true);
    }

}
