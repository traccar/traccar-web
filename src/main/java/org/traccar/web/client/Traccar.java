package org.traccar.web.client;

import org.traccar.web.client.database.DatabaseService;
import org.traccar.web.client.database.DatabaseServiceAsync;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.smartgwt.client.util.SC;

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

        DatabaseServiceAsync databaseService = GWT.create(DatabaseService.class);

        AsyncCallback<Boolean> callback = new AsyncCallback<Boolean>() {
            public void onFailure(Throwable caught) {
                SC.say("onFailure: " + caught.toString());
            }

            public void onSuccess(Boolean result) {
                SC.say("onSuccess: " + result);
            }
        };

        databaseService.authenticate("test", "test", callback);

        /*LoginDialog loginDialog = new LoginDialog();
        loginDialog.draw();
        loginDialog.centerInPage();*/

        /*devicePanel = new DevicePanel();
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
        mainLayout.draw();*/
    }
}
