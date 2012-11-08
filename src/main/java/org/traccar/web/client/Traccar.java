package org.traccar.web.client;

import com.google.gwt.core.client.EntryPoint;
import com.smartgwt.client.types.Alignment;
import com.smartgwt.client.types.Overflow;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.Label;
import com.smartgwt.client.widgets.layout.HLayout;
import com.smartgwt.client.widgets.layout.VLayout;

import org.traccar.web.client.login.LoginDialog;

/**
 * Entry point class
 */
public class Traccar implements EntryPoint {

    private DevicePanel devicePanel;
    private ArchivePanel archivePanel;
    private MapPanel mapPanel;

    /**
     * Entry point method
     */
    public void onModuleLoad() {

        /*LoginDialog loginDialog = new LoginDialog();
        loginDialog.draw();
        loginDialog.centerInPage();*/

        devicePanel = new DevicePanel();
        devicePanel.setWidth("20%");
        devicePanel.setShowResizeBar(true);

        mapPanel = new MapPanel();
        mapPanel.setWidth("80%");

        HLayout hLayout = new HLayout();
        hLayout.setHeight("70%");
        hLayout.addMember(devicePanel);
        hLayout.addMember(mapPanel);
        hLayout.setShowResizeBar(true);
        hLayout.setResizeBarTarget("next");

        archivePanel = new ArchivePanel();
        archivePanel.setHeight("30%");

        VLayout mainLayout = new VLayout();
        mainLayout.setWidth100();
        mainLayout.setHeight100();
        mainLayout.addMember(hLayout);
        mainLayout.addMember(archivePanel);
        mainLayout.draw();
    }
}
