/*
 * Copyright 2014 Vitaly Litvak (vitavaque@gmail.com)
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
import com.sencha.gxt.widget.core.client.Window;
import com.sencha.gxt.widget.core.client.event.SelectEvent;
import com.sencha.gxt.widget.core.client.form.TextArea;
import org.traccar.web.client.Application;
import org.traccar.web.client.i18n.Messages;
import org.traccar.web.client.model.BaseAsyncCallback;

public class TrackerServerLogViewDialog {
    private static TrackerServerLogViewDialogUiBinder uiBinder = GWT.create(TrackerServerLogViewDialogUiBinder.class);

    interface TrackerServerLogViewDialogUiBinder extends UiBinder<Widget, TrackerServerLogViewDialog> {
    }

    @UiField
    Window window;

    @UiField
    TextArea logArea;

    @UiField(provided = true)
    Messages i18n = GWT.create(Messages.class);

    public TrackerServerLogViewDialog() {
        uiBinder.createAndBindUi(this);
        refresh();
    }

    private void refresh() {
        Application.getDataService().getTrackerServerLog(new BaseAsyncCallback<byte[]>(i18n) {
            @Override
            public void onSuccess(byte[] result) {
                logArea.setText(new String(result));
            }
        });
    }

    public void show() {
        window.show();
    }

    public void hide() {
        window.hide();
    }

    @UiHandler("refreshButton")
    public void onRefreshClicked(SelectEvent event) {
        refresh();
    }

    @UiHandler("closeButton")
    public void onCloseClicked(SelectEvent event) {
        hide();
    }
}
