package org.traccar.web.client;

import com.smartgwt.client.widgets.toolbar.ToolStrip;
import com.smartgwt.client.widgets.grid.ListGrid;
import com.smartgwt.client.widgets.grid.ListGridField;
import com.smartgwt.client.widgets.layout.SectionStack;
import com.smartgwt.client.widgets.layout.SectionStackSection;
import com.smartgwt.client.widgets.toolbar.ToolStripButton;

/**
 * Device list widget
 */
public class DevicePanel extends SectionStack {

    private ToolStrip toolbar;
    private ListGrid list;

    public DevicePanel() {
        SectionStackSection section = new SectionStackSection("Devices");  
        section.setCanCollapse(false);
        section.setExpanded(true);

        toolbar = new ToolStrip();
        toolbar.setWidth100();

        ToolStripButton button = new ToolStripButton();
        button.setTitle("Add");
        toolbar.addButton(button);
        button = new ToolStripButton();
        button.setTitle("Remove");
        toolbar.addButton(button);
        button = new ToolStripButton();
        button.setTitle("Edit");
        toolbar.addButton(button);
        toolbar.addFill();
        toolbar.addSeparator();
        button = new ToolStripButton();
        button.setTitle("Settings");
        toolbar.addButton(button);

        list = new ListGrid();
        list.setFields(
                new ListGridField("id", "Id"),
                new ListGridField("imei", "IMEI"));

        list.setCanSort(false);
        list.setShowHeaderContextMenu(false);
        list.setShowHeaderMenuButton(false);

        section.setItems(toolbar, list);
        setSections(section);
    }

}
