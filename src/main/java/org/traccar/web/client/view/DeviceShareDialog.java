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

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Widget;
import com.sencha.gxt.cell.core.client.form.CheckBoxCell;
import com.sencha.gxt.core.client.Style.SelectionMode;
import com.sencha.gxt.core.client.ValueProvider;
import com.sencha.gxt.data.shared.ListStore;
import com.sencha.gxt.data.shared.ModelKeyProvider;
import com.sencha.gxt.data.shared.PropertyAccess;
import com.sencha.gxt.data.shared.Store;
import com.sencha.gxt.widget.core.client.Window;
import com.sencha.gxt.widget.core.client.button.TextButton;
import com.sencha.gxt.widget.core.client.event.SelectEvent;
import com.sencha.gxt.widget.core.client.grid.ColumnConfig;
import com.sencha.gxt.widget.core.client.grid.ColumnModel;
import com.sencha.gxt.widget.core.client.grid.Grid;
import com.sencha.gxt.widget.core.client.selection.SelectionChangedEvent;
import org.traccar.web.client.ApplicationContext;
import org.traccar.web.client.i18n.Messages;
import org.traccar.web.client.model.UserProperties;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.User;

import java.util.*;

public class DeviceShareDialog {

    private static UsersDialogUiBinder uiBinder = GWT.create(UsersDialogUiBinder.class);

    interface UsersDialogUiBinder extends UiBinder<Widget, DeviceShareDialog> {
    }

    public class UserShared {
        public final User user;
        public boolean shared;

        public UserShared(final User user, boolean shared) {
            this.user = user;
            this.shared = shared;
        }

        public long getId() {
            return user.getId();
        }

        public String getName() {
            return user.getLogin();
        }

        public boolean isShared() {
            return shared;
        }

        public void setShared(boolean shared) {
            this.shared = shared;
        }
    }

    public interface UserSharedProperties extends PropertyAccess<UserShared> {
        ModelKeyProvider<UserShared> id();

        ValueProvider<UserShared, String> name();

        ValueProvider<UserShared, Boolean> shared();
    }

    public interface DeviceShareHandler {
        public void onSaveShares(Device device, Map<User, Boolean> shares);
    }

    private DeviceShareHandler shareHandler;

    @UiField
    Window window;

    @UiField(provided = true)
    ColumnModel<UserShared> columnModel;

    @UiField(provided = true)
    ListStore<UserShared> shareStore;

    @UiField
    Grid<UserShared> grid;

    @UiField(provided = true)
    Messages i18n = GWT.create(Messages.class);

    Device device;

    public DeviceShareDialog(Device device, Map<User, Boolean> shares, DeviceShareHandler shareHandler) {
        this.device = device;
        this.shareHandler = shareHandler;

        List<User> users = new ArrayList<User>(shares.keySet());
        Collections.sort(users, new Comparator<User>() {
            @Override
            public int compare(User o1, User o2) {
                return o1.getLogin().toLowerCase().compareTo(o2.getLogin().toLowerCase());
            }
        });

        UserSharedProperties userSharedProperties = GWT.create(UserSharedProperties.class);

        shareStore = new ListStore<UserShared>(userSharedProperties.id());

        for (User user : users) {
            shareStore.add(new UserShared(user, shares.get(user)));
        }

        List<ColumnConfig<UserShared, ?>> columnConfigList = new LinkedList<ColumnConfig<UserShared, ?>>();
        columnConfigList.add(new ColumnConfig<UserShared, String>(userSharedProperties.name(), 25, i18n.name()));

        ColumnConfig<UserShared, Boolean> colManager = new ColumnConfig<UserShared, Boolean>(userSharedProperties.shared(), 25, i18n.share());
        colManager.setCell(new CheckBoxCell());
        columnConfigList.add(colManager);

        columnModel = new ColumnModel<UserShared>(columnConfigList);

        uiBinder.createAndBindUi(this);

        grid.getSelectionModel().setSelectionMode(SelectionMode.SINGLE);
    }

    public void show() {
        window.show();
    }

    public void hide() {
        window.hide();
    }

    @UiHandler("saveButton")
    public void onSaveClicked(SelectEvent event) {
        Map<User, Boolean> updatedShare = new HashMap<User, Boolean>(shareStore.getModifiedRecords().size());
        for (Store<UserShared>.Record record : shareStore.getModifiedRecords()) {
            UserShared updated = new UserShared(record.getModel().user, record.getModel().shared);
            for (Store.Change<UserShared, ?> change : record.getChanges()) {
                change.modify(updated);
            }
            updatedShare.put(updated.user, updated.shared);
        }
        shareHandler.onSaveShares(device, updatedShare);
        shareStore.commitChanges();
    }

    @UiHandler("cancelButton")
    public void onCancelClicked(SelectEvent event) {
        window.hide();
    }

}
