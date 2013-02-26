package org.traccar.web.client;

import com.google.gwt.i18n.client.CurrencyList;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.NumberFormat;

public class FormatterUtil {

    public DateTimeFormat getTimeFormat() {
        return DateTimeFormat.getFormat("yyyy-MM-dd HH:mm:ss");
    }

    private class SpeedNumberFormat extends NumberFormat {

        private final String unit;
        private final double factor;

        public SpeedNumberFormat(String unit, double factor) {
            super("0.##", CurrencyList.get().getDefault(), true);
            this.unit = unit;
            this.factor = factor;
        }

        @Override
        public String format(double number) {
            return super.format(number * factor) + " " + unit;
        }

    }

    public NumberFormat getSpeedFormat() {
        switch (ApplicationContext.getInstance().getUserSettings().getSpeedUnit()) {
        case kilometersPerHour:
            return new SpeedNumberFormat("km/h", 1.852);
        case milesPerHour:
            return new SpeedNumberFormat("mph", 1.150779);
        default:
            return new SpeedNumberFormat("kn", 1);
        }
    }

}
