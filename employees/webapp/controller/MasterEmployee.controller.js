sap.ui.define([
    
    "logaligroup/employees/controller/Base.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Base, Filter, FilterOperator) {
        "use strict";
        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();

        };
        function onFilter() {
            let oJSON = this.getView().getModel("jsonCountries").getData();
            let filters = [];

            if (oJSON.EmployeeId !== "") {
                //@ts-ignore
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
            }
            if (oJSON.CountryKey !== "") {
                //@ts-ignore
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
            let oContext = itemPressed.getBindingContext("jsonEmployees");
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

        function showOrders(oEvent) {

            //get selected Controller
            let itemPressed = oEvent.getSource();

            //Context fron the model
            let oContext = itemPressed.getBindingContext("odataNorthwind");
            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            }

            //Dialog bindin to the context to have access to the data of selected item
            this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
            this._oDialogOrders.open();

        }

        function onCloseOrders() {
            this._oDialogOrders.close();
        }

        function showEmployee(oEvent) {
            var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
            this._bus.publish("flexible", "showEmployee", path)
        }

      
        var Main = Base.extend("logaligroup.employees.controller.MasterEmployee");
       
        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;

        return Main;
       
    });