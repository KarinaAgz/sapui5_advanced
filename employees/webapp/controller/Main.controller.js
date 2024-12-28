sap.ui.define([
    "sap/ui/core/mvc/Controller"

], function (Controller) {
    return Controller.extend("logaligroup.employees.controller.Main", {

        onBeforeRendering:function(){
            this._detailEmployeeView=this.getView().byID("detailEmployeeView");

        },

        onInit: function () {
            let oView = this.getView();
            let oI18nModel = oView.getModel("i18n");
            console.log("Modelo i18n:", oI18nModel);
        
            if (oI18nModel) {
                let i18nBundle = oI18nModel.getResourceBundle();
                console.log("i18nBundle:", i18nBundle);
                // Resto del código...
            } else {
                console.error("El modelo i18n no está disponible.");
            }

            oJSONModel = new sap.ui.model.json.JSONModel();
            oJSONModel.loadData("../model/json/employee.json", false);
            oJSONModel.attachRequestCompleted(function (oEventModel) {
                console.log(JSON.stringify(oJSONModel.getData()))
            });
            oView.setModel(oJSONModel, "jsonemployee");



            oJSONModel = new sap.ui.model.json.JSONModel();
            oJSONModel.loadData("../model/json/Countries.json", false);
            oJSONModel.attachRequestCompleted(function (oEventModel) {
                console.log(JSON.stringify(oJSONModel.getData()))
            });
            oView.setModel(oJSONModel, "jsonCountries");

            let oJSONModelLayout = new sap.ui.model.json.JSONModel();
            oJSONModelLayout.loadData("../model/json/Layout.json", false);
            oJSONModelLayout.attachRequestCompleted(function (oEventModel) {
                console.log(JSON.stringify(oJSONModelLayout.getData()))
            });
            oView.setModel(oJSONModelLayout, "jsonLayout");

            let oJSONConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });

            oView.setModel(oJSONConfig, "jsonConfig");


            this._bus = sap.ui.getCore().getEventBus();
            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
            this._bus.subscribe("incidence","onSaveIncidence", this.onSaveODataIncidence,this);

        },

        showEmployeeDetails: function (category, nameEvent, path) {
            let detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("odataNorthwind>" + path);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");
            let incidenceModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidenceModel, "incidenceModel");
            detailView.byId("tableIncidence").removeAllContent();
        },

        onSaveODataIncidence:function(channelId,eventId,data){

            var oResourceBundle=this.getView().getModel("i18n").getResourceBundle();
            var employeeId=this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceModel=this._detailEmployeeView.getModel("incidenceModel").getData();

            var body={
                SapID:this.getOwnerComponent().SapId,
                employeeId:employeeId.toString(),
                CreationDate:incidenceModel[data.incidenceRow].CreationDate,
                Type: incidenceModel[data.incidenceRow].Type,
                Reason: incidenceModel[data.incidenceRow].Reason
            };

            this.getView().getModel("incidenceModel").create("/IncidentsSet"),body,{
                success:function(){
                    sap.m.MessageToast(oResourceBundle.getText("odataSaveOK"));

                }.bind(this),
                error:function(e){
                    sap.m.MessageToast(oResourceBundle.getText("odataSaveKO"));

                }
            }
        }
    });
});