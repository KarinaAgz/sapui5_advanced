sap.ui.define([
    "sap/ui/core/mvc/Controller",

], function(Controller) {
    return Controller.extend("logaligroup.employees.controller.Main", {
        onInit: function () {
            let oView = this.getView();
            let i18nBundle = oView.getModel("i18n").getResourceBundle();
            // let oJson = {
            //     employeeId: "12345",
            //     countryKey: "UK",
            //     listCountry: [{ key: "US", text: i18nBundle.getText("countryUS") },
            //     { key: "UK", text: i18nBundle.getText("countryUK") },
            //     { key: "ES", text: i18nBundle.getText("countryES") },]
            // }
            //oJSONModel.setData(oJson);
            //let oJSONModel = new sap.ui.model.json.JSONModel();
            //oJSONModel.loadData("../localService/mockdata/employee.json", false);     
           // oJSONModel.attachRequestCompleted(function (oEventModel) {
            //    console.log(JSON.stringify(oJSONModel.getData()))
            //});
            //oView.setModel(oJSONModel,"odataNorthwind");

            oJSONModel = new sap.ui.model.json.JSONModel();
            oJSONModel.loadData("../localService/mockdata/Countries.json", false);
            oJSONModel.attachRequestCompleted(function (oEventModel) {
                console.log(JSON.stringify(oJSONModel.getData()))
            });
            oView.setModel(oJSONModel,"jsonCountries");

            let oJSONModelLayout = new sap.ui.model.json.JSONModel();
            oJSONModelLayout.loadData("../localService/mockdata/Layout.json", false);
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