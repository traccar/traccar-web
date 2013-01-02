package org.traccar.web.client.view;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.traccar.web.client.Traccar;
import org.traccar.web.shared.model.Device;

import com.smartgwt.client.data.Record;
import com.smartgwt.client.util.BooleanCallback;
import com.smartgwt.client.util.SC;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.grid.ListGrid;
import com.smartgwt.client.widgets.grid.ListGridField;
import com.smartgwt.client.widgets.grid.events.SelectionChangedHandler;
import com.smartgwt.client.widgets.grid.events.SelectionEvent;
import com.smartgwt.client.widgets.layout.SectionStack;
import com.smartgwt.client.widgets.layout.SectionStackSection;
import com.smartgwt.client.widgets.toolbar.ToolStrip;
import com.smartgwt.client.widgets.toolbar.ToolStripButton;

/**
 * Device list widget
 */
public class DevicePanel extends SectionStack {

    private static final String COLUMN_ID = "id";
    private static final String COLUMN_NAME = "name";
    private static final String COLUMN_UNIQUE_ID = "uniqueId";

    public interface DeviceHandler {
        public void onAdd();
        public void onEdit(Device device);
        public void onRemove(Device device);
        public void onSelected(Device device);
    }

    private DeviceHandler deviceHandler;

    public void setDeviceHandler(DeviceHandler deviceHandler) {
        this.deviceHandler = deviceHandler;
    }

    ToolStripButton addButton;
    ToolStripButton removeButton;
    ToolStripButton editButton;
    private ToolStripButton settingsButton;

    private ListGrid list;

    private Map<Long, Device> deviceMap = new HashMap<Long, Device>();

    public DevicePanel() {
        SectionStackSection section = new SectionStackSection(Traccar.getConstants().devices());
        section.setCanCollapse(false);
        section.setExpanded(true);

        ToolStrip toolbar = new ToolStrip();
        toolbar.setWidth100();

        addButton = new ToolStripButton();
        addButton.setTitle(Traccar.getConstants().add());
        addButton.addClickHandler(new ClickHandler() {
            @Override
            public void onClick(ClickEvent event) {
                if (deviceHandler != null) {
                    deviceHandler.onAdd();
                }
            }
        });

        removeButton = new ToolStripButton();
        removeButton.setTitle(Traccar.getConstants().remove());
        removeButton.setVisible(false);
        removeButton.addClickHandler(new ClickHandler() {
            @Override
            public void onClick(ClickEvent event) {
                SC.ask(Traccar.getConstants().removeDeviceConfirmation(), new BooleanCallback() {
                    @Override
                    public void execute(Boolean value) {
                        if (value && deviceHandler != null && list.anySelected()) {
                            deviceHandler.onRemove(deviceMap.get(list.getSelectedRecord().getAttributeAsLong(COLUMN_ID)));
                        }
                    }
                });
            }
        });

        editButton = new ToolStripButton();
        editButton.setVisible(false);
        editButton.setTitle(Traccar.getConstants().edit());
        editButton.addClickHandler(new ClickHandler() {
            @Override
            public void onClick(ClickEvent event) {
                if (deviceHandler != null && list.anySelected()) {
                    deviceHandler.onEdit(deviceMap.get(list.getSelectedRecord().getAttributeAsLong(COLUMN_ID)));
                }
            }
        });

        toolbar.addButton(addButton);
        toolbar.addButton(removeButton);
        toolbar.addButton(editButton);

        toolbar.addFill();
        toolbar.addSeparator();

        settingsButton = new ToolStripButton();
        settingsButton.setTitle(Traccar.getConstants().settings());
        toolbar.addButton(settingsButton);

        list = new ListGrid();
        list.setFields(
                new ListGridField(COLUMN_NAME, Traccar.getConstants().name()),
                new ListGridField(COLUMN_UNIQUE_ID, Traccar.getConstants().uniqueId()));

        list.setCanSort(false);
        list.setShowHeaderContextMenu(false);
        list.setShowHeaderMenuButton(false);

        list.addSelectionChangedHandler(new SelectionChangedHandler() {
            @Override
            public void onSelectionChanged(SelectionEvent event) {
                removeButton.setVisible(list.anySelected());
                editButton.setVisible(list.anySelected());
                if (deviceHandler != null) {
                    if (list.anySelected()) {
                        deviceHandler.onSelected(deviceMap.get(list.getSelectedRecord().getAttributeAsLong(COLUMN_ID)));
                    } else {
                        deviceHandler.onSelected(null);
                    }
                }
            }
        });

        section.setItems(toolbar, list);
        setSections(section);
    }

    public void setSettingsClickHandler(ClickHandler handler) {
        settingsButton.addClickHandler(handler);
    }

    public void updateDevices(List<Device> devices) {
        deviceMap.clear();
        for (Record record : list.getRecords()) {
            list.removeData(record);
        }
        removeButton.setVisible(list.anySelected());
        editButton.setVisible(list.anySelected());

        for (Device device : devices) {
            deviceMap.put(device.getId(), device);

            Map<String, Object> map = new HashMap<String, Object>();
            map.put(COLUMN_ID, device.getId());
            map.put(COLUMN_NAME, device.getName());
            map.put(COLUMN_UNIQUE_ID, device.getUniqueId());

            Record record = new Record(map);
            list.addData(record);
        }
    }

}
