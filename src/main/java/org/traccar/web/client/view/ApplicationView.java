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
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.sencha.gxt.widget.core.client.ContentPanel;

public class ApplicationView extends Composite {

    private static ApplicationViewUiBinder uiBinder = GWT.create(ApplicationViewUiBinder.class);

    interface ApplicationViewUiBinder extends UiBinder<Widget, ApplicationView> {
    }

    @UiField(provided = true)
    ContentPanel devicePanel;

    @UiField(provided = true)
    ContentPanel statePanel;

    @UiField(provided = true)
    ContentPanel mapPanel;

    @UiField(provided = true)
    ContentPanel archivePanel;

    public ApplicationView(ContentPanel deviceView, ContentPanel stateView, ContentPanel mapView, ContentPanel archiveView) {
        devicePanel = deviceView;
        statePanel = stateView;
        mapPanel = mapView;
        archivePanel = archiveView;
        initWidget(uiBinder.createAndBindUi(this));
    }

}
