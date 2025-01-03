sap.ui.define([
    "sap/ui/core/UIComponent",
    "logaligroup/employees/model/models",
    "sap/ui/model/resource/ResourceModel"
], (UIComponent, models, ResourceModel) => {
    "use strict";

    return UIComponent.extend("logaligroup.employees.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // Llama a la función init del componente base
            UIComponent.prototype.init.apply(this, arguments);

            // Configura el modelo i18n
            const i18nModel = new ResourceModel({
                bundleName: "logaligroup.employees.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");

            // Configura el modelo del dispositivo
            this.setModel(models.createDeviceModel(), "device");

            // Habilita el enrutamiento
            this.getRouter().initialize();

            //set the device model
            this.setModel(models.createDeviceModel(),"device");
        },

        SapId: "training@logaligroup.com"
    });
});
