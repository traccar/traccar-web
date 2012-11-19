package org.traccar.web.client.database;

import com.google.gwt.core.client.GWT;

public class GlobalDatabaseService {

    private static final DatabaseServiceAsync databaseService = GWT.create(DatabaseService.class);

    public static DatabaseServiceAsync getInstance() {
        return databaseService;
    }

}
