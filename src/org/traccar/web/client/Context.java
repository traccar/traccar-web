package org.traccar.web.client;

import org.traccar.web.shared.model.ApplicationSettings;
import org.traccar.web.shared.model.UserSettings;

public class Context {

    private static final Context context = new Context();

    public Context getInstance() {
        return context;
    }

    private ApplicationSettings applicationSettings;

    public void setApplicationSettings(ApplicationSettings applicationSettings) {
        this.applicationSettings = applicationSettings;
    }

    public ApplicationSettings getApplicationSettings() {
        if (applicationSettings != null) {
            return applicationSettings;
        } else {
            return new ApplicationSettings(); // default settings
        }
    }

    private UserSettings userSettings;

    public void setUserSettings(UserSettings userSettings) {
        this.userSettings = userSettings;
    }

    public UserSettings getUserSettings() {
        if (userSettings != null) {
            return userSettings;
        } else {
            return new UserSettings(); // default settings
        }
    }

}
