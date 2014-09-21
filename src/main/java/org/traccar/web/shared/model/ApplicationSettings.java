package org.traccar.web.shared.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="application_settings")
public class ApplicationSettings implements Serializable {

    private static final long serialVersionUID = 1;
    public static final short DEFAULT_UPDATE_INTERVAL = 15000;

    @Id
    @GeneratedValue
    private long id;

    public ApplicationSettings() {
        registrationEnabled = true;
        updateInterval = Short.valueOf(DEFAULT_UPDATE_INTERVAL);
    }

    private boolean registrationEnabled;

    private Short updateInterval;

    private boolean disallowDeviceManagementByUsers;

    public void setRegistrationEnabled(boolean registrationEnabled) {
        this.registrationEnabled = registrationEnabled;
    }

    public boolean getRegistrationEnabled() {
        return registrationEnabled;
    }

    public Short getUpdateInterval() {
        return updateInterval;
    }

    public void setUpdateInterval(Short updateInterval) {
        this.updateInterval = updateInterval;
    }

    public boolean isDisallowDeviceManagementByUsers() {
        return disallowDeviceManagementByUsers;
    }

    public void setDisallowDeviceManagementByUsers(boolean disallowDeviceManagementByUsers) {
        this.disallowDeviceManagementByUsers = disallowDeviceManagementByUsers;
    }
}
