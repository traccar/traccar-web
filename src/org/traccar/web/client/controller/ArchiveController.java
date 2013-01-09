package org.traccar.web.client.controller;

import java.util.Collection;

import org.traccar.web.client.view.ArchiveView;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.sencha.gxt.widget.core.client.ContentPanel;

public class ArchiveController implements ContentController, ArchiveView.ArchiveHandler {

    public interface ArchiveHandler {
        public void onSelected(Position position);
    }

    private ArchiveHandler archiveHandler;

    private ArchiveView archiveView;

    public ArchiveController(ArchiveHandler archiveHandler) {
        this.archiveHandler = archiveHandler;
        archiveView = new ArchiveView(this);
    }

    @Override
    public ContentPanel getView() {
        return archiveView.getView();
    }

    @Override
    public void run() {
    }

    public void updateDevices(Collection<Device> devices) {

    }

    @Override
    public void onSelected(Position position) {
        archiveHandler.onSelected(position);
    }

}
