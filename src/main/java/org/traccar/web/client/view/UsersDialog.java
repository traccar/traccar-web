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

import org.traccar.web.client.model.UserProperties;
import org.traccar.web.shared.model.User;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Widget;
import com.sencha.gxt.core.client.Style.SelectionMode;
import com.sencha.gxt.data.shared.ListStore;
import com.sencha.gxt.widget.core.client.Window;
import com.sencha.gxt.widget.core.client.button.TextButton;
import com.sencha.gxt.widget.core.client.event.SelectEvent;
import com.sencha.gxt.widget.core.client.grid.ColumnConfig;
import com.sencha.gxt.widget.core.client.grid.ColumnModel;
import com.sencha.gxt.widget.core.client.grid.Grid;
import com.sencha.gxt.widget.core.client.selection.SelectionChangedEvent;

public class UsersDialog implements SelectionChangedEvent.SelectionChangedHandler<User> {

    private static UsersDialogUiBinder uiBinder = GWT.create(UsersDialogUiBinder.class);

    interface UsersDialogUiBinder extends UiBinder<Widget, UsersDialog> {
    }

    public interface UserHandler {
        public void onAdd();
        public void onRemove(User user);
    }

    private UserHandler userHandler;

    @UiField
    Window window;

    @UiField
    TextButton addButton;

    @UiField
    TextButton removeButton;

    @UiField(provided = true)
    ColumnModel<User> columnModel;

    @UiField(provided = true)
    ListStore<User> userStore;

    @UiField
    Grid<User> grid;

    public UsersDialog(ListStore<User> userStore, UserHandler userHandler) {
        this.userStore = userStore;
        this.userHandler = userHandler;

        UserProperties userProperties = GWT.create(UserProperties.class);

        List<ColumnConfig<User, ?>> columnConfigList = new LinkedList<ColumnConfig<User, ?>>();
        columnConfigList.add(new ColumnConfig<User, String>(userProperties.login(), 0, "Name"));
        columnConfigList.add(new ColumnConfig<User, Boolean>(userProperties.admin(), 0, "Administrator"));
        columnModel = new ColumnModel<User>(columnConfigList);

        uiBinder.createAndBindUi(this);

        grid.getSelectionModel().addSelectionChangedHandler(this);
        grid.getSelectionModel().setSelectionMode(SelectionMode.SINGLE);
    }

    public void show() {
        window.show();
    }

    public void hide() {
        window.hide();
    }

    @Override
    public void onSelectionChanged(SelectionChangedEvent<User> event) {
        removeButton.setEnabled(!event.getSelection().isEmpty());
    }
    @UiHandler("addButton")
    public void onAddClicked(SelectEvent event) {
        userHandler.onAdd();
    }

    @UiHandler("removeButton")
    public void onRemoveClicked(SelectEvent event) {
        userHandler.onRemove(grid.getSelectionModel().getSelectedItem());
    }

}
