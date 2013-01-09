package org.traccar.web.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.traccar.web.client.controller.ArchiveController;
import org.traccar.web.client.controller.DeviceController;
import org.traccar.web.client.controller.MapController;
import org.traccar.web.client.model.DataService;
import org.traccar.web.client.model.DataServiceAsync;
import org.traccar.web.client.view.ApplicationView;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.ui.RootPanel;

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
        archiveController = new ArchiveController(archiveHanlder);

        view = new ApplicationView(
                deviceController.getView(), mapController.getView(), archiveController.getView());
    }

    public void run() {
        RootPanel.get().add(view);

        deviceController.run();
        mapController.run();
        archiveController.run();
    }

    private Map<Long, Device> devices = new HashMap<Long, Device>();

    private DeviceController.DeviceHandler deviceHandler = new DeviceController.DeviceHandler() {

        @Override
        public void onLoad(List<Device> devices) {
            Application.this.devices.clear();
            for (Device device : devices) {
                Application.this.devices.put(device.getId(), device);
            }
        }

        @Override
        public void onSelected(Device device) {
            mapController.select(device);
        }

        @Override
        public void onAdd(Device device) {
            devices.put(device.getId(), device);
            archiveController.updateDevices(devices.values());
            mapController.update();
        }

        @Override
        public void onUpdate(Device device) {
            devices.put(device.getId(), device);
            archiveController.updateDevices(devices.values());
        }

        @Override
        public void onRemove(Device device) {
            devices.remove(device.getId());
            archiveController.updateDevices(devices.values());
            mapController.update();
        }

    };

    private ArchiveController.ArchiveHandler archiveHanlder = new ArchiveController.ArchiveHandler() {

        @Override
        public void onSelected(Position position) {
            // TODO select something on map?
        }

    };

}
