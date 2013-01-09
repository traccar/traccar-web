package org.traccar.web.client.controller;

import java.util.Date;
import java.util.List;

import org.traccar.web.client.Application;
import org.traccar.web.client.model.BaseAsyncCallback;
import org.traccar.web.client.model.PositionProperties;
import org.traccar.web.client.view.ArchiveView;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.core.client.GWT;
import com.sencha.gxt.data.shared.ListStore;
import com.sencha.gxt.widget.core.client.ContentPanel;
import com.sencha.gxt.widget.core.client.box.AlertMessageBox;

public class ArchiveController implements ContentController, ArchiveView.ArchiveHandler {

    public interface ArchiveHandler {
        public void onSelected(Position position);
    }

    private ArchiveHandler archiveHandler;

    private ListStore<Position> positionStore;

    private ArchiveView archiveView;

    public ArchiveController(ArchiveHandler archiveHandler, ListStore<Device> deviceStore) {
        this.archiveHandler = archiveHandler;
        PositionProperties positionProperties = GWT.create(PositionProperties.class);
        positionStore = new ListStore<Position>(positionProperties.id());
        archiveView = new ArchiveView(this, positionStore, deviceStore);
    }

    public ListStore<Position> getPositionStore() {
        return positionStore;
    }

    @Override
    public ContentPanel getView() {
        return archiveView.getView();
    }

    @Override
    public void run() {
    }

    @Override
    public void onSelected(Position position) {
        archiveHandler.onSelected(position);
    }

    @Override
    public void onLoad(Device device, Date from, Date to) {
        if (device != null && from != null && to != null) {
            Application.getDataService().getPositions(device, from, to, new BaseAsyncCallback<List<Position>>() {
                @Override
                public void onSuccess(List<Position> result) {
                    positionStore.clear();
                    positionStore.addAll(result);
                }
            });
        } else {
            new AlertMessageBox("Error", "All form fields must be filled first").show();
        }
    }

    @Override
    public void onClear() {
        positionStore.clear();
    }

}
