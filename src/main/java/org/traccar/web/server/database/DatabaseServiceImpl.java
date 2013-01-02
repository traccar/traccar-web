package org.traccar.web.server.database;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import javax.servlet.ServletException;
import javax.servlet.http.HttpSession;

import org.traccar.web.client.database.DatabaseService;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;
import org.traccar.web.shared.model.User;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

public class DatabaseServiceImpl extends RemoteServiceServlet implements DatabaseService {

    private static final long serialVersionUID = 1;

    private static final String PERSISTENCE_UNIT = "traccar";
    private static final String ATTRIBUTE_USER = "user";

    private EntityManager entityManager;

    @Override
    public void init() throws ServletException {
        super.init();
        entityManager = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT).createEntityManager();
    }

    private void setUser(User user) {
        HttpSession session = getThreadLocalRequest().getSession();
        session.setAttribute(ATTRIBUTE_USER, user);
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
    public boolean authenticate(String login, String password) {
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
    public boolean register(String login, String password) {
        User user = new User();
        user.setLogin(login);
        user.setPassword(password);
        entityManager.getTransaction().begin();
        try {
            entityManager.persist(user);
        } finally {
            entityManager.getTransaction().commit();
        }
        setUser(user);
        return true;
    }

    @Override
    public List<Device> getDevices() {
        User user = getUser();
        List<Device> devices = new LinkedList<Device>();
        for (Device device : user.getDevices()) {
            devices.add(device);
        }
        return devices;
    }

    @Override
    public boolean storeDevice(Device device) {
        User user = getUser();
        boolean isNew = device.getId() == 0;
        entityManager.getTransaction().begin();
        try {
            device = entityManager.merge(device);
            if (isNew) {
                user.getDevices().add(device);
            }
        } finally {
            entityManager.getTransaction().commit();
        }
        return true;
    }

    @Override
    public boolean removeDevice(Device device) {
        User user = getUser();
        entityManager.getTransaction().begin();
        try {
            device = entityManager.merge(device);
            user.getDevices().remove(device);
            entityManager.remove(device);
        } finally {
            entityManager.getTransaction().commit();
        }
        return true;
    }

    @Override
    public List<Position> getPositions(Device device, Date from, Date to) {
        TypedQuery<Position> query = entityManager.createQuery(
                "SELECT x FROM Position x WHERE x.device = :device AND x.time BETWEEN :from AND :to", Position.class);
        query.setParameter("device", device);
        query.setParameter("from", from);
        query.setParameter("to", to);

        List<Position> positions = new LinkedList<Position>();
        for (Position position : query.getResultList()) {
            positions.add(position);
        }
        return positions;
    }

}
