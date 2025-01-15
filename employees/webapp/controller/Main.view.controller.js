sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";
        function onInit() {
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
            let oJSONModel = new sap.ui.model.json.JSONModel();
            oJSONModel.loadData("../localService/mockdata/employee.json", false);

            oJSONModel.attachRequestCompleted(function (oEventModel) {
                console.log(JSON.stringify(oJSONModel.getData()))
            });
            oView.setModel(oJSONModel, "odataNorthwind");
            oJSONModel = new sap.ui.model.json.JSONModel();
            oJSONModel.loadData("../localService/mockdata/Countries.json", false);
            oJSONModel.attachRequestCompleted(function (oEventModel) {
                console.log(JSON.stringify(oJSONModel.getData()))
            });
            oView.setModel(oJSONModel, "jsonCountries");

            let oJSONConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });

            oView.setModel(oJSONConfig, "jsonConfig");
        };
        function onFilter() {
            let oJSON = this.getView().getModel("jsonCountries").getData();
            let filters = [];

            if (oJSON.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
            }
            if (oJSON.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));
            }
            let oList = this.getView().byId("tableEmployee");
            let oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        };

        function onClearFilter() {
            let oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        };

        function showPostalCode(oEvent) {
            let itemPressed = oEvent.getSource();
            let oContext = itemPressed.getBindingContext("odataNorthwind");
            let objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);
        };

        function onShowCity() {
            let oJsonModelConfig = this.getView().getModel("jsonConfig");
            oJsonModelConfig.setProperty("/visibleCity", true);
            oJsonModelConfig.setProperty("/visibleBtnShowCity", false);
            oJsonModelConfig.setProperty("/visibleBtnHideCity", true);

        };
        function onHideCity() {
            let oJsonModelConfig = this.getView().getModel("jsonConfig");
            oJsonModelConfig.setProperty("/visibleCity", false);
            oJsonModelConfig.setProperty("/visibleBtnShowCity", true);
            oJsonModelConfig.setProperty("/visibleBtnHideCity", false);

        };

        
        const Main = Controller.extend("logaligroup.employees.controller.MainView");
        Main.prototype.onValidate = function () {
            let inputEmployee = this.getView().byId('inputEmployee');
            let valueEmployee = inputEmployee.getValue();
            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.getView().byId('labelCountry').setVisible(true);
                this.getView().byId('slCountry').setVisible(true);
            } else {
                //inputEmployee.setDescription("No OK")
                this.getView().byId('labelCountry').setVisible(false);
                this.getView().byId('slCountry').setVisible(false);
            }

        }
        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;

        return Main;
      
    });