package org.traccar.web.server.database;

import java.util.LinkedList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import javax.servlet.ServletException;
import javax.servlet.http.HttpSession;

import org.traccar.web.client.database.DatabaseService;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.User;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

public class DatabaseServiceImpl extends RemoteServiceServlet implements DatabaseService {

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
        entityManager.persist(user);
        entityManager.getTransaction().commit();
        setUser(user);
        return true;
    }

    @Override
    public List<Device> getDevices() {
        User user = getUser();
        if (user != null) {
            List<Device> devices = new LinkedList<Device>();
            for (Device device : user.getDevices()) {
                devices.add(device);
            }
            return devices;
        }
        return null;
    }

}
