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
package org.traccar.web.client.model;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.traccar.web.shared.model.ApplicationSettings;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;
import org.traccar.web.shared.model.User;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface DataServiceAsync {

    void authenticated(AsyncCallback<User> callback);

    void login(String login, String password, AsyncCallback<User> callback);

    void logout(AsyncCallback<Boolean> callback);

    void register(String login, String password, AsyncCallback<User> callback);

    void getUsers(AsyncCallback<List<User>> callback);

    void addUser(User user, AsyncCallback<User> callback);

    void updateUser(User user, AsyncCallback<User> callback);

    void removeUser(User user, AsyncCallback<User> callback);

    void getDevices(AsyncCallback<List<Device>> callback);

    void addDevice(Device device, AsyncCallback<Device> callback);

    void updateDevice(Device device, AsyncCallback<Device> callback);

    void removeDevice(Device device, AsyncCallback<Device> callback);

    void getLatestPositions(AsyncCallback<List<Position>> callback);

    void getPositions(Device device, Date from, Date to, String speedModifier, Double speed, AsyncCallback<List<Position>> callback);

    void updateApplicationSettings(ApplicationSettings applicationSettings, AsyncCallback<Void> callback);

    void getApplicationSettings(AsyncCallback<ApplicationSettings> async);

    void getTrackerServerLog(short sizeKB, AsyncCallback<String> async);

    void saveRoles(List<User> users, AsyncCallback<Void> async);

    void getDeviceShare(Device device, AsyncCallback<Map<User, Boolean>> async);

    void saveDeviceShare(Device device, Map<User, Boolean> share, AsyncCallback<Void> async);

    void getLatestNonIdlePositions(AsyncCallback<List<Position>> async);
}
