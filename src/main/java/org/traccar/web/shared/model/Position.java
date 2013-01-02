package org.traccar.web.shared.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Index;

@Entity
@Table(name = "positions")
public class Position implements Serializable {

    private static final long serialVersionUID = 1;

    public Position() {
    }

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @Index(name = "positionsIndex")
    private Device device;

    public Device getDevice() {
        return device;
    }

    @Index(name = "positionsIndex")
    private Date time;

    public Date getTime() {
        return time;
    }

    private boolean valid;

    public boolean getValid() {
        return valid;
    }

    private double latitude;

    public double getLatitude() {
        return latitude;
    }

    private double longitude;

    public double getLongitude() {
        return longitude;
    }

    private double altitude;

    public double getAltitude() {
        return altitude;
    }

    private double speed;

    public double getSpeed() {
        return speed;
    }

    private double course;

    public double getCourse() {
        return course;
    }

    private double power;

    public double getPower() {
        return power;
    }

    private String address;

    public String getAddress() {
        return address;
    }

    private String other;

    public String getOther() {
        return other;
    }

}
