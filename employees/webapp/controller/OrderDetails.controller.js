sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/Messagebox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    /**
     *  @param {typeof sap.ui.core.mvc.Controller} Controller 
     *  @param {typeof sap.ui.model.Filter} Filter 
     *  @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     */
    function (Controller, History, Messagebox, Filter, FilterOperator) {

        function _onObjectMatched(oEvent) {

            this.onClearSignature(oEvent);

            this.getView().bindElement({
                path: "/Orders(" + oEvent.getParameter("arguments").orderID + ")",
                model: "odataNorthwind",
                events: {
                    dataReceived: function (oData) {
                        _readSignature.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
                    }.bind(this)
                }
            });

            const objContext = this.getView().getModel("odataNorthwind").getContext("/Orders(" + oEvent.getParameter("arguments").orderID + ")").getObject();
            if (objContext) {
                _readSignature.bind(this)(objContext.OrderID, objContext.EmployeeID);
            }

        };

        function _readSignature(orderId, employeeId) {

            //Read signature image
            this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='" + orderId + "',SapId='" + this.getOwnerComponent().SapId +
                "',EmployeeId='" + employeeId + "')", {
                success: function (data) {
                    const signature = this.getView().byId("signature");
                    if (data.MediaContent !== "") {
                        signature.setSignature("data:image/png;base64," + data.MediaContent);
                    }
                }.bind(this),
                error: function (data) {
                    Messagebox.information(oResourceBundle.getText("signatureNotSave"));
                }
            });

            //Bind Files

            this.biId("uploadCollection").bindAggregation("items", {
                path: "incidenceModel>/FilesSet",
                filters: [new Filter("OrderId", FilterOperator.EQ, orderId),
                new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                new Filter("EmployeeId", FilterOperator.EQ, employeeId)
                ],
                template: sap.m.UploadCollectionItem({
                    documentId: "{incidenceModel>AttId}",
                    visibleEdit: false,
                    fileName: "{incidenceModel>FileName}"
                }).attachPress(this.downloadFile)
            })
        }


        return Controller.extend("logaligroup.employees.controller.OrderDetails", {
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
            },
            onBack: function (oEvent) {
                let oHistory = History.getInstance();
                let oPreviousHash = oHistory.getPreviousHash();
                if (oPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain", true);
                }
            },
            onClearSignature: function (oEvent) {
                var signature = this.byId("signature");
                signature.clear();
            },

            factoryOrderDetails: function (listId, oContext) {
                let contextObject = oContext.getObject();
                contextObject.Currency = "EUR";
                let unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductId + ")/UnitsInStock");

                if (contextObject.Quantity <= unitsInStock) {
                    var objectListItem = new sap.m.ObjectListItem({
                        title: "{odataNorthwind>/Products(" + contextObject.ProductId + ")/ProductName} ({odataNorthwind>Quantity})",
                        number: "{ parts : [ { path: 'odataNorthwind>UnitPrice'}, { path: 'odataNorthwind>Currency'} ], type: 'sap.ui.model.type.Currency', formatOptions: {showMeasure: false}}",
                        numberUnit: "{odataNorthwind>Currency}",

                    });
                    return objectListItem;
                } else {
                    let customListItem = new sap.m.customListItem({
                        content: [
                            new sap.m.Bar({
                                contentLeft: new sap.Label({ text: "{odataNorthwind>/Products(" + contextObject.ProductId + ")/ProductName} ({odataNorthwind>Quantity})" }),
                                contentMiddle: new sap.ObjectStatus({ text: "{i18n>availableStock} {odataNorthwind>/Products(" + contextObject.ProductId + ")/UnitsInStock}", state: "Error" }),
                                contentRight: new sap.Label({ text: "{ parts : [ { path: 'odataNorthwind>UnitPrice'}, { path: 'odataNorthwind>Currency'} ], type: 'sap.ui.model.type.Currency'}" })
                            })
                        ]
                    });
                    return customListItem;
                }
            },

            onSaveSignature: function (oEvent) {
                const signature = this.byId("signature");
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let signaturePng;

                if (!signature.isFill()) {
                    Messagebox.error(oResourceBundle.getText("fillSignature"));
                } else {
                    signaturePng = signature.getSignature().replace("data:image/png;base64,", "");
                    let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                    let body = {
                        OrderId: objectOrder.OrderID.toString(),
                        SapId: this.getOwnerComponent().sapId,
                        EmployeeId: objectOrder.EmployeeID.toString(),
                        MimeType: "image/png",
                        MediaContent: signaturePng
                    }
                };
                this.getView().getModel("incidenceModel").create("/signatureSet", body, {
                    success: function () {
                        Messagebox.information(oResourceBundle.getText("signatureSaved"));
                    },
                    error: function () {
                        Messagebox.information(oResourceBundle.getText("signatureNotSaved"));
                    }
                })
            },

            onFileBeforeUpload(oEvent) {
                let filename = oEvent.getParameter("filename");
                let objContext = oEvent.getSource().getBindingContext("odataNorthwind", getObject());
                let objCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: objContext.OrderID + ";" + this.getOwnerComponent().SapId + ";" + objContext.EmployeeID + ";" + filename
                });
                oEvent.getParameters().addHeaderParameter(objCustomerHeaderSlug);
            },

            onfileChange: function (oEvent) {
                let oUploadCollection = oEvent.getSource();

                //Header token CSRF - cross-site request forgery
                let ocustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("incidenceModel").getSecurityToken()

                });
                oUploadCollection.addHeaderParameter(ocustomerHeaderToken);
            },

            onFileUploadComplete: function (oEvent) {
                oEvent.getSource().getBinding("items").refresh();
            },

            onFileDeleted: function (oEvent) {

                let oUploadCollection = oEvent.getSource();
                let sPath = oEvent.getParameter("item").getBindingContext("incidenceModel").getPath();
                this.getView().getModel("incidenceModel").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh();
                    },
                    error: function () {
                        Messagebox.information(oResourceBundle.getText("signatureNotSave"));
                    }
                });

            },

            downloadfile: function (oEvent) {
                const sPath = oEvent.getSource().getBindingContext("incidenceModel").getPath();
                window.open("/sap/opu/odata/sap/YSAPUI%_SRV_01" + sPath + "/$value");

            }
        });
    });