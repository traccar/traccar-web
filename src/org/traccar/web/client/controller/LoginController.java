/*
 * Copyright 2013 Anton Tananaev (anton.tananaev@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.traccar.web.client.controller;

import org.traccar.web.client.Application;
import org.traccar.web.client.ApplicationContext;
import org.traccar.web.client.model.BaseAsyncCallback;
import org.traccar.web.client.view.LoginDialog;
import org.traccar.web.shared.model.User;

import com.sencha.gxt.widget.core.client.box.AlertMessageBox;

public class LoginController implements LoginDialog.LoginHandler {

    private LoginDialog dialog;

    public interface LoginHandler {
        public void onLogin();
    }

    private LoginHandler loginHandler;

    public void login(final LoginHandler loginHandler) {
        this.loginHandler = loginHandler;

        Application.getDataService().authenticated(new BaseAsyncCallback<User>() {
            @Override
            public void onSuccess(User result) {
                ApplicationContext.getInstance().setUser(result);
                loginHandler.onLogin();
            }
            @Override
            public void onFailure(Throwable caught) {
                dialog = new LoginDialog(LoginController.this);
                dialog.show();
            }
        });
    }

    private boolean validate(String login, String password) {
        if (login == null || login.isEmpty() || password == null || password.isEmpty()) {
            new AlertMessageBox("Error", "User name and password must not be empty").show();
            return false;
        }
        return true;
    }

    @Override
    public void onLogin(String login, String password) {
        if (validate(login, password)) {
            Application.getDataService().login(login, password, new BaseAsyncCallback<User>() {
                @Override
                public void onSuccess(User result) {
                    ApplicationContext.getInstance().setUser(result);
                    if (loginHandler != null) {
                        dialog.hide();
                        loginHandler.onLogin();
                    }
                }
                @Override
                public void onFailure(Throwable caught) {
                    new AlertMessageBox("Error", "User name or password is invalid").show();
                }
            });
        }
    }

    @Override
    public void onRegister(String login, String password) {
        if (validate(login, password)) {
            Application.getDataService().register(login, password, new BaseAsyncCallback<User>() {
                @Override
                public void onSuccess(User result) {
                    ApplicationContext.getInstance().setUser(result);
                    if (loginHandler != null) {
                        dialog.hide();
                        loginHandler.onLogin();
                    }
                }
            });
        }
    }

}
