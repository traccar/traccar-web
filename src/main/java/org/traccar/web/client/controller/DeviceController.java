package org.traccar.web.client.controller;

import java.util.List;

import org.traccar.web.client.Traccar;
import org.traccar.web.client.database.BaseAsyncCallback;
import org.traccar.web.client.view.DeviceDialog;
import org.traccar.web.client.view.DevicePanel;
import org.traccar.web.shared.model.Device;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickHandler;

public class DeviceController implements PanelController, DevicePanel.DeviceHandler, DeviceDialog.SaveHandler  {

    public interface DeviceHandler {
        public void onChanged(List<Device> devices);
        public void onSelected(Device device);
    }

    private DeviceHandler deviceHandler;

    public void setHandler(DeviceHandler deviceHandler) {
        this.deviceHandler = deviceHandler;
    }

    private final DevicePanel devicePanel;

    public DeviceController() {
        devicePanel = new DevicePanel();
        devicePanel.setDeviceHandler(this);
        Traccar.getDatabaseService().getDevices(updateCallback);
    }

    @Override
    public Canvas getView() {
        return devicePanel;
    }

    public void setSettingsClickHandler(ClickHandler handler) {
        if (devicePanel != null) {
            devicePanel.setSettingsClickHandler(handler);
        }
    }

    DeviceDialog dialog;

    @Override
    public void onAdd() {
        onEdit(new Device());
    }

    @Override
    public void onEdit(Device device) {
        dialog = new DeviceDialog();
        dialog.setSaveHandler(this);
        dialog.setDevice(device);
        dialog.draw();
        dialog.centerInPage();
    }

    @Override
    public void onRemove(Device device) {
        Traccar.getDatabaseService().removeDevice(device, saveCallback);
    }

    @Override
    public void onSelected(Device device) {
        if (deviceHandler != null) {
            deviceHandler.onSelected(device);
        }
    }

    @Override
    public void onSave(Device device) {
        Traccar.getDatabaseService().storeDevice(device, saveCallback);
    }

    private AsyncCallback<Boolean> saveCallback = new BaseAsyncCallback<Boolean>() {
        @Override
        public void onSuccess(Boolean result) {
            if (result) {
                if (dialog != null) {
                    dialog.destroy();
                    dialog = null;
                }
                Traccar.getDatabaseService().getDevices(updateCallback);
            }
        }
    };

    private AsyncCallback<List<Device>> updateCallback = new BaseAsyncCallback<List<Device>>() {
        @Override
        public void onSuccess(List<Device> result) {
            devicePanel.updateDevices(result);
            if (deviceHandler != null) {
                deviceHandler.onChanged(result);
            }
        }
    };
}
