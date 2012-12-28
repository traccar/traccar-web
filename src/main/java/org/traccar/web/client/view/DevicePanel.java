package org.traccar.web.client.view;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.traccar.web.client.i18n.ApplicationConstants;
import org.traccar.web.shared.model.Device;

import com.google.gwt.core.client.GWT;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.grid.ListGrid;
import com.smartgwt.client.widgets.grid.ListGridField;
import com.smartgwt.client.widgets.layout.SectionStack;
import com.smartgwt.client.widgets.layout.SectionStackSection;
import com.smartgwt.client.widgets.toolbar.ToolStrip;
import com.smartgwt.client.widgets.toolbar.ToolStripButton;

/**
 * Device list widget
 */
public class DevicePanel extends SectionStack {

    private static final ApplicationConstants constants = GWT.create(ApplicationConstants.class);

    private static final String COLUMN_OBJECT = "object";
    private static final String COLUMN_NAME = "name";
    private static final String COLUMN_ID = "id";

    private ToolStrip toolbar;

    private ToolStripButton buttonAdd;
    private ToolStripButton buttonRemove;
    private ToolStripButton buttonEdit;
    private ToolStripButton buttonSettings;

    private ListGrid list;

    public DevicePanel() {
        SectionStackSection section = new SectionStackSection(constants.devices());
        section.setCanCollapse(false);
        section.setExpanded(true);

        toolbar = new ToolStrip();
        toolbar.setWidth100();

        buttonAdd = new ToolStripButton();
        buttonAdd.setTitle(constants.add());
        toolbar.addButton(buttonAdd);

        buttonRemove = new ToolStripButton();
        buttonRemove.setTitle(constants.remove());
        toolbar.addButton(buttonRemove);

        buttonEdit = new ToolStripButton();
        buttonEdit.setTitle(constants.edit());
        toolbar.addButton(buttonEdit);

        toolbar.addFill();
        toolbar.addSeparator();

        buttonSettings = new ToolStripButton();
        buttonSettings.setTitle(constants.settings());
        toolbar.addButton(buttonSettings);

        list = new ListGrid();
        list.setFields(
                new ListGridField(COLUMN_NAME, constants.name()),
                new ListGridField(COLUMN_ID, constants.id()));

        list.setCanSort(false);
        list.setShowHeaderContextMenu(false);
        list.setShowHeaderMenuButton(false);

        section.setItems(toolbar, list);
        setSections(section);
    }

    public void setAddClickHandler(ClickHandler handler) {
        buttonAdd.addClickHandler(handler);
    }

    public void setRemoveClickHandler(ClickHandler handler) {
        buttonRemove.addClickHandler(handler);
    }

    public void setEditClickHandler(ClickHandler handler) {
        buttonEdit.addClickHandler(handler);
    }

    public void setSettingsClickHandler(ClickHandler handler) {
        buttonSettings.addClickHandler(handler);
    }

    public void updateDevices(List<Device> devices) {
        // TODO: clear

        for (Device device : devices) {
            Map<String, Object> map = new HashMap<String, Object>();
            //map.put(COLUMN_OBJECT, device);
            map.put(COLUMN_NAME, device.getName());
            map.put(COLUMN_ID, device.getUniqueId());

            Record record = new Record(map);
            list.addData(record);
        }
    }


}
