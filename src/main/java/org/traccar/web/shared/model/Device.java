package org.traccar.web.shared.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "devices")
public class Device implements Serializable {

    private static final long serialVersionUID = 1;

    @Override
    public boolean equals(Object obj) {
        if (obj == null || obj.getClass() != this.getClass()) {
            return false;
        }
        return id == ((Device) obj).id;
    }

    @Override
    public int hashCode() {
        return (int) id;
    }

    public Device() {
    }

    // Constructor for testing
    public Device(long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue
    private long id;

    public long getId() {
        return id;
    }

    @Column(unique = true)
    private String uniqueId;

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    private String name;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
