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
package org.traccar.web.client.controller;

import java.util.List;

import org.traccar.web.client.Application;
import org.traccar.web.client.model.BaseAsyncCallback;
import org.traccar.web.client.model.DeviceProperties;
import org.traccar.web.client.view.DeviceDialog;
import org.traccar.web.client.view.DeviceView;
import org.traccar.web.shared.model.Device;

import com.google.gwt.core.client.GWT;
import com.sencha.gxt.data.shared.ListStore;
import com.sencha.gxt.widget.core.client.ContentPanel;
import com.sencha.gxt.widget.core.client.Dialog.PredefinedButton;
import com.sencha.gxt.widget.core.client.box.ConfirmMessageBox;
import com.sencha.gxt.widget.core.client.event.HideEvent;

public class DeviceController implements ContentController, DeviceView.DeviceHandler {

    public interface DeviceHandler {
        public void onSelected(Device device);
    }

    private DeviceHandler deviceHandler;

    private ListStore<Device> deviceStore;

    private DeviceView deviceView;

    public DeviceController(DeviceHandler deviceHandler, DeviceView.SettingsHandler settingsHandler) {
        this.deviceHandler = deviceHandler;
        DeviceProperties deviceProperties = GWT.create(DeviceProperties.class);
        deviceStore = new ListStore<Device>(deviceProperties.id());
        deviceView = new DeviceView(this, settingsHandler, deviceStore);
    }

    public ListStore<Device> getDeviceStore() {
        return deviceStore;
    }

    @Override
    public ContentPanel getView() {
        return deviceView.getView();
    }

    @Override
    public void run() {
        Application.getDataService().getDevices(new BaseAsyncCallback<List<Device>>() {
            @Override
            public void onSuccess(List<Device> result) {
                deviceStore.addAll(result);
            }
        });
    }

    @Override
    public void onSelected(Device device) {
        deviceHandler.onSelected(device);
    }

    @Override
    public void onAdd() {
        new DeviceDialog(new Device(), new DeviceDialog.DeviceHandler() {
            @Override
            public void onSave(Device device) {
                Application.getDataService().addDevice(device, new BaseAsyncCallback<Device>() {
                    @Override
                    public void onSuccess(Device result) {
                        deviceStore.add(result);
                    }
                });
            }
        }).show();
    }

    @Override
    public void onEdit(Device device) {
        new DeviceDialog(new Device(device), new DeviceDialog.DeviceHandler() {
            @Override
            public void onSave(Device device) {
                Application.getDataService().updateDevice(device, new BaseAsyncCallback<Device>() {
                    @Override
                    public void onSuccess(Device result) {
                        deviceStore.update(result);
                    }
                });
            }
        }).show();
    }

    @Override
    public void onRemove(final Device device) {
        final ConfirmMessageBox dialog = new ConfirmMessageBox("Confirm", "Are you sure you want remove device?");
        dialog.addHideHandler(new HideEvent.HideHandler() {
            @Override
            public void onHide(HideEvent event) {
                if (dialog.getHideButton() == dialog.getButtonById(PredefinedButton.YES.name())) {
                    Application.getDataService().removeDevice(device, new BaseAsyncCallback<Device>() {
                        @Override
                        public void onSuccess(Device result) {
                            deviceStore.remove(device);
                        }
                    });
                }
            }
        });
        dialog.show();
    }

    public void selectDevice(Device device) {
        deviceView.selectDevice(device);
    }

}
