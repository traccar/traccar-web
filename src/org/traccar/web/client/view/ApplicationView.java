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
    ContentPanel mapPanel;

    @UiField(provided = true)
    ContentPanel archivePanel;

    public ApplicationView(ContentPanel deviceView, ContentPanel mapView, ContentPanel archiveView) {
        devicePanel = deviceView;
        mapPanel = mapView;
        archivePanel = archiveView;
        initWidget(uiBinder.createAndBindUi(this));
    }

}
