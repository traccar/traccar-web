package org.traccar.web.client;

import com.google.gwt.i18n.client.CurrencyList;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.NumberFormat;
import org.traccar.web.shared.model.UserSettings;

public class FormatterUtil {

    public DateTimeFormat getTimeFormat() {
        return DateTimeFormat.getFormat("yyyy-MM-dd HH:mm:ss");
    }

    private class SpeedNumberFormat extends NumberFormat {

        private final UserSettings.SpeedUnit speedUnit;

        public SpeedNumberFormat(UserSettings.SpeedUnit speedUnit) {
            super("0.##", CurrencyList.get().getDefault(), true);
            this.speedUnit = speedUnit;
        }

        @Override
        public String format(double number) {
            return super.format(number * speedUnit.getFactor()) + " " + speedUnit.getUnit();
        }

    }

    public NumberFormat getSpeedFormat() {
        return new SpeedNumberFormat(ApplicationContext.getInstance().getUserSettings().getSpeedUnit());
    }
}
