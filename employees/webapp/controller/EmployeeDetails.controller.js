sap.ui.define([
   
   "logaligroup/employees/controller/Base.controller",
   "logaligroup/employees/model/formatter",
   "sap/m/MessageBox"

], function (Base, formatter, MessageBox) {

   function onInit() {
      this._bus=sap.ui.getcore().getEventBus();
      
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


   function updateIncidenceCreationDate(oEvent) {
      let context = oEvent.getSource().getBindingContext("incidenceModel");
      let contextObject = context.getObject();
      let oResourceBundle = this.getview().getModel("i18n").getResourceBundle();

      if (!oEvent.getSource().isValidateValue()) {
         contextObject._ValidateDate = false;
         contextObject.CreationDateState = "Error";
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
         contextObject._ValidateDate = true;
         contextObject.CreationDateState = "None";
         contextObject._ValidateDate = false;
         contextObject.CreationDateX = true;
      }
      if (oEvent.getSource().isValidateValue() && contextObject.Reason) {
         contextObject.EnabledSave = true;
      } else {
         contextObject.EnabledSave = false;
      }
      context.getModel().refresh();
   }


   function updateIncidenceReason(oEvent) {
      let context = oEvent.getSource().getBindingContext("incidenceModel");
      let contextObject = context.getObject();

      if (oEvent.getSource().getValue()) {
         contextObject.ReasonState = "None";
         contextObject._ValidateDate = false;
         contextObject.ReasonX = true;
      } else {
         contextObject.CreationDateState = "Error";
      }

      if (contextObject._ValidateDate && oEvent.getSource().getValue()) {
         contextObject.EnabledSave = true;
      } else {
         contextObject.EnabledSave = false;
      }

      context.getModel().refresh();
   }


   function onDeleteIncidence(oEvent) {
      let tableIncidence = this.getView().byId("tableIncidence");
      let rowIncidence = oEvent.getSource().getParent().getParent();
      let incidenceModel = this.getView().getModel("incidenceModel");
      let odata = incidenceModel.getData();
      let contextObj = rowIncidence.getBindingContext("incidenceModel");
      odata.splice(contextObj.index, 1);
      for (let i in odata) {
         odata[i].index = parseInt(i) + 1;
      }
      incidenceModel.refresh();
      tableIncidence.removeContent(rowIncidence);
      for (let j in tableIncidence.getContent()) {
         tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
      }
   };

   function onSaveIncidence(oEvent){
      var incidence=oEvent.getSource().getParent().getParent();
      var incidenceRow=incidence.getBindingContext("incidenceModel");
      var temp=incidenceRow.sPath.replace('/','');
      this._bus.publish("incidence","onSaveIncidence",{incidenceRow: incidenceRow.sPath.replace('/','')})
   }
   
   let Main = Base.extend("logaligroup.employees.controller.EmployeeDetails", {});

   Main.prototype.onInit = onInit;
   Main.prototype.onCreateIncidence = onCreateIncidence;
   Main.prototype.Formatter = formatter;
   Main.prototype.onDeleteIncidence = onDeleteIncidence;
   Main.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
   Main.prototype.updateIncidenceReason = updateIncidenceReason;

   return Main;
});