package org.traccar.web.shared.model;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="users")
public class User implements Serializable, Cloneable {

    private static final long serialVersionUID = 1;

    public User() {
    }

    public User(User user) {
        id = user.id;
        login = user.login;
        password = user.password;
    }

    @Id
    @GeneratedValue
    private long id;

    public long getId() {
        return id;
    }

    @Column(unique = true)
    private String login;

    public void setLogin(String login) {
        this.login = login;
    }

    public String getLogin() {
        return login;
    }

    private String password;

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    @OneToMany
    private List<Device> devices = new LinkedList<Device>();

    public List<Device> getDevices() {
        return devices;
    }

}
