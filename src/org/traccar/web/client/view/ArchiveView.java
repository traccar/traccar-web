package org.traccar.web.client.view;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.traccar.web.client.model.PositionProperties;
import org.traccar.web.shared.model.Position;

import com.google.gwt.cell.client.DateCell;
import com.google.gwt.core.client.GWT;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.sencha.gxt.data.shared.ListStore;
import com.sencha.gxt.widget.core.client.ContentPanel;
import com.sencha.gxt.widget.core.client.grid.ColumnConfig;
import com.sencha.gxt.widget.core.client.grid.ColumnModel;
import com.sencha.gxt.widget.core.client.grid.Grid;

public class ArchiveView extends Composite {

    private static ArchiveViewUiBinder uiBinder = GWT.create(ArchiveViewUiBinder.class);

    interface ArchiveViewUiBinder extends UiBinder<Widget, ArchiveView> {
    }

    public interface ArchiveHandler {
        public void onSelected(Position position);
    }

    private ArchiveHandler archiveHandler;

    @UiField
    ContentPanel contentPanel;

    public ContentPanel getView() {
        return contentPanel;
    }

    @UiField(provided = true)
    ColumnModel<Position> columnModel;

    @UiField(provided = true)
    ListStore<Position> store;

    @UiField
    Grid<Position> grid;

    public ArchiveView(ArchiveHandler archiveHandler) {
        this.archiveHandler = archiveHandler;

        PositionProperties positionProperties = GWT.create(PositionProperties.class);

        List<ColumnConfig<Position, ?>> columnConfigList = new LinkedList<ColumnConfig<Position, ?>>();

        columnConfigList.add(new ColumnConfig<Position, Boolean>(positionProperties.valid(), 0, "Valid"));

        ColumnConfig<Position, Date> columnConfig = new ColumnConfig<Position, Date>(positionProperties.time(), 0, "Time");
        columnConfig.setCell(new DateCell(DateTimeFormat.getFormat("yyyy-MM-dd HH:mm:ss")));
        columnConfigList.add(columnConfig);

        columnConfigList.add(new ColumnConfig<Position, Double>(positionProperties.latitude(), 0, "Latitude"));
        columnConfigList.add(new ColumnConfig<Position, Double>(positionProperties.longitude(), 0, "Longitude"));
        columnConfigList.add(new ColumnConfig<Position, Double>(positionProperties.altitude(), 0, "Altitude"));
        columnConfigList.add(new ColumnConfig<Position, Double>(positionProperties.speed(), 0, "Speed"));
        columnConfigList.add(new ColumnConfig<Position, Double>(positionProperties.course(), 0, "Course"));
        columnConfigList.add(new ColumnConfig<Position, Double>(positionProperties.power(), 0, "Power"));

        columnModel = new ColumnModel<Position>(columnConfigList);

        store = new ListStore<Position>(positionProperties.id());

        uiBinder.createAndBindUi(this);
    }

}
