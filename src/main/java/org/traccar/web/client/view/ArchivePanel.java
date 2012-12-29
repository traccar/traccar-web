package org.traccar.web.client.view;

import com.smartgwt.client.widgets.form.fields.DateTimeItem;
import com.smartgwt.client.widgets.form.fields.SelectItem;
import com.smartgwt.client.widgets.grid.ListGrid;
import com.smartgwt.client.widgets.grid.ListGridField;
import com.smartgwt.client.widgets.layout.SectionStack;
import com.smartgwt.client.widgets.layout.SectionStackSection;
import com.smartgwt.client.widgets.toolbar.ToolStrip;
import com.smartgwt.client.widgets.toolbar.ToolStripButton;

/**
 * Archive widget
 */
public class ArchivePanel extends SectionStack {

    private ToolStrip toolbar;
    private ListGrid list;

    public ArchivePanel() {
        SectionStackSection section = new SectionStackSection("Archive");
        section.setCanCollapse(false);
        section.setExpanded(true);

        toolbar = new ToolStrip();
        toolbar.setWidth100();

        SelectItem deviceSelect = new SelectItem("device", "Device");
        //fontItem.setShowTitle(false);
        //fontItem.setWidth(120);
        toolbar.addFormItem(deviceSelect);
        toolbar.addSeparator();

        DateTimeItem from = new DateTimeItem("from", "From");
        toolbar.addFormItem(from);
        toolbar.addSeparator();
        DateTimeItem to = new DateTimeItem("to", "To");
        toolbar.addFormItem(to);
        toolbar.addSeparator();

        ToolStripButton button = new ToolStripButton();
        button.setTitle("Load");
        toolbar.addButton(button);

        list = new ListGrid();
        list.setFields(
                new ListGridField("deviceId", "Device Id"),
                new ListGridField("time", "Time"),
                new ListGridField("valid", "Valid"),
                new ListGridField("latitude", "Latitude"),
                new ListGridField("longitude", "Longitude"),
                new ListGridField("speed", "Speed"),
                new ListGridField("course", "Course"),
                new ListGridField("power", "Power"));

        list.setCanSort(false);
        list.setShowHeaderContextMenu(false);
        list.setShowHeaderMenuButton(false);

        section.setItems(toolbar, list);
        setSections(section);
    }

}
