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
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import javax.servlet.ServletException;
import javax.servlet.http.HttpSession;

import org.traccar.web.client.model.DataService;
import org.traccar.web.shared.model.ApplicationSettings;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;
import org.traccar.web.shared.model.User;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

public class DataServiceImpl extends RemoteServiceServlet implements DataService {

    private static final long serialVersionUID = 1;

    private static final String PERSISTENCE_DATASTORE = "java:/DefaultDS";
    private static final String PERSISTENCE_UNIT_DEBUG = "debug";
    private static final String PERSISTENCE_UNIT_RELEASE = "release";
    private static final String ATTRIBUTE_USER = "traccar.user";
    private static final String ATTRIBUTE_SETTINGS = "traccar.settings";

    private EntityManagerFactory entityManagerFactory;

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

        entityManagerFactory = Persistence.createEntityManagerFactory(persistenceUnit);

        // Create Administrator account
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            TypedQuery<User> query = entityManager.createQuery("SELECT x FROM User x WHERE x.login = 'admin'", User.class);
            List<User> results = query.getResultList();
            if (results.isEmpty()) {
                User user = new User();
                user.setLogin("admin");
                user.setPassword("admin");
                user.setAdmin(true);
                createUser(user);
            }
        } finally {
            entityManager.close();
        }
    }

    @Override
    public void destroy() {
        entityManagerFactory.close();
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
    public User login(String login, String password) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            TypedQuery<User> query = entityManager.createQuery(
                    "SELECT x FROM User x WHERE x.login = :login", User.class);
            query.setParameter("login", login);
            List<User> results = query.getResultList();

            if (!results.isEmpty() && password.equals(results.get(0).getPassword())) {
                User user = results.get(0);
                setUser(user);
                return user;
            }
            return null;
        } finally {
            entityManager.close();
        }
    }

    @Override
    public boolean logout() {
        setUser(null);
        return true;
    }

    @Override
    public User register(String login, String password) {
        if (getApplicationSettings().getRegistrationEnabled()) {
            User user = new User();
            user.setLogin(login);
            user.setPassword(password);
            createUser(user);
            setUser(user);
            return user;
        } else {
            throw new SecurityException();
        }
    }

    @Override
    public User updateUser(User user) {
        User currentUser = getUser();
        if (currentUser.getAdmin() || (currentUser.getId() == user.getId() && !user.getAdmin())) {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            try {
                // TODO: better solution?
                if (currentUser.getId() == user.getId()) {
                    currentUser.setLogin(user.getLogin());
                    currentUser.setPassword(user.getPassword());
                    currentUser.setUserSettings(user.getUserSettings());
                    user = currentUser;
                } else {
                    // TODO: handle other users
                }

                entityManager.getTransaction().begin();
                try {
                    entityManager.merge(user);
                    entityManager.getTransaction().commit();
                    setUser(user);
                    return user;
                } catch (RuntimeException e) {
                    entityManager.getTransaction().rollback();
                    throw e;
                }
            } finally {
                entityManager.close();
            }
        } else {
            throw new SecurityException();
        }
    }

    private void createUser(User user) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            entityManager.getTransaction().begin();
            try {
                entityManager.persist(user);
                entityManager.getTransaction().commit();
            } catch (RuntimeException e) {
                entityManager.getTransaction().rollback();
                throw e;
            }
        } finally {
            entityManager.close();
        }
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
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            User user = getUser();
            entityManager.getTransaction().begin();
            try {
                entityManager.persist(device);
                user.getDevices().add(device);
                entityManager.merge(user);
                entityManager.getTransaction().commit();
                return device;
            } catch (RuntimeException e) {
                entityManager.getTransaction().rollback();
                throw e;
            }
        } finally {
            entityManager.close();
        }
    }

    @Override
    public Device updateDevice(Device device) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            entityManager.getTransaction().begin();
            try {
                device = entityManager.merge(device);
                entityManager.getTransaction().commit();
                return device;
            } catch (RuntimeException e) {
                entityManager.getTransaction().rollback();
                throw e;
            }
        } finally {
            entityManager.close();
        }
    }

    @Override
    public Device removeDevice(Device device) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            User user = getUser();
            entityManager.getTransaction().begin();
            try {
                device = entityManager.merge(device);
                user.getDevices().remove(device);
                entityManager.remove(device);
                entityManager.merge(user);
                entityManager.getTransaction().commit();
                return device;
            } catch (RuntimeException e) {
                entityManager.getTransaction().rollback();
                throw e;
            }
        } finally {
            entityManager.close();
        }
    }

    @Override
    public List<Position> getPositions(Device device, Date from, Date to) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            List<Position> positions = new LinkedList<Position>();
            TypedQuery<Position> query = entityManager.createQuery(
                    "SELECT x FROM Position x WHERE x.device = :device AND x.time BETWEEN :from AND :to", Position.class);
            query.setParameter("device", device);
            query.setParameter("from", from);
            query.setParameter("to", to);
            positions.addAll(query.getResultList());
            return positions;
        } finally {
            entityManager.close();
        }
    }

    @Override
    public List<Position> getLatestPositions() {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
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
        } finally {
            entityManager.close();
        }
    }

    private ApplicationSettings getApplicationSettings() {
        ApplicationSettings applicationSettings = (ApplicationSettings) getServletContext().getAttribute(ATTRIBUTE_SETTINGS);
        if (applicationSettings == null) {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            try {
                TypedQuery<ApplicationSettings> query = entityManager.createQuery("SELECT x FROM ApplicationSettings x", ApplicationSettings.class);
                List<ApplicationSettings> resultList = query.getResultList();
                if (resultList == null || resultList.isEmpty()) {
                    applicationSettings = new ApplicationSettings();
                    entityManager.getTransaction().begin();
                    try {
                        entityManager.persist(applicationSettings);
                        entityManager.getTransaction().commit();
                    } catch (RuntimeException e) {
                        entityManager.getTransaction().rollback();
                        throw e;
                    }
                } else {
                    applicationSettings = resultList.get(0);
                }
                getServletContext().setAttribute(ATTRIBUTE_SETTINGS, applicationSettings);
            } finally {
                entityManager.close();
            }
        }
        return applicationSettings;
    }

    @Override
    public ApplicationSettings updateApplicationSettings(ApplicationSettings applicationSettings) {
        if (applicationSettings == null) {
            return getApplicationSettings();
        } else {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            try {
                User user = getUser();
                if (user.getAdmin()) {
                    entityManager.getTransaction().begin();
                    try {
                        entityManager.merge(applicationSettings);
                        entityManager.getTransaction().commit();
                        getServletContext().setAttribute(ATTRIBUTE_SETTINGS, applicationSettings);
                        return applicationSettings;
                    } catch (RuntimeException e) {
                        entityManager.getTransaction().rollback();
                        throw e;
                    }
                } else {
                    throw new SecurityException();
                }
            } finally {
                entityManager.close();
            }
        }
    }

}
