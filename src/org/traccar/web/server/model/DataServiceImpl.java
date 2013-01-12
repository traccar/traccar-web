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
package org.traccar.web.server.model;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import javax.servlet.ServletException;
import javax.servlet.http.HttpSession;

import org.traccar.web.client.model.DataService;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;
import org.traccar.web.shared.model.User;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

public class DataServiceImpl extends RemoteServiceServlet implements DataService {

    private static final long serialVersionUID = 1;

    private static final String PERSISTENCE_DATASTORE = "java:/DefaultDS";
    private static final String PERSISTENCE_UNIT_DEBUG = "debug";
    private static final String PERSISTENCE_UNIT_RELEASE = "release";
    private static final String ATTRIBUTE_USER = "user";

    private EntityManager entityManager;

    @Override
    public void init() throws ServletException {
        super.init();

        String persistenceUnit;
        try {
            Context context = new InitialContext();
            context.lookup(PERSISTENCE_DATASTORE);
            persistenceUnit = PERSISTENCE_UNIT_RELEASE;
        } catch (NamingException e) {
            persistenceUnit = PERSISTENCE_UNIT_DEBUG;
        }

        entityManager = Persistence.createEntityManagerFactory(persistenceUnit).createEntityManager();
    }

    @Override
    public void destroy() {
        entityManager.close();
        super.destroy();
    }

    private void setUser(User user) {
        HttpSession session = getThreadLocalRequest().getSession();
        if (user != null) {
            session.setAttribute(ATTRIBUTE_USER, user);
        } else {
            session.removeAttribute(ATTRIBUTE_USER);
        }
    }

    private User getUser() {
        HttpSession session = getThreadLocalRequest().getSession();
        return (User) session.getAttribute(ATTRIBUTE_USER);
    }

    @Override
    public boolean authenticated() {
        return (getUser() != null);
    }

    @Override
    public boolean login(String login, String password) {
        TypedQuery<User> query = entityManager.createQuery(
                "SELECT x FROM User x WHERE x.login = :login", User.class);
        query.setParameter("login", login);
        List<User> results = query.getResultList();

        if (!results.isEmpty() && password.equals(results.get(0).getPassword())) {
            setUser(results.get(0));
            return true;
        }
        return false;
    }

    @Override
    public boolean logout() {
        setUser(null);
        return true;
    }

    @Override
    public boolean register(String login, String password) {
        User user = new User();
        user.setLogin(login);
        user.setPassword(password);
        entityManager.getTransaction().begin();
        try {
            entityManager.persist(user);
            entityManager.getTransaction().commit();
        } catch (RuntimeException e) {
            entityManager.getTransaction().rollback();
            throw e;
        }
        setUser(user);
        return true;
    }

    @Override
    public List<Device> getDevices() {
        List<Device> devices = new LinkedList<Device>();
        User user = getUser();
        devices.addAll(user.getDevices());
        return devices;
    }

    @Override
    public Device addDevice(Device device) {
        User user = getUser();
        entityManager.getTransaction().begin();
        try {
            entityManager.persist(device);
            user.getDevices().add(device);
            entityManager.getTransaction().commit();
        } catch (RuntimeException e) {
            entityManager.getTransaction().rollback();
            throw e;
        }
        return device;
    }

    @Override
    public Device updateDevice(Device device) {
        entityManager.getTransaction().begin();
        try {
            device = entityManager.merge(device);
            entityManager.getTransaction().commit();
        } catch (RuntimeException e) {
            entityManager.getTransaction().rollback();
            throw e;
        }
        return device;
    }

    @Override
    public Device removeDevice(Device device) {
        User user = getUser();
        entityManager.getTransaction().begin();
        try {
            device = entityManager.merge(device);
            user.getDevices().remove(device);
            // If you want to remove device you need to remove all linked positions
            //entityManager.remove(device);
            entityManager.getTransaction().commit();
        } catch (RuntimeException e) {
            entityManager.getTransaction().rollback();

        }
        return device;
    }

    @Override
    public List<Position> getPositions(Device device, Date from, Date to) {
        List<Position> positions = new LinkedList<Position>();
        TypedQuery<Position> query = entityManager.createQuery(
                "SELECT x FROM Position x WHERE x.device = :device AND x.time BETWEEN :from AND :to", Position.class);
        query.setParameter("device", device);
        query.setParameter("from", from);
        query.setParameter("to", to);
        positions.addAll(query.getResultList());
        return positions;
    }

    @Override
    public List<Position> getLatestPositions() {
        List<Position> positions = new LinkedList<Position>();
        User user = getUser();
        if (user.getDevices() != null && !user.getDevices().isEmpty()) {
            TypedQuery<Position> query = entityManager.createQuery(
                    "SELECT x FROM Position x WHERE x.id IN (" +
                            "SELECT y.latestPosition FROM Device y WHERE y IN (:devices))", Position.class);
            query.setParameter("devices", user.getDevices());
            positions.addAll(query.getResultList());
        }
        return positions;
    }

}
