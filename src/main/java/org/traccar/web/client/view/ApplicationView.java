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
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.sencha.gxt.core.client.Style;
import com.sencha.gxt.widget.core.client.ContentPanel;
import com.sencha.gxt.widget.core.client.button.ToolButton;
import com.sencha.gxt.widget.core.client.container.BorderLayoutContainer;
import com.sencha.gxt.widget.core.client.event.SelectEvent;
import org.traccar.web.shared.model.Position;

public class ApplicationView extends Composite {

    private static ApplicationViewUiBinder uiBinder = GWT.create(ApplicationViewUiBinder.class);

    interface ApplicationViewUiBinder extends UiBinder<Widget, ApplicationView> {
    }

    @UiField(provided = true)
    ContentPanel devicePanel;

    @UiField(provided = true)
    ContentPanel mapPanel;

    @UiField(provided = true)
    ContentPanel archivePanel;

    @UiField
    BorderLayoutContainer container;

    @UiField
    BorderLayoutContainer.BorderLayoutData southData;

    class ExpandCollapseHandler implements ResizeHandler, SelectEvent.SelectHandler {
        final int toolbarSize;
        final BorderLayoutContainer.BorderLayoutData layoutData;
        final Style.LayoutRegion region;
        final ContentPanel panel;
        final ToolButton btnExpandCollapse;

        int previousSize = 200;
        boolean expanded;

        ExpandCollapseHandler(BorderLayoutContainer.BorderLayoutData layoutData,
                              Style.LayoutRegion region,
                              ContentPanel panel,
                              int toolbarSize) {
            this.layoutData = layoutData;
            this.region = region;
            this.panel = panel;
            this.toolbarSize = toolbarSize;
            this.btnExpandCollapse = new ToolButton(ToolButton.DOUBLEUP);

            panel.addTool(btnExpandCollapse);

            btnExpandCollapse.addSelectHandler(this);
            panel.addResizeHandler(this);
        }

        @Override
        public void onResize(ResizeEvent resizeEvent) {
            setExpanded(layoutData.getSize() > toolbarSize);
        }

        void setExpanded(boolean expanded) {
            if (expanded != this.expanded) {
                if (!expanded) {
                    previousSize = (int) layoutData.getSize();
                    if (previousSize <= toolbarSize) {
                        previousSize = toolbarSize * 3;
                    }
                }
                btnExpandCollapse.changeStyle(expanded ? ToolButton.DOUBLEDOWN : ToolButton.DOUBLEUP);
            }
            this.expanded = expanded;
        }

        @Override
        public void onSelect(SelectEvent event) {
            setExpanded(!expanded);
            layoutData.setSize(expanded ? previousSize : toolbarSize);
            container.show(region);
        }
    }

    public ApplicationView(ContentPanel deviceView, ContentPanel mapView, ContentPanel archiveView) {
        devicePanel = deviceView;
        mapPanel = mapView;
        archivePanel = archiveView;

        initWidget(uiBinder.createAndBindUi(this));

        new ExpandCollapseHandler(southData, Style.LayoutRegion.SOUTH, archivePanel, 52);
    }
}
