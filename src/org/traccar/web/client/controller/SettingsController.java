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
package org.traccar.web.client.controller;

import org.traccar.web.client.Application;
import org.traccar.web.client.ApplicationContext;
import org.traccar.web.client.model.BaseAsyncCallback;
import org.traccar.web.client.view.ApplicationSettingsDialog;
import org.traccar.web.client.view.DeviceView;
import org.traccar.web.client.view.UserDialog;
import org.traccar.web.client.view.UserSettingsDialog;
import org.traccar.web.shared.model.ApplicationSettings;
import org.traccar.web.shared.model.User;
import org.traccar.web.shared.model.UserSettings;

public class SettingsController implements DeviceView.SettingsHandler {

    @Override
    public void onAccountSelected() {
        new UserDialog(
                ApplicationContext.getInstance().getUser(),
                new UserDialog.UserHandler() {
                    @Override
                    public void onSave(User user) {
                        Application.getDataService().updateUser(user, new BaseAsyncCallback<User>() {
                            @Override
                            public void onSuccess(User result) {
                                ApplicationContext.getInstance().setUser(result);
                            }
                        });
                    }
                }).show();
    }

    @Override
    public void onPreferencesSelected() {
        new UserSettingsDialog(
                ApplicationContext.getInstance().getUserSettings(),
                new UserSettingsDialog.UserSettingsHandler() {
                    @Override
                    public void onSave(UserSettings userSettings) {
                        ApplicationContext.getInstance().setUserSettings(userSettings);
                        User user = ApplicationContext.getInstance().getUser();
                        Application.getDataService().updateUser(user, new BaseAsyncCallback<User>() {
                            @Override
                            public void onSuccess(User result) {
                                ApplicationContext.getInstance().setUser(result);
                            }
                        });
                    }
                }).show();
    }

    @Override
    public void onUsersSelected() {
        // TODO Auto-generated method stub

    }

    @Override
    public void onApplicationSelected() {
        new ApplicationSettingsDialog(
                ApplicationContext.getInstance().getApplicationSettings(),
                new ApplicationSettingsDialog.ApplicationSettingsHandler() {
                    @Override
                    public void onSave(ApplicationSettings applicationSettings) {
                        Application.getDataService().updateApplicationSettings(applicationSettings, new BaseAsyncCallback<ApplicationSettings>() {
                            @Override
                            public void onSuccess(ApplicationSettings result) {
                                ApplicationContext.getInstance().setApplicationSettings(result);
                            }
                        });
                    }
                }).show();
    }

}
