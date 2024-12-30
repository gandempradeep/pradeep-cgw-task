import { LightningElement,wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';


export default class GenerateInvoice extends LightningElement {
origin_record;
accountId;
queryFieldsString;

@wire(CurrentPageReference)
    getPageReferenceParameters(currentPageReference) {
       if (currentPageReference) {
          this.origin_record = currentPageReference.state.c__origin_record;
          this.accountId = currentPageReference.state.c__account;
          let invoice_date = currentPageReference.state.c__invoice_date;
          let invoice_due_date = currentPageReference.state.c__invoice_due_date;
          let child_relationship_name = currentPageReference.state.c__child_relationship_name;
          let line_item_description = currentPageReference.state.c__line_item_description;
          let line_item_quantity = currentPageReference.state.c__line_item_quantity;
          let line_item_unit_price = currentPageReference.state.c__line_item_unit_price;

          this.rows = [
                { id: 1, staticValue: 'origin_record', dynamicValue: this.origin_record },
                { id: 2, staticValue: 'account', dynamicValue: this.accountId },
                { id: 3, staticValue: 'invoice_date', dynamicValue: invoice_date },
                { id: 4, staticValue: 'invoice_due_date', dynamicValue: invoice_due_date },
                { id: 5, staticValue: 'child_relationship_name', dynamicValue: child_relationship_name },
                { id: 6, staticValue: 'line_item_description', dynamicValue: line_item_description },
                { id: 7, staticValue: 'line_item_quantity', dynamicValue: line_item_quantity },
                { id: 8, staticValue: 'line_item_unit_price', dynamicValue: line_item_unit_price }
            ];
       }
    }

    
}