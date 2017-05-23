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

import org.traccar.web.shared.model.ApplicationSettings;

import com.google.gwt.core.client.GWT;
import com.google.gwt.editor.client.Editor;
import com.google.gwt.editor.client.SimpleBeanEditorDriver;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Widget;
import com.sencha.gxt.widget.core.client.Window;
import com.sencha.gxt.widget.core.client.event.SelectEvent;
import com.sencha.gxt.widget.core.client.form.CheckBox;

public class ApplicationSettingsDialog implements Editor<ApplicationSettings> {

    private static ApplicationSettingsDialogUiBinder uiBinder = GWT.create(ApplicationSettingsDialogUiBinder.class);

    interface ApplicationSettingsDialogUiBinder extends UiBinder<Widget, ApplicationSettingsDialog> {
    }

    private ApplicationSettingsDriver driver = GWT.create(ApplicationSettingsDriver.class);

    interface ApplicationSettingsDriver extends SimpleBeanEditorDriver<ApplicationSettings, ApplicationSettingsDialog> {
    }

    public interface ApplicationSettingsHandler {
        public void onSave(ApplicationSettings applicationSettings);
    }

    private ApplicationSettingsHandler applicationSettingsHandler;

    @UiField
    Window window;

    @UiField
    CheckBox registrationEnabled;

    public ApplicationSettingsDialog(ApplicationSettings applicationSettings, ApplicationSettingsHandler applicationSettingsHandler) {
        this.applicationSettingsHandler = applicationSettingsHandler;
        uiBinder.createAndBindUi(this);
        driver.initialize(this);
        driver.edit(applicationSettings);
    }

    public void show() {
        window.show();
    }

    public void hide() {
        window.hide();
    }

    @UiHandler("saveButton")
    public void onLoginClicked(SelectEvent event) {
        window.hide();
        applicationSettingsHandler.onSave(driver.flush());
    }

    @UiHandler("cancelButton")
    public void onRegisterClicked(SelectEvent event) {
        window.hide();
    }

}
