package org.traccar.web.client.i18n;

import com.google.gwt.i18n.client.Constants;

public interface ApplicationConstants extends Constants {

    @DefaultStringValue("User Authentication")
    String userAuthentication();

    @DefaultStringValue("Login")
    String login();

    @DefaultStringValue("Password")
    String password();

    @DefaultStringValue("Register")
    String register();

    @DefaultStringValue("Login and password fields must not be blank")
    String blankLoginPassword();

    @DefaultStringValue("Remote procedure call error")
    String remoteProcedureCallError();

    @DefaultStringValue("Invalid login or password")
    String invalidLoginPassword();

    @DefaultStringValue("Registration failed")
    String registrationError();

    @DefaultStringValue("Devices")
    String devices();

    @DefaultStringValue("Add")
    String add();

    @DefaultStringValue("Remove")
    String remove();

    @DefaultStringValue("Edit")
    String edit();

    @DefaultStringValue("Settings")
    String settings();

    @DefaultStringValue("Object")
    String object();

    @DefaultStringValue("Unique Identifier")
    String id();

    @DefaultStringValue("Name")
    String name();

}
