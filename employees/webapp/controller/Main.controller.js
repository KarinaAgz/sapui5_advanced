sap.ui.define([
    "sap/ui/core/mvc/Controller",

], function(Controller) {
    return Controller.extend("logaligroup.employees.controller.Main", {
        onInit: function () {
            let oView = this.getView();
            let i18nBundle = oView.getModel("i18n").getResourceBundle();

            oJSONModel = new sap.ui.model.json.JSONModel();
            oJSONModel.loadData("../model/json/employee.json", false);
            oJSONModel.attachRequestCompleted(function (oEventModel) {
                console.log(JSON.stringify(oJSONModel.getData()))
            });
            oView.setModel(oJSONModel,"jsonemployee");



            oJSONModel = new sap.ui.model.json.JSONModel();
            oJSONModel.loadData("../model/json/Countries.json", false);
            oJSONModel.attachRequestCompleted(function (oEventModel) {
                console.log(JSON.stringify(oJSONModel.getData()))
            });
            oView.setModel(oJSONModel,"jsonCountries");

            let oJSONModelLayout = new sap.ui.model.json.JSONModel();
            oJSONModelLayout.loadData("../model/json/Layout.json", false);
            oJSONModelLayout.attachRequestCompleted(function (oEventModel) {
                console.log(JSON.stringify(oJSONModelLayout.getData()))
            });
            oView.setModel(oJSONModelLayout,"jsonLayout");

            let oJSONConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });

            oView.setModel(oJSONConfig,"jsonConfig");    
            this._bus = sap.ui.getCore().getEventBus();        
            this._bus.subscribe("flexible","showEmployee", this.showEmployeeDetails, this);
        },

        showEmployeeDetails: function(category, nameEvent, path){
            let detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("odataNorthwind>" + path);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey","TwoColumnsMidExpanded");
            let incidenceModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidenceModel,"incidenceModel");
            detailView.byId("tableIncidence").removeAllContent();
        }
    });
});