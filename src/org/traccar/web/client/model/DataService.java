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

import org.traccar.web.shared.model.ApplicationSettings;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;
import org.traccar.web.shared.model.User;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("dataService")
public interface DataService extends RemoteService {

    User authenticated() throws IllegalStateException;

    User login(String login, String password);

    boolean logout();

    User register(String login, String password);

    List<User> getUsers();

    User addUser(User user);

    User updateUser(User user);

    User removeUser(User user);

    List<Device> getDevices();

    Device addDevice(Device device);

    Device updateDevice(Device device);

    Device removeDevice(Device device);

    List<Position> getPositions(Device device, Date from, Date to);

    List<Position> getLatestPositions();

    ApplicationSettings updateApplicationSettings(ApplicationSettings applicationSettings);

}
