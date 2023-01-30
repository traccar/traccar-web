/*
 * Copyright 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2017 Andrey Kunitsyn (andrey@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.view.dialog.DeviceController', {
    extend: 'Traccar.view.dialog.BaseEditController',
    alias: 'controller.device',

    init: function () {
        // Criado por Guilherme Crocetti para editar as permissões dos usuários em Dispositivos edit

        if (!Traccar.app.getUser().get('administrator') &&
        !Traccar.app.getBooleanAttributePreference('ui.enableEditDevice') &&
        Traccar.app.getUser().get('deviceReadonly')) {
            this.lookupReference('nameField').setDisabled(true);
            this.lookupReference('uniqueIdField').setDisabled(true);
            this.lookupReference('groupField').setHidden(true);
            this.lookupReference('modelField').setHidden(true);
            this.lookupReference('phoneField').setHidden(true);
            this.lookupReference('contactField').setHidden(true);
        }

        if (Traccar.app.getBooleanAttributePreference('ui.enableEditDevice')) {
            this.lookupReference('uniqueIdField').setDisabled(true);
            this.lookupReference('groupField').setHidden(true);
            this.lookupReference('modelField').setHidden(true);
            this.lookupReference('phoneField').setHidden(true);
            this.lookupReference('contactField').setHidden(true);
        }


        if (Traccar.app.getUser().get('administrator')) {
            this.lookupReference('disabledField').setHidden(false);
        }


        /*
         * This.lookupReference('menuComputedAttributesButton').setHidden(
         *     Traccar.app.getBooleanAttributePreference('ui.disableComputedAttributes'));
         * this.lookupReference('menuCommandsButton').setHidden(Traccar.app.getPreference('limitCommands', false));
         * this.lookupReference('menuDeviceAccumulatorsButton').setHidden(
         *     !Traccar.app.getUser().get('administrator') || Traccar.app.getVehicleFeaturesDisabled());
         * this.lookupReference('menuMaintenancesButton').setHidden(
         *     Traccar.app.getVehicleFeaturesDisabled() || Traccar.app.getBooleanAttributePreference('ui.disableMaintenance'));
         */
    }


});
