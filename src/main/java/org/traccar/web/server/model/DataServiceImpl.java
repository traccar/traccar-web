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

import java.io.*;
import java.util.*;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.servlet.ServletException;
import javax.servlet.http.HttpSession;

import org.traccar.web.client.model.DataService;
import org.traccar.web.shared.model.*;

public class DataServiceImpl extends AOPRemoteServiceServlet implements DataService {

    private static final long serialVersionUID = 1;

    private static final String PERSISTENCE_DATASTORE = "java:/DefaultDS";
    private static final String PERSISTENCE_UNIT_DEBUG = "debug";
    private static final String PERSISTENCE_UNIT_RELEASE = "release";
    private static final String ATTRIBUTE_USER_ID = "traccar.user.id";

    private EntityManagerFactory entityManagerFactory;
    private ThreadLocal<EntityManager> entityManager;

    public DataServiceImpl() {
        super(DataService.class);
    }

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
        entityManager = new ThreadLocal<EntityManager>();

        /**
         * Perform database migrations
         */
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            new DBMigrations().migrate(entityManager);
        } catch (Exception e) {
            throw new RuntimeException("Unable to perform DB migrations", e);
        } finally {
            entityManager.close();
        }
    }

    @Override
    EntityManager getSessionEntityManager() {
        if (entityManager.get() == null) {
            entityManager.set(entityManagerFactory.createEntityManager());
        }
        return entityManager.get();
    }

    @Override
    void closeSessionEntityManager() {
        if (entityManager.get() != null) {
            entityManager.get().close();
            entityManager.set(null);
        }
    }

    private void setSessionUser(User user) {
        HttpSession session = getThreadLocalRequest().getSession();
        if (user != null) {
            session.setAttribute(ATTRIBUTE_USER_ID, user.getId());
        } else {
            session.removeAttribute(ATTRIBUTE_USER_ID);
        }
    }

    @Override
    User getSessionUser() {
        HttpSession session = getThreadLocalRequest().getSession();
        Long userId = (Long) session.getAttribute(ATTRIBUTE_USER_ID);
        return userId == null ? null : getSessionEntityManager().find(User.class, userId);
    }

    @Transactional
    @RequireUser
    @Override
    public User authenticated() throws IllegalStateException {
        return getSessionUser();
    }

    @Transactional
    @Override
    public User login(String login, String password) {
        EntityManager entityManager = getSessionEntityManager();
        TypedQuery<User> query = entityManager.createQuery(
                "SELECT x FROM User x WHERE x.login = :login", User.class);
        query.setParameter("login", login);
        List<User> results = query.getResultList();

        if (!results.isEmpty() && password.equals(results.get(0).getPassword())) {
            User user = results.get(0);
            setSessionUser(user);
            return user;
        }
        throw new IllegalStateException();
    }

    @RequireUser
    @Override
    public boolean logout() {
        setSessionUser(null);
        return true;
    }

    @Transactional(commit = true)
    @Override
    public User register(String login, String password) {
        if (getApplicationSettings().getRegistrationEnabled()) {
            TypedQuery<User> query = getSessionEntityManager().createQuery(
                    "SELECT x FROM User x WHERE x.login = :login", User.class);
            query.setParameter("login", login);
            List<User> results = query.getResultList();
            if (results.isEmpty()) {
                    User user = new User();
                    user.setLogin(login);
                    user.setPassword(password);
                    user.setManager(Boolean.TRUE); // registered users are always managers
                    getSessionEntityManager().persist(user);
                    setSessionUser(user);
                    return user;
            }
            else
            {
                throw new IllegalStateException();
            }
        } else {
            throw new SecurityException();
        }
    }

    @Transactional
    @RequireUser(roles = { Role.ADMIN, Role.MANAGER })
    @Override
    public List<User> getUsers() {
        User currentUser = getSessionUser();
        List<User> users = new LinkedList<User>();
        if (currentUser.getAdmin()) {
            users.addAll(getSessionEntityManager().createQuery("SELECT x FROM User x", User.class).getResultList());
        } else {
            users.addAll(currentUser.getAllManagedUsers());
        }
        return users;
    }

    @Transactional(commit = true)
    @RequireUser(roles = { Role.ADMIN, Role.MANAGER })
    @Override
    public User addUser(User user) {
        User currentUser = getSessionUser();
        if (user.getLogin().isEmpty() || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException();
        }
        String login = user.getLogin();
        TypedQuery<User> query = getSessionEntityManager().createQuery("SELECT x FROM User x WHERE x.login = :login", User.class);
        query.setParameter("login", login);
        List<User> results = query.getResultList();

        if (results.isEmpty()) {
            if (!currentUser.getAdmin()) {
                user.setAdmin(false);
            }
            user.setManagedBy(currentUser);
            getSessionEntityManager().persist(user);
            return user;
        } else {
            throw new IllegalStateException();
        }
    }

    @Transactional(commit = true)
    @RequireUser
    @Override
    public User updateUser(User user) {
        User currentUser = getSessionUser();
        if (user.getLogin().isEmpty() || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException();
        }
        if (currentUser.getAdmin() || (currentUser.getId() == user.getId() && !user.getAdmin())) {
            EntityManager entityManager = getSessionEntityManager();
            // TODO: better solution?
            if (currentUser.getId() == user.getId()) {
                currentUser.setLogin(user.getLogin());
                currentUser.setPassword(user.getPassword());
                currentUser.setUserSettings(user.getUserSettings());
                currentUser.setAdmin(user.getAdmin());
                currentUser.setManager(user.getManager());
                entityManager.merge(currentUser);
                user = currentUser;
            } else {
                // TODO: handle other users
            }

            return user;
        } else {
            throw new SecurityException();
        }
    }

    @Transactional(commit = true)
    @RequireUser(roles = { Role.ADMIN, Role.MANAGER })
    @Override
    public User removeUser(User user) {
        EntityManager entityManager = getSessionEntityManager();
        user = entityManager.merge(user);
        for (Device device : user.getDevices()) {
            device.getUsers().remove(user);
        }
        entityManager.remove(user);
        return user;
    }

    @Transactional
    @RequireUser
    @Override
    public List<Device> getDevices() {
        User user = getSessionUser();
        if (user.getAdmin()) {
            return getSessionEntityManager().createQuery("SELECT x FROM Device x").getResultList();
        }
        return user.getAllAvailableDevices();
    }

    @Transactional(commit = true)
    @RequireUser
    @ManagesDevices
    @Override
    public Device addDevice(Device device) {
        EntityManager entityManager = getSessionEntityManager();
        TypedQuery<Device> query = entityManager.createQuery("SELECT x FROM Device x WHERE x.uniqueId = :id", Device.class);
        query.setParameter("id", device.getUniqueId());
        List<Device> results = query.getResultList();

        User user = getSessionUser();

        if (results.isEmpty()) {
            device.setUsers(new HashSet<User>(1));
            device.getUsers().add(user);
            entityManager.persist(device);
            return device;
        } else {
            throw new IllegalStateException();
        }
    }

    @Transactional(commit = true)
    @RequireUser
    @ManagesDevices
    @Override
    public Device updateDevice(Device device) {
        EntityManager entityManager = getSessionEntityManager();
        TypedQuery<Device> query = entityManager.createQuery("SELECT x FROM Device x WHERE x.uniqueId = :id AND x.id <> :primary_id", Device.class);
        query.setParameter("primary_id", device.getId());
        query.setParameter("id", device.getUniqueId());
        List<Device> results = query.getResultList();

        if (results.isEmpty()) {
            Device tmp_device = entityManager.find(Device.class, device.getId());
            tmp_device.setName(device.getName());
            tmp_device.setUniqueId(device.getUniqueId());
            tmp_device.setTimeout(device.getTimeout());
            tmp_device.setIdleSpeedThreshold(device.getIdleSpeedThreshold());
            return tmp_device;
        } else {
            throw new IllegalStateException();
        }
    }

    @Transactional(commit = true)
    @RequireUser
    @ManagesDevices
    @Override
    public Device removeDevice(Device device) {
        EntityManager entityManager = getSessionEntityManager();
        User user = getSessionUser();
        device = entityManager.find(Device.class, device.getId());
        if (user.getAdmin() || user.getManager()) {
            device.getUsers().removeAll(getUsers());
        }
        device.getUsers().remove(user);
        /**
         * Remove device only if there is no more associated users in DB
         */
        if (device.getUsers().isEmpty()) {
            device.setLatestPosition(null);
            entityManager.flush();
            Query query = entityManager.createQuery("DELETE FROM Position x WHERE x.device = :device");
            query.setParameter("device", device);
            query.executeUpdate();
            entityManager.remove(device);
        }
        return device;
    }

    @Transactional
    @RequireUser
    @Override
    public List<Position> getPositions(Device device, Date from, Date to, String speedModifier, Double speed) {
        EntityManager entityManager = getSessionEntityManager();
        List<Position> positions = new LinkedList<Position>();
        TypedQuery<Position> query = entityManager.createQuery(
                "SELECT x FROM Position x WHERE x.device = :device AND x.time BETWEEN :from AND :to" + (speed == null ? "" : " AND speed " + speedModifier + " :speed"), Position.class);
        query.setParameter("device", device);
        query.setParameter("from", from);
        query.setParameter("to", to);
        if (speed != null) {
            query.setParameter("speed", getSessionUser().getUserSettings().getSpeedUnit().toKnots(speed));
        }
        positions.addAll(query.getResultList());
        return positions;
    }

    @RequireUser
    @Transactional
    @Override
    public List<Position> getLatestPositions() {
        List<Position> positions = new LinkedList<Position>();
        List<Device> devices = getDevices();
        if (devices != null && !devices.isEmpty()) {
            for (Device device : devices) {
                if (device.getLatestPosition() != null) {
                    positions.add(device.getLatestPosition());
                }
            }
        }
        return positions;
    }

    @RequireUser
    @Transactional
    @Override
    public List<Position> getLatestNonIdlePositions() {
        List<Position> positions = new LinkedList<Position>();
        List<Device> devices = getDevices();
        if (devices != null && !devices.isEmpty()) {
            EntityManager entityManager = getSessionEntityManager();

            for (Device device : devices) {
                Position position = (Position) entityManager.createQuery("SELECT p FROM Position p WHERE p.device = :device AND p.speed > 0 ORDER BY time DESC")
                        .setParameter("device", device)
                        .setMaxResults(1)
                        .getSingleResult();

                if (position != null) {
                    positions.add(position);
                }
            }
        }
        return positions;
    }

    @Override
    public ApplicationSettings getApplicationSettings() {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            ApplicationSettings applicationSettings;
            TypedQuery<ApplicationSettings> query = entityManager.createQuery("SELECT x FROM ApplicationSettings x", ApplicationSettings.class);
            List<ApplicationSettings> resultList = query.getResultList();
            if (resultList == null || resultList.isEmpty()) {
                applicationSettings = new ApplicationSettings();
                entityManager.getTransaction().begin();
                try {
                    entityManager.persist(applicationSettings);
                    entityManager.getTransaction().commit();
                } catch (Throwable t) {
                    entityManager.getTransaction().rollback();
                    throw new IllegalStateException("Unable to save application settings");
                }
            } else {
                applicationSettings = resultList.get(0);
            }
            return applicationSettings;
        } finally {
            entityManager.close();
        }
    }

    @Transactional(commit = true)
    @RequireUser(roles = { Role.ADMIN })
    @Override
    public void updateApplicationSettings(ApplicationSettings applicationSettings) {
        getSessionEntityManager().merge(applicationSettings);
    }

    @Transactional
    @RequireUser(roles = { Role.ADMIN })
    @Override
    public String getTrackerServerLog(short sizeKB) {
        File workingFolder = new File(System.getProperty("user.dir"));
        File logFile1 = new File(workingFolder, "logs" + File.separatorChar + "tracker-server.log");
        File logFile2 = new File(workingFolder.getParentFile(), "logs" + File.separatorChar + "tracker-server.log");
        File logFile3 = new File(workingFolder, "tracker-server.log");

        File logFile = logFile1.exists() ? logFile1 :
                logFile2.exists() ? logFile2 :
                        logFile3.exists() ? logFile3 : null;

        if (logFile != null) {
            RandomAccessFile raf = null;
            try {
                raf = new RandomAccessFile(logFile, "r");
                int length = 0;
                if (raf.length() > Integer.MAX_VALUE) {
                    length = Integer.MAX_VALUE;
                } else {
                    length = (int) raf.length();
                }
                /**
                 * Read last 5 megabytes from file
                 */
                raf.seek(Math.max(0, raf.length() - sizeKB * 1024));
                byte[] result = new byte[Math.min(length, sizeKB * 1024)];
                raf.read(result);
                return new String(result);
            } catch (Exception ex) {
                ex.printStackTrace();
            } finally {
                try {
                    raf.close();
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        }

        return ("Tracker server log is not available. Looked at " + logFile1.getAbsolutePath() +
                ", " + logFile2.getAbsolutePath() +
                ", " + logFile3.getAbsolutePath());
    }

    @Transactional(commit = true)
    @RequireUser(roles = { Role.ADMIN, Role.MANAGER })
    @Override
    public void saveRoles(List<User> users) {
        if (users == null || users.isEmpty()) {
            return;
        }

        EntityManager entityManager = getSessionEntityManager();
        User currentUser = getSessionUser();
        for (User _user : users) {
            User user = entityManager.find(User.class, _user.getId());
            if (currentUser.getAdmin()) {
                user.setAdmin(_user.getAdmin());
            }
            user.setManager(_user.getManager());
        }
    }

    @Transactional
    @RequireUser
    @Override
    public Map<User, Boolean> getDeviceShare(Device device) {
        device = getSessionEntityManager().find(Device.class, device.getId());
        List<User> users = getUsers();
        Map<User, Boolean> result = new HashMap<User, Boolean>(users.size());
        for (User user : users) {
            result.put(user, device.getUsers().contains(user));
        }
        return result;
    }

    @Transactional(commit = true)
    @RequireUser(roles = { Role.ADMIN, Role.MANAGER })
    @Override
    public void saveDeviceShare(Device device, Map<User, Boolean> share) {
        EntityManager entityManager = getSessionEntityManager();
        device = entityManager.find(Device.class, device.getId());

        for (User user : getUsers()) {
            Boolean shared = share.get(user);
            if (shared == null) continue;
            if (shared.booleanValue()) {
                device.getUsers().add(user);
            } else {
                device.getUsers().remove(user);
            }
            entityManager.merge(user);
        }
    }
}
