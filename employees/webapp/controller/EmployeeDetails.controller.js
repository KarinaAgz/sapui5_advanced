sap.ui.define([

   "logaligroup/employees/controller/Base.controller",
   "logaligroup/employees/model/formatter",
   "sap/m/MessageBox"

], function (Base, formatter, MessageBox) {

   function onInit() {
      this._bus = sap.ui.getCore().getEventBus();

   };

   function onCreateIncidence() {
      let tableIncidence = this.getView().byId("tableIncidence");
      let newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
      let incidenceModel = this.getView().getModel("incidenceModel");
      let odata = incidenceModel.getData();
      let index = odata.length;
      odata.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
      incidenceModel.refresh();
      newIncidence.bindElement("incidenceModel>/" + index);
      tableIncidence.addContent(newIncidence);
   };

   /*function onDeleteIncidence(oEvent) {

      var contexjObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

      MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"), {
         onClose: function (oAction) {
            if (oAction === "OK") {

               this._bus.publish("incidence", "onDeleteIncidence", {
                  IncidenceId: contextjObj.IncidenceId,
                  SapId: contexjObj.SapId,
                  EmployeeId: contexjObj.EmployeeId
               });
            }
         }.bind(this)
      })
   };*/

   function onDeleteIncidence(oEvent){
      var tableIncidence=this.getView().byId("tableIncidence");
      var rowIncidence=oEvent.getSource().getParent().getParent();
      var incidenceModel= this.getView().getModel("incidenceModel");
      var odata=incidenceModel.getData();
      var contexObj=rowIncidence.getBindingContext("incidenceModel");

      odata.splice(contexObj.index-1,1);
      for (var i in odata){
         odata[i].index=parseInt(i)+1;
      };
      incidenceModel.refresh(),
      tableIncidence.removeContent(rowIncidence);

      for (var j in tableIncidence.getContent()){
         tableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
      }
   };

   function onSaveIncidence(oEvent) {
      var incidence = oEvent.getSource().getParent().getParent();
      var incidenceRow = incidence.getBindingContext("incidenceModel");
      this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') })
   };

   function updateIncidenceCreationDate(oEvent) {
      let context = oEvent.getSource().getBindingContext("incidenceModel");
      let contextObj = context.getObject();
      let oResourceBundle = this.getview().getModel("i18n").getResourceBundle();

      if (!oEvent.getSource().isValidateValue()) {
         contextObj._ValidateDate = false;
         contextObj.CreationDateState = "Error";
         MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
            title: "Error",
            onClose: null,
            styleClass: "",
            actions: MessageBox.Action.Close,
            emphazisedAction: null,
            initialFocus: null,
            textDirection: sap.ui.core.textDirection.inherit
         });
      } else {
         contextObj.CreationDateX = true;
         contextObj._ValidateDate = true;
         contextObj.CreationDateState = "None";

      }
      if (oEvent.getSource().isValidateValue() && contextObj.Reason) {
         contextObj.EnabledSave = true;
      } else {
         contextObj.EnabledSave = false;
      }
      context.getModel().refresh();
   }


   function updateIncidenceReason(oEvent) {
      let context = oEvent.getSource().getBindingContext("incidenceModel");
      let contextObj = context.getObject();

      if (oEvent.getSource().isValidateValue()) {
         contextObj.ReasonX = true;
         contextObj._ValidateDate = false;
         contextObj.ReasonState = "None";

      } else {
         contextObj.CreationDateState = "Error";
      }

      if (contextObj._ValidateDate && oEvent.getSource().getValue()) {
         contextObj.EnabledSave = true;
      } else {
         contextObj.EnabledSave = false;
      }

      context.getModel().refresh();
   }


   function updateIncidenceType(oEvent) {

      var context = oEvent.getSource().getBindingContext("incidenceModel");
      var contexjObj = context.getObject();
      contexjObj.TypeX = true;

   };



   var EmployeeDetails = Base.extend("logaligroup.employees.controller.EmployeeDetails", {});

  EmployeeDetails.prototype.onInit = onInit;
  EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
  EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
  EmployeeDetails.prototype.Formatter = formatter;
  EmployeeDetails.prototype.onSaveIncidence=onSaveIncidence;

  
  EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
  EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
  EmployeeDetails.prototype.updateIncidenceType=updateIncidenceType;

   return EmployeeDetails;
});