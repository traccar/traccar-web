package org.traccar.web.client;

import org.traccar.web.client.controller.ArchiveController;
import org.traccar.web.client.controller.DeviceController;
import org.traccar.web.client.controller.LoginController;
import org.traccar.web.client.controller.MapController;
import org.traccar.web.client.database.DatabaseService;
import org.traccar.web.client.database.DatabaseServiceAsync;
import org.traccar.web.client.i18n.ApplicationConstants;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.smartgwt.client.util.SC;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.layout.HLayout;
import com.smartgwt.client.widgets.layout.VLayout;

/**
 * Entry point class
 */
public class Traccar implements EntryPoint, LoginController.LoginHandler {

    private static final ApplicationConstants constants = GWT.create(ApplicationConstants.class);

    public static ApplicationConstants getConstants() {
        return constants;
    }

    private static final DatabaseServiceAsync databaseService = GWT.create(DatabaseService.class);

    public static DatabaseServiceAsync getDatabaseService() {
        return databaseService;
    }

    /**
     * Entry point method
     */
    @Override
    public void onModuleLoad() {
        new LoginController().login(this);
    }

    @Override
    public void onLogin() {
        createLayout();
    }

    private MapController mapController;
    private DeviceController deviceController;
    private ArchiveController archiveController;

    private void createLayout() {
        mapController = new MapController();
        deviceController = new DeviceController();
        archiveController = new ArchiveController();

        Canvas mainPanel = mapController.getView();
        mainPanel.setWidth("80%");

        Canvas leftPanel = deviceController.getView();
        leftPanel.setWidth("20%");
        leftPanel.setShowResizeBar(true);

        Canvas bottomPanel = archiveController.getView();
        bottomPanel.setHeight("30%");

        HLayout topLayout = new HLayout();
        topLayout.setHeight("70%");
        topLayout.addMember(leftPanel);
        topLayout.addMember(mainPanel);
        topLayout.setShowResizeBar(true);
        topLayout.setResizeBarTarget("next");

        VLayout mainLayout = new VLayout();
        mainLayout.setWidth100();
        mainLayout.setHeight100();
        mainLayout.addMember(topLayout);
        mainLayout.addMember(bottomPanel);

        deviceController.setSettingsClickHandler(new ClickHandler() {
            @Override
            public void onClick(ClickEvent event) {
                SC.say("Coming soon...");
            }
        });

        mainLayout.draw();
    }

}
