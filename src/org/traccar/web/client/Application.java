package org.traccar.web.client;

import java.util.List;

import org.traccar.web.client.controller.ArchiveController;
import org.traccar.web.client.controller.DeviceController;
import org.traccar.web.client.controller.MapController;
import org.traccar.web.client.model.BaseStoreHandlers;
import org.traccar.web.client.model.DataService;
import org.traccar.web.client.model.DataServiceAsync;
import org.traccar.web.client.view.ApplicationView;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.ui.RootPanel;
import com.sencha.gxt.data.shared.event.StoreHandlers;

public class Application {

    private static final DataServiceAsync dataService = GWT.create(DataService.class);

    public static DataServiceAsync getDataService() {
        return dataService;
    }

    private final DeviceController deviceController;
    private final MapController mapController;
    private final ArchiveController archiveController;

    private ApplicationView view;

    public Application() {
        deviceController = new DeviceController(deviceHandler);
        mapController = new MapController();
        archiveController = new ArchiveController(archiveHanlder, deviceController.getDeviceStore());
        archiveController.getPositionStore().addStoreHandlers(archiveStoreHandler);

        view = new ApplicationView(
                deviceController.getView(), mapController.getView(), archiveController.getView());
    }

    public void run() {
        RootPanel.get().add(view);

        deviceController.run();
        mapController.run();
        archiveController.run();
    }

    private DeviceController.DeviceHandler deviceHandler = new DeviceController.DeviceHandler() {

        @Override
        public void onLoad(List<Device> devices) {
        }

        @Override
        public void onSelected(Device device) {
            mapController.selectDevice(device);
        }

        @Override
        public void onAdd(Device device) {
            mapController.update();
        }

        @Override
        public void onUpdate(Device device) {
        }

        @Override
        public void onRemove(Device device) {
            mapController.update();
        }

    };

    private ArchiveController.ArchiveHandler archiveHanlder = new ArchiveController.ArchiveHandler() {

        @Override
        public void onSelected(Position position) {
            mapController.selectArchivePosition(position);
        }

    };

    private StoreHandlers<Position> archiveStoreHandler = new BaseStoreHandlers<Position>() {

        @Override
        public void onAnything() {
            mapController.showArchivePositions(archiveController.getPositionStore().getAll());
        }

    };

}
