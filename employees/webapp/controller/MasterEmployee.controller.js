sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "logaligroup/employees/controller/Base.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Base, Filter, FilterOperator) {
        "use strict";
        function onInit() {
            this._bus =sap.ui.getCore().getEventBus();
           
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
        /*
function myCheck() {
    let inputEmployee = this.byId('inputEmployee');
    let valueEmployee = inputEmployee.getValue();
    if (valueEmployee.length === 6) {
        inputEmployee.setDescription("OK");
    } else {
        inputEmployee.setDescription("No OK")
    }
};
*/
function onShowCity() {
    let oJsonModelConfig = this.getView().getModel("jsonConfig");
    oJsonModelConfig.setProperty("/visibleCity",true);
    oJsonModelConfig.setProperty("/visibleBtnShowCity",false);
    oJsonModelConfig.setProperty("/visibleBtnHideCity",true);

};
 function onHideCity() {
    let oJsonModelConfig = this.getView().getModel("jsonConfig");
    oJsonModelConfig.setProperty("/visibleCity",false);
    oJsonModelConfig.setProperty("/visibleBtnShowCity",true);
    oJsonModelConfig.setProperty("/visibleBtnHideCity",false);

};

function showOrders2(oEvent){
    let itemPressed = oEvent.getSource();
    let oContext = itemPressed.getBindingContext("odataNorthwind");
    if(!this._oDialogOrders){
    this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
    this.getView().addDependent(this._oDialogOrders);
    }
    this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
    this._oDialogOrders.open();

}

function onCloseOrders(){
    this._oDialogOrders.close();
}

function showEmployee(oEvent){
    let path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
    this._bus.publish("flexible","showEmployee", path)
}

function showOrders(oEvent) {
    let ordersTable = this.getView().byId("ordersTable");
    let ordersTable2 = this.getView().byId("ordersTable2");
    ordersTable.destroyItems();
    ordersTable2.destroyItems();
    let itemPressed = oEvent.getSource();
    let oContext = itemPressed.getBindingContext("odataNorthwind");
    let oObjectContext = oContext.getObject();
    let orders = oObjectContext.Orders;
    let orderItems = [];

    for(let i in orders){
        orderItems.push(new sap.m.ColumnListItem({
            cells: [
                new sap.m.Label({text: orders[i].OrderID}),
                new sap.m.Label({text: orders[i].Freight}),
                new sap.m.Label({text: orders[i].ShipAddress}),
            ]
        }));
    }
    let newTable = new sap.m.Table({
        width: "auto",
        columns: [ 
            new sap.m.Column({  header: new sap.m.Label({ text: "{i18n>OrderID}"}) }),
            new sap.m.Column({  header: new sap.m.Label({ text: "{i18n>Freight}"}) }),
            new sap.m.Column({  header: new sap.m.Label({ text: "{i18n>ShipAddress}"})})
            ],
            items: orderItems,

    }).addStyleClass("sapUISmallMargin");

    ordersTable.addItem(newTable);

    let newTableJSON = new sap.m.Table();
    newTableJSON.setWidth("auto");
    newTableJSON.addStyleClass("sapUISmallMargin");

    let columnOrderID = new sap.m.Column();
    let labelOrderID = new sap.m.Label();
    labelOrderID.bindProperty("text", "i18n>OrderID");
    columnOrderID.setHeader(labelOrderID);
    newTableJSON.addColumn(columnOrderID);

    let columnFreight = new sap.m.Column();
    let labelFreight = new sap.m.Label();
    labelFreight.bindProperty("text", "i18n>Freight");
    columnFreight.setHeader(labelFreight);
    newTableJSON.addColumn(columnFreight);

    let columnShipAddress = new sap.m.Column();
    let labelShipAddress = new sap.m.Label();
    labelShipAddress.bindProperty("text", "i18n>ShipAddress");
    columnShipAddress.setHeader(labelShipAddress);
    newTableJSON.addColumn(columnShipAddress);

    let columnListItem = new sap.m.ColumnListItem();

    let cellOrderID = new sap.m.Label();
    cellOrderID.bindProperty("text", "odataNorthwind>OrderID");
    columnListItem.addCell(cellOrderID);

    let cellFreight = new sap.m.Label();
    cellFreight.bindProperty("text", "odataNorthwind>Freight");
    columnListItem.addCell(cellFreight);

    let cellShipAddress = new sap.m.Label();
    cellShipAddress.bindProperty("text", "odataNorthwind>ShipAddress");
    columnListItem.addCell(cellShipAddress);
    
    let oBindingInfo = {
        model: "odataNorthwind",
        path: "Orders",
        template: columnListItem
    }
    newTableJSON.bindAggregation("items", oBindingInfo);
    newTableJSON.bindElement("odataNorthwind>" + oContext.getPath());

    ordersTable2.addItem(newTableJSON);

};
/*
function toOrderDetails(oEvent){
    let orderID = oevent.getSource().getBindingContext("odataNortwind").getObject().orderID;
    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    oRouter.navTo("RouteOrderDetails", { orderID: orderID });
 orderID

};
*/
        //const Main = Controller.extend("logaligroup.employees.controller.MasterEmployee");
        const Main = Base.extend("logaligroup.employees.controller.MasterEmployee");
        // Main.prototype.onValidate = function () {
        //     let inputEmployee = this.getView().byId('inputEmployee');
        //     let valueEmployee = inputEmployee.getValue();
        //     if (valueEmployee.length === 6) {
        //         //inputEmployee.setDescription("OK");
        //         this.getView().byId('labelCountry').setVisible(true);
        //         this.getView().byId('slCountry').setVisible(true);
        //     } else {
        //         //inputEmployee.setDescription("No OK")
        //         this.getView().byId('labelCountry').setVisible(false);
        //         this.getView().byId('slCountry').setVisible(false);
        //     }

        // }
        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.showOrders2 = showOrders2;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;
        //Main.prototype.toOrderDetails = toOrderDetails;

        return Main;
        /*
        return Controller.extend("logaligroup.employees.controller.MasterEmployee", {
            onInit: function () {

            },
            onValidate: function () {
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
            },
        });
        */
    });