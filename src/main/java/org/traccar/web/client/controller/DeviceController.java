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
import java.util.Map;

import com.sencha.gxt.data.shared.event.StoreRecordChangeEvent;
import org.traccar.web.client.Application;
import org.traccar.web.client.ApplicationContext;
import org.traccar.web.client.i18n.Messages;
import org.traccar.web.client.model.BaseAsyncCallback;
import org.traccar.web.client.model.DeviceProperties;
import org.traccar.web.client.view.DeviceDialog;
import org.traccar.web.client.view.DeviceShareDialog;
import org.traccar.web.client.view.DeviceView;
import org.traccar.web.client.view.PositionInfoPopup;
import org.traccar.web.shared.model.Device;

import com.google.gwt.core.client.GWT;
import com.sencha.gxt.data.shared.ListStore;
import com.sencha.gxt.widget.core.client.ContentPanel;
import com.sencha.gxt.widget.core.client.Dialog.PredefinedButton;
import com.sencha.gxt.widget.core.client.box.AlertMessageBox;
import com.sencha.gxt.widget.core.client.box.ConfirmMessageBox;
import com.sencha.gxt.widget.core.client.event.DialogHideEvent;
import org.traccar.web.shared.model.Position;
import org.traccar.web.shared.model.User;

public class DeviceController implements ContentController, DeviceView.DeviceHandler {
    private final MapController mapController;

    private ListStore<Device> deviceStore;

    private DeviceView deviceView;

    private Messages i18n = GWT.create(Messages.class);

    private final PositionInfoPopup positionInfo = new PositionInfoPopup();

    public DeviceController(MapController mapController, DeviceView.SettingsHandler settingsHandler) {
        this.mapController = mapController;
        DeviceProperties deviceProperties = GWT.create(DeviceProperties.class);
        deviceStore = new ListStore<Device>(deviceProperties.id());
        deviceStore.addStoreRecordChangeHandler(new StoreRecordChangeEvent.StoreRecordChangeHandler<Device>() {
            @Override
            public void onRecordChange(StoreRecordChangeEvent<Device> event) {
                if (event.getProperty().getPath().equals("follow")) {
                    boolean follow = (Boolean) event.getRecord().getValue(event.getProperty());
                    Device device = event.getRecord().getModel();
                    if (follow) {
                        ApplicationContext.getInstance().follow(device);
                    } else {
                        ApplicationContext.getInstance().stopFollowing(device);
                    }
                } else if (event.getProperty().getPath().equals("recordTrace")) {
                    boolean recordTrace = (Boolean) event.getRecord().getValue(event.getProperty());
                    Device device = event.getRecord().getModel();
                    if (recordTrace) {
                        ApplicationContext.getInstance().recordTrace(device);
                    } else {
                        ApplicationContext.getInstance().stopRecordingTrace(device);
                    }
                }
            }
        });
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
        Application.getDataService().getDevices(new BaseAsyncCallback<List<Device>>(i18n) {
            @Override
            public void onSuccess(List<Device> result) {
                deviceStore.addAll(result);
            }
        });
    }

    @Override
    public void onSelected(Device device) {
        mapController.selectDevice(device);
    }

    @Override
    public void onAdd() {
        new DeviceDialog(new Device(), new DeviceDialog.DeviceHandler() {
            @Override
            public void onSave(Device device) {
                Application.getDataService().addDevice(device, new BaseAsyncCallback<Device>(i18n) {
                    @Override
                    public void onSuccess(Device result) {
                        deviceStore.add(result);
                    }
                    @Override
                    public void onFailure(Throwable caught) {
                        new AlertMessageBox(i18n.error(), i18n.errDeviceExists()).show();
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
                Application.getDataService().updateDevice(device, new BaseAsyncCallback<Device>(i18n) {
                    @Override
                    public void onSuccess(Device result) {
                        deviceStore.update(result);
                    }
                    @Override
                    public void onFailure(Throwable caught) {
                        new AlertMessageBox(i18n.error(), i18n.errDeviceExists()).show();
                    }                     
                });
            }
        }).show();
    }

    @Override
    public void onShare(final Device device) {
        Application.getDataService().getDeviceShare(device, new BaseAsyncCallback<Map<User, Boolean>>(i18n) {
            @Override
            public void onSuccess(final Map<User, Boolean> share) {
                new DeviceShareDialog(device, share, new DeviceShareDialog.DeviceShareHandler() {
                    @Override
                    public void onSaveShares(Device device, Map<User, Boolean> shares) {
                        Application.getDataService().saveDeviceShare(device, shares, new BaseAsyncCallback<Void>(i18n));
                    }
                }).show();
            }
        });
    }

    @Override
    public void onRemove(final Device device) {
        final ConfirmMessageBox dialog = new ConfirmMessageBox(i18n.confirm(), i18n.confirmDeviceRemoval());
        dialog.addDialogHideHandler(new DialogHideEvent.DialogHideHandler() {
			@Override
			public void onDialogHide(DialogHideEvent event) {
				if (event.getHideButton() == PredefinedButton.YES) {
                    Application.getDataService().removeDevice(device, new BaseAsyncCallback<Device>(i18n) {
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

    @Override
    public void onMouseOver(int mouseX, int mouseY, Device device) {
        positionInfo.show(mouseX, mouseY, mapController.getLatestPosition(device));
    }

    @Override
    public void onMouseOut(int mouseX, int mouseY, Device device) {
        positionInfo.hide();
    }

    public void selectDevice(Device device) {
        deviceView.selectDevice(device);
    }
}
