package org.traccar.web.shared.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="user_settings")
public class UserSettings implements Serializable {

    private static final long serialVersionUID = 1;

    @Id
    @GeneratedValue
    private long id;

    public UserSettings() {
        speedUnit = SpeedUnit.knots;
    }

    public enum SpeedUnit {
        knots("kn", 1d),
        kilometersPerHour("km/h", 1.852),
        milesPerHour("mph", 1.150779);

        final String unit;
        final double factor;

        SpeedUnit(String unit, double factor) {
            this.unit = unit;
            this.factor = factor;
        }

        public double getFactor() {
            return factor;
        }

        public String getUnit() {
            return unit;
        }

        public double toKnots(double speed) {
            return speed / factor;
        }
    }

    @Enumerated(EnumType.STRING)
    private SpeedUnit speedUnit;

    public void setSpeedUnit(SpeedUnit speedUnit) {
        this.speedUnit = speedUnit;
    }

    public SpeedUnit getSpeedUnit() {
        return speedUnit;
    }

}
