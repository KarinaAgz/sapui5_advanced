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

   
   function onDeleteIncidence(oEvent){
   
      var contexjObj=oEvent.getSource().getBindingContext("incidenceModel").getObject();
      MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"),{
           onclose:function(oAction){
               if(oAction === "OK"){
                  this._bus.publish("incidence","onDeleteIncidence",{
                     IncidenceId:contexjObj.IncidenceId,
                     SapId: contexjObj.SapId,
                     EmployeeId: contexjObj.EmployeeId
                  });

         }
      }.bind(this)
      });  
   };

   function onSaveIncidence(oEvent) {
      let incidence = oEvent.getSource().getParent().getParent();
      let incidenceRow = incidence.getBindingContext("incidenceModel");
      this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') })
   };

   function updateIncidenceCreationDate(oEvent) {
      let context = oEvent.getSource().getBindingContext("incidenceModel");
      let contextObj = context.getObject();
      let oResourceBundle = this.getview().getModel("i18n").getResourceBundle();

      if (!oEvent.getSource().isValidValue()) {
         contextObj._ValidateDate = false;
         contextObj.CreationDateState = "Error";
         MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
            title: "Error",
            onClose: null,
            styleClass: "",
            actions: MessageBox.Action.Close,
            emphazisedAction: null,
            initialFocus: null,
            textDirection: sap.ui.core.textDirection.Inherit
         });
      } else {
         contextObj.CreationDateX = true;
         contextObj._ValidateDate = true;
         contextObj.CreationDateState = "None";

      }
      if (oEvent.getSource().isValidValue() && contextObj.Reason) {
         contextObj.EnabledSave = true;
      } else {
         contextObj.EnabledSave = false;
      }
      context.getModel().refresh();
   }


   function updateIncidenceReason(oEvent) {
      let context = oEvent.getSource().getBindingContext("incidenceModel");
      let contextObj = context.getObject();

      if (oEvent.getSource().isValidValue()) {
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

      let context = oEvent.getSource().getBindingContext("incidenceModel");
      let contextObj = context.getObject();
      if(contextObj._ValidateDate && contextObj.Reason){
         contextObj.EnabledSave=true;
      }else{
         contextObj.EnabledSave=false;

      }
      contextObj.TypeX = true;

      context.getModel().refresh();

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