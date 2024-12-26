sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        function dateFormat(date) {
            let timeDay = 24 * 60 * 60 * 1000;
            if (date) {
                let dateNow = new Date();
                let dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy/MM/dd" });
                let dateNowFormat = new Date(dateFormat.format(dateNow));
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                switch (true) {
                    //Today
                    case date.getTime() === dateNowFormat.getTime():
                        return oResourceBundle.getText("today");
                    //Tomorrow
                    case date.getTime() === dateNowFormat.getTime() + timeDay:
                        return oResourceBundle.getText("tomorrow");
                    //Yesterday
                    case date.getTime() === dateNowFormat.getTime() - timeDay:
                        return oResourceBundle.getText("yesterday");
                    default: return "";

                }

            }

        }

        return {
            dateFormat: dateFormat
        }
    });