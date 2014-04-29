package org.traccar.web.client;

import org.traccar.web.shared.model.ApplicationSettings;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.User;
import org.traccar.web.shared.model.UserSettings;

import java.util.HashSet;
import java.util.Set;

public class ApplicationContext {

    private static final ApplicationContext context = new ApplicationContext();

    public static ApplicationContext getInstance() {
        return context;
    }

    private FormatterUtil formatterUtil;

    public void setFormatterUtil(FormatterUtil formatterUtil) {
        this.formatterUtil = formatterUtil;
    }

    public FormatterUtil getFormatterUtil() {
        if (formatterUtil == null) {
            formatterUtil = new FormatterUtil();
        }
        return formatterUtil;
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

    private User user;

    public void setUser(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public void setUserSettings(UserSettings userSettings) {
        if (user != null) {
            user.setUserSettings(userSettings);
        }
    }

    public UserSettings getUserSettings() {
        if (user != null && user.getUserSettings() != null) {
            return user.getUserSettings();
        } else {
            return new UserSettings(); // default settings
        }
    }

    private Set<Long> trackedDeviceIds;
    public void trackDevice(Device device) {
        if (trackedDeviceIds == null) {
            trackedDeviceIds = new HashSet<Long>();
        }
        trackedDeviceIds.add(device.getId());
    }

    public void stopTracking(Device device) {
        if (trackedDeviceIds != null) {
            trackedDeviceIds.remove(device.getId());
        }
    }

    public boolean isTracking(Device device) {
        return trackedDeviceIds != null && trackedDeviceIds.contains(device.getId());
    }
}
