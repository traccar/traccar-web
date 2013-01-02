package org.traccar.web.client.view;

import org.traccar.web.client.Style;
import org.traccar.web.client.Traccar;
import org.traccar.web.shared.model.Device;

import com.smartgwt.client.types.Alignment;
import com.smartgwt.client.widgets.IButton;
import com.smartgwt.client.widgets.Window;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.TextItem;
import com.smartgwt.client.widgets.form.fields.ToolbarItem;
import com.smartgwt.client.widgets.layout.Layout;

public class DeviceDialog extends Window {

    public interface SaveHandler {
        public void onSave(Device device);
    }

    private SaveHandler saveHandler;

    public void setSaveHandler(SaveHandler saveHandler) {
        this.saveHandler = saveHandler;
    }

    private Device device;

    TextItem nameEdit;
    TextItem uniqueIdEdit;

    public void setDevice(Device device) {
        this.device = device;
        nameEdit.setValue(device.getName());
        uniqueIdEdit.setValue(device.getUniqueId());
    }

    public DeviceDialog() {
        setTitle(Traccar.getConstants().device());
        setAutoSize(true);
        setIsModal(true);

        // Form
        final DynamicForm form = new DynamicForm();
        form.setHeight100();
        form.setWidth100();

        nameEdit = new TextItem();
        nameEdit.setTitle(Traccar.getConstants().name());
        uniqueIdEdit = new TextItem();
        uniqueIdEdit.setTitle(Traccar.getConstants().uniqueId());

        final ToolbarItem toolbarItem = new ToolbarItem();
        toolbarItem.setButtons(
                new IButton(Traccar.getConstants().save(), new ClickHandler() {
                    @Override
                    public void onClick(ClickEvent event) {
                        if (saveHandler != null) {
                            device.setName(nameEdit.getValueAsString());
                            device.setUniqueId(uniqueIdEdit.getValueAsString());
                            saveHandler.onSave(device);
                        }
                    }
                }),
                new IButton(Traccar.getConstants().cancel(), new ClickHandler() {
                    @Override
                    public void onClick(ClickEvent event) {
                        destroy();
                    }
                }));
        toolbarItem.setAlign(Alignment.RIGHT);
        toolbarItem.setColSpan(3);

        form.setFields(nameEdit, uniqueIdEdit, toolbarItem);
        form.setCellPadding(Style.getCellPadding());

        final Layout layout = new Layout();
        layout.setPadding(Style.getPadding());

        layout.addMember(form);

        addItem(layout);
    }

}
