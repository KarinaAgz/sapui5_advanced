sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"

], function (Controller,MessageBox) {
    return Controller.extend("logaligroup.employees.controller.Main", {

        onBeforeRendering: function () {
            this._detailEmployeeView = this.getView().byId("detailEmployeeView");

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
            this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);

            this._bus.subscribe("incidence", "onDeleteIncidence", function(channelId,eventId,data){

                var oResourceBundle=this.getView().getModel("i18n").getResourceBundle();

                this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                    "',SapId='" + data.SapId +
                    ",EmployeeId='" + data.EmployeeId + "')",{
                    success: function () {
                        this.onReadDataIncidence.bind(this)(data.EmployeeId);
                        sap.m.MesasseToast.show(oResourceBundle.getText("odataDeleteOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MesasseToast.show(oResourceBundle.getText("odataDeleteKO"));
                    }.bind(this)
                });
            })

        },

        showEmployeeDetails: function (category, nameEvent, path) {
            let detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("odataNorthwind>" + path);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");
            let incidenceModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidenceModel, "incidenceModel");
            detailView.byId("tableIncidence").removeAllContent();

            this.onReadDataIncidence(this._detailEmployeeView.getBindingContext("odataNortwind").getObject().EmployeeID)
        },

        onSaveODataIncidence: function (channelId, eventId, data) {

            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

            if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {
                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    Type: incidenceModel[data.incidenceRow].Type,
                    Reason: incidenceModel[data.incidenceRow].Reason
                };

                this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                    success: function () {
                        this.onReadDataIncidence.bind(this)(employeeId);
                        MessageBox.success(oResourceBundle.getText("odataSaveOK"));
                        //sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));

                    }.bind(this),
                    error: function (e) {
                        //sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        MessageBox.success(oResourceBundle.getText("odataSaveKO"));

                    }.bind(this)
                })
            } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                incidenceModel[data.incidenceRow].ReasonX ||
                incidenceModel[data.incidenceRow].TypeX) {

                var body = {
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,

                    Type: incidenceModel[data.incidenceRow].Type,
                    TypeX: incidenceModel[data.incidenceRow].TypeX,

                    Reason: incidenceModel[data.incidenceRow].Reason,
                    ReasonX: incidenceModel[data.incidenceRow].ReasonX,
                };

                this.getView().getModel("incidenceModel").update("/IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                    "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                    ",EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body,{
                    success: function () {
                        this.onReadDataIncidence.bind(this)(employeeId);
                        sap.m.MesasseToast.show(oResourceBundle.getText("odataUpdateOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MesasseToast.show(oResourceBundle.getText("odataUpdateKO"));
                    }.bind(this)
                });
            }

         else {
            sap.m.MesasseToast.show(oResourceBundle.getText("odataNoChanges"));
        };
    },
        onReadDataIncidence: function (employeeID) {

            this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                ],
                success: function (data) {
                    var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                    incidenceModel.setData(data.results);
                    var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                    tableIncidence.removeAllContent();

                    for (var incidence in data.results) {

                        data.results[incidence]._ValiDate=true;
                        data.results[incidence].EnabledSave=false;
                        
                        var newIncidence = sap.ui.xmlfragment("logaligrouo.employees.fragment.NewIncidence", this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("incidenceModel>/" + incidence);
                        tableIncidence.addContent(newIncidence);
                    }
                }.bind(this),
                error: function (e) {

                }
            });
        }
    });
});