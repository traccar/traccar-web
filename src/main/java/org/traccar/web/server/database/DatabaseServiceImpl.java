package org.traccar.web.server.database;

import javax.persistence.EntityManager;
import javax.persistence.Persistence;

import org.traccar.web.client.database.DatabaseService;
import org.traccar.web.shared.model.User;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

public class DatabaseServiceImpl extends RemoteServiceServlet implements DatabaseService {

    public boolean authenticate(String login, String password) {

        EntityManager entityManager = Persistence.createEntityManagerFactory("traccar").createEntityManager();
        entityManager.getTransaction().begin();

        User user = new User();
        user.setLogin("test");
        user.setPassword("1");

        entityManager.persist(user);
        entityManager.getTransaction().commit();

        //User foundUser = entityManager.find(User.class, user.getId());
        entityManager.close();

        if (login.equals("test") && password.equals("test")) {
            return true;
        }
        return false;
    }

}
