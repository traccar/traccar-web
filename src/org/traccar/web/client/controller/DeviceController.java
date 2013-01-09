package org.traccar.web.client.controller;

import java.util.List;

import org.traccar.web.client.Application;
import org.traccar.web.client.model.BaseAsyncCallback;
import org.traccar.web.client.view.DeviceDialog;
import org.traccar.web.client.view.DeviceView;
import org.traccar.web.shared.model.Device;

import com.sencha.gxt.widget.core.client.ContentPanel;
import com.sencha.gxt.widget.core.client.Dialog.PredefinedButton;
import com.sencha.gxt.widget.core.client.box.ConfirmMessageBox;
import com.sencha.gxt.widget.core.client.event.HideEvent;
import com.sencha.gxt.widget.core.client.event.HideEvent.HideHandler;

public class DeviceController implements ContentController, DeviceView.DeviceHandler {

    public interface DeviceHandler {
        public void onLoad(List<Device> devices);
        public void onSelected(Device device);
        public void onAdd(Device device);
        public void onUpdate(Device device);
        public void onRemove(Device device);
    }

    private DeviceHandler deviceHandler;

    private DeviceView deviceView;

    public DeviceController(DeviceHandler deviceHandler) {
        this.deviceHandler = deviceHandler;
        deviceView = new DeviceView(this);
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
                deviceView.load(result);
                deviceHandler.onLoad(result);
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
                        deviceView.add(result);
                        deviceHandler.onAdd(result);
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
                        deviceView.update(result);
                        deviceHandler.onUpdate(result);
                    }
                });
            }
        }).show();
    }

    @Override
    public void onRemove(final Device device) {
        final ConfirmMessageBox dialog = new ConfirmMessageBox("Confirm", "Are you sure you want remove device?");
        dialog.addHideHandler(new HideHandler() {
            @Override
            public void onHide(HideEvent event) {
                if (dialog.getHideButton() == dialog.getButtonById(PredefinedButton.YES.name())) {
                    Application.getDataService().removeDevice(device, new BaseAsyncCallback<Device>() {
                        @Override
                        public void onSuccess(Device result) {
                            deviceView.remove(device);
                            deviceHandler.onRemove(device);
                        }
                    });
                }
            }
        });
        dialog.show();
    }

}
