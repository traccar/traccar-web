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
package org.traccar.web.client;

import java.util.logging.Logger;

import org.traccar.web.client.controller.ArchiveController;
import org.traccar.web.client.controller.DeviceController;
import org.traccar.web.client.controller.MapController;
import org.traccar.web.client.controller.SettingsController;
import org.traccar.web.client.controller.StateController;
import org.traccar.web.client.model.BaseStoreHandlers;
import org.traccar.web.client.model.DataService;
import org.traccar.web.client.model.DataServiceAsync;
import org.traccar.web.client.view.ApplicationView;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.ui.RootPanel;
import com.sencha.gxt.data.shared.event.StoreAddEvent;
import com.sencha.gxt.data.shared.event.StoreHandlers;
import com.sencha.gxt.data.shared.event.StoreRemoveEvent;

public class Application {

    private static final DataServiceAsync dataService = GWT.create(DataService.class);

    public static DataServiceAsync getDataService() {
        return dataService;
    }

    private static Logger logger = Logger.getLogger("");

    public static Logger getLogger() {
        return logger;
    }

    private final SettingsController settingsController;
    private final DeviceController deviceController;
    private final StateController stateController;
    private final MapController mapController;
    private final ArchiveController archiveController;

    private ApplicationView view;

    public Application() {
        settingsController = new SettingsController();
        deviceController = new DeviceController(deviceHandler, settingsController);
        deviceController.getDeviceStore().addStoreHandlers(deviceStoreHandler);
        stateController = new StateController();
        mapController = new MapController(mapHandler);
        archiveController = new ArchiveController(archiveHanlder, deviceController.getDeviceStore());
        archiveController.getPositionStore().addStoreHandlers(archiveStoreHandler);

        view = new ApplicationView(
                deviceController.getView(), stateController.getView(), mapController.getView(), archiveController.getView());
    }

    public void run() {
        RootPanel.get().add(view);

        deviceController.run();
        stateController.run();
        mapController.run();
        archiveController.run();
    }

    private DeviceController.DeviceHandler deviceHandler = new DeviceController.DeviceHandler() {

        private Device selected;

        @Override
        public void onSelected(Device device) {
            if (selected != null) {
                mapController.unregisterPositionUpdate(selected);
            }
            if (device != null) {
                mapController.registerPositionUpdate(device, positionUpdateHandler);
            }
            selected = device;
            mapController.selectDevice(device);
        }

    };

    private MapController.PositionUpdateHandler positionUpdateHandler = new MapController.PositionUpdateHandler() {

        @Override
        public void onUpdate(Position position) {
            stateController.showState(position);
        }

    };

    private MapController.MapHandler mapHandler = new MapController.MapHandler() {

        @Override
        public void onDeviceSelected(Device device) {
            deviceController.selectDevice(device);
        }

        @Override
        public void onArchivePositionSelected(Position position) {
            archiveController.selectPosition(position);
        }

    };

    private ArchiveController.ArchiveHandler archiveHanlder = new ArchiveController.ArchiveHandler() {

        @Override
        public void onSelected(Position position) {
            mapController.selectArchivePosition(position);
        }

    };

    private StoreHandlers<Device> deviceStoreHandler = new BaseStoreHandlers<Device>() {

        @Override
        public void onAdd(StoreAddEvent<Device> event) {
            mapController.update();
        }

        @Override
        public void onRemove(StoreRemoveEvent<Device> event) {
            mapController.update();
        }

    };

    private StoreHandlers<Position> archiveStoreHandler = new BaseStoreHandlers<Position>() {

        @Override
        public void onAnything() {
            mapController.showArchivePositions(archiveController.getPositionStore().getAll());
        }

    };

}
