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
package org.traccar.web.client.view;

import java.util.LinkedList;
import java.util.List;

import com.sencha.gxt.cell.core.client.form.CheckBoxCell;
import com.sencha.gxt.widget.core.client.form.CheckBox;
import com.sencha.gxt.widget.core.client.grid.editing.GridEditing;
import com.sencha.gxt.widget.core.client.grid.editing.GridInlineEditing;
import org.traccar.web.client.Application;
import org.traccar.web.client.ApplicationContext;
import org.traccar.web.client.i18n.Messages;
import org.traccar.web.client.model.BaseAsyncCallback;
import org.traccar.web.client.model.DeviceProperties;
import org.traccar.web.shared.model.Device;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Widget;
import com.sencha.gxt.core.client.Style.SelectionMode;
import com.sencha.gxt.data.shared.ListStore;
import com.sencha.gxt.widget.core.client.ContentPanel;
import com.sencha.gxt.widget.core.client.button.TextButton;
import com.sencha.gxt.widget.core.client.event.SelectEvent;
import com.sencha.gxt.widget.core.client.grid.ColumnConfig;
import com.sencha.gxt.widget.core.client.grid.ColumnModel;
import com.sencha.gxt.widget.core.client.grid.Grid;
import com.sencha.gxt.widget.core.client.menu.Item;
import com.sencha.gxt.widget.core.client.menu.MenuItem;
import com.sencha.gxt.widget.core.client.selection.SelectionChangedEvent;

public class DeviceView implements SelectionChangedEvent.SelectionChangedHandler<Device> {

    private static DeviceViewUiBinder uiBinder = GWT.create(DeviceViewUiBinder.class);

    interface DeviceViewUiBinder extends UiBinder<Widget, DeviceView> {
    }

    public interface DeviceHandler {
        public void onSelected(Device device);
        public void onAdd();
        public void onEdit(Device device);
        public void onRemove(Device device);
    }

    private DeviceHandler deviceHandler;

    @UiField
    ContentPanel contentPanel;

    public ContentPanel getView() {
        return contentPanel;
    }

    @UiField
    TextButton addButton;

    @UiField
    TextButton editButton;

    @UiField
    TextButton removeButton;

    @UiField(provided = true)
    ColumnModel<Device> columnModel;

    @UiField(provided = true)
    ListStore<Device> deviceStore;

    @UiField
    Grid<Device> grid;

    @UiField
    MenuItem settingsUsers;

    @UiField
    MenuItem settingsGlobal;

    @UiField(provided = true)
    Messages i18n = GWT.create(Messages.class);

    public DeviceView(final DeviceHandler deviceHandler, SettingsHandler settingsHandler, final ListStore<Device> deviceStore) {
        this.deviceHandler = deviceHandler;
        this.settingsHandler = settingsHandler;
        this.deviceStore = deviceStore;

        DeviceProperties deviceProperties = GWT.create(DeviceProperties.class);

        List<ColumnConfig<Device, ?>> columnConfigList = new LinkedList<ColumnConfig<Device, ?>>();

        ColumnConfig<Device, String> colName = new ColumnConfig<Device, String>(deviceProperties.name(), 0, i18n.name());
        columnConfigList.add(colName);

        ColumnConfig<Device, Boolean> colFollow = new ColumnConfig<Device, Boolean>(deviceProperties.follow(), 50, i18n.follow());
        colFollow.setCell(new CheckBoxCell());
        colFollow.setFixed(true);
        colFollow.setResizable(false);
        columnConfigList.add(colFollow);

        ColumnConfig<Device, Boolean> colRecordTrace = new ColumnConfig<Device, Boolean>(deviceProperties.recordTrace(), 60, i18n.recordTrace());
        colRecordTrace.setCell(new CheckBoxCell());
        colRecordTrace.setFixed(true);
        colRecordTrace.setResizable(false);
        columnConfigList.add(colRecordTrace);

        columnModel = new ColumnModel<Device>(columnConfigList);

        uiBinder.createAndBindUi(this);

        grid.getSelectionModel().addSelectionChangedHandler(this);
        grid.getSelectionModel().setSelectionMode(SelectionMode.SINGLE);

        grid.getView().setAutoFill(true);
        grid.getView().setForceFit(true);

        GridEditing<Device> editing = new GridInlineEditing<Device>(grid);
        grid.getView().setShowDirtyCells(false);
        editing.addEditor(colFollow, new CheckBox());
        editing.addEditor(colRecordTrace, new CheckBox());

        if (ApplicationContext.getInstance().getUser().getAdmin()) {
            settingsUsers.enable();
            settingsGlobal.enable();
        }
    }

    @Override
    public void onSelectionChanged(SelectionChangedEvent<Device> event) {
        editButton.setEnabled(!event.getSelection().isEmpty());
        removeButton.setEnabled(!event.getSelection().isEmpty());

        if (event.getSelection().isEmpty()) {
            deviceHandler.onSelected(null);
        } else {
            deviceHandler.onSelected(event.getSelection().get(0));
        }
    }

    @UiHandler("addButton")
    public void onAddClicked(SelectEvent event) {
        deviceHandler.onAdd();
    }

    @UiHandler("editButton")
    public void onEditClicked(SelectEvent event) {
        deviceHandler.onEdit(grid.getSelectionModel().getSelectedItem());
    }

    @UiHandler("removeButton")
    public void onRemoveClicked(SelectEvent event) {
        deviceHandler.onRemove(grid.getSelectionModel().getSelectedItem());
    }

    @UiHandler("logoutButton")
    public void onLogoutClicked(SelectEvent event) {
        Application.getDataService().logout(new BaseAsyncCallback<Boolean>(i18n) {
            @Override
            public void onSuccess(Boolean result) {
                Window.Location.reload();
            }
        });
    }

    public void selectDevice(Device device) {
        grid.getSelectionModel().select(deviceStore.findModel(device), false);
    }

    public interface SettingsHandler {
        public void onAccountSelected();
        public void onPreferencesSelected();
        public void onUsersSelected();
        public void onApplicationSelected();
    }

    private SettingsHandler settingsHandler;

    @UiHandler("settingsAccount")
    public void onSettingsAccountSelected(SelectionEvent<Item> event) {
        settingsHandler.onAccountSelected();
    }

    @UiHandler("settingsPreferences")
    public void onSettingsPreferencesSelected(SelectionEvent<Item> event) {
        settingsHandler.onPreferencesSelected();
    }

    @UiHandler("settingsUsers")
    public void onSettingsUsersSelected(SelectionEvent<Item> event) {
        settingsHandler.onUsersSelected();
    }

    @UiHandler("settingsGlobal")
    public void onSettingsGlobalSelected(SelectionEvent<Item> event) {
        settingsHandler.onApplicationSelected();
    }

}
