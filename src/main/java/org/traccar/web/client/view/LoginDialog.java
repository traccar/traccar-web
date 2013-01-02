package org.traccar.web.client.view;

import org.traccar.web.client.Style;
import org.traccar.web.client.Traccar;

import com.smartgwt.client.types.Alignment;
import com.smartgwt.client.widgets.IButton;
import com.smartgwt.client.widgets.Window;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.PasswordItem;
import com.smartgwt.client.widgets.form.fields.TextItem;
import com.smartgwt.client.widgets.form.fields.ToolbarItem;
import com.smartgwt.client.widgets.layout.Layout;

public class LoginDialog extends Window {

    public interface LoginHandler {
        public void onLogin(String login, String password);
        public void onRegister(String login, String password);
    }

    private LoginHandler loginHandler;

    public void setLoginHandler(LoginHandler loginHandler) {
        this.loginHandler = loginHandler;
    }

    public LoginDialog() {

        // Window properties
        setTitle(Traccar.getConstants().userAuthentication());
        setShowCloseButton(false);
        setShowMinimizeButton(false);
        setAutoSize(true);
        setIsModal(true);

        // Login form
        final DynamicForm form = new DynamicForm();
        form.setHeight100();
        form.setWidth100();
        final TextItem loginEdit = new TextItem();
        loginEdit.setTitle(Traccar.getConstants().login());
        final PasswordItem passwordEdit = new PasswordItem();
        passwordEdit.setTitle(Traccar.getConstants().password());

        final ToolbarItem toolbarItem = new ToolbarItem();
        toolbarItem.setButtons(
                new IButton(Traccar.getConstants().login(), new ClickHandler() {
                    @Override
                    public void onClick(ClickEvent event) {
                        if (loginHandler != null) {
                            loginHandler.onLogin(
                                    loginEdit.getValueAsString(), passwordEdit.getValueAsString());
                        }
                    }
                }),
                new IButton(Traccar.getConstants().register(), new ClickHandler() {
                    @Override
                    public void onClick(ClickEvent event) {
                        if (loginHandler != null) {
                            loginHandler.onRegister(
                                    loginEdit.getValueAsString(), passwordEdit.getValueAsString());
                        }
                    }
                }));
        toolbarItem.setAlign(Alignment.RIGHT);
        toolbarItem.setColSpan(3);

        form.setFields(loginEdit, passwordEdit, toolbarItem);
        form.setCellPadding(Style.getCellPadding());

        final Layout layout = new Layout();
        layout.setPadding(Style.getPadding());

        layout.addMember(form);

        addItem(layout);
    }

}
