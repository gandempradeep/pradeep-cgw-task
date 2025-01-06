import { LightningElement,wire } from 'lwc';
import { CurrentPageReference,NavigationMixin } from 'lightning/navigation';


export default class GenerateInvoice extends NavigationMixin(LightningElement) {
origin_record;
accountId;

@wire(CurrentPageReference)
    getPageReferenceParameters(currentPageReference) {
       if (currentPageReference) {
          this.origin_record = currentPageReference.state.c__origin_record;
          this.accountId = currentPageReference.state.c__account;
          this.invoice_date = currentPageReference.state.c__invoice_date;
          this.invoice_due_date = currentPageReference.state.c__invoice_due_date;
          this.child_relationship_name = currentPageReference.state.c__child_relationship_name;
          this.line_item_description = currentPageReference.state.c__line_item_description;
          this.line_item_quantity = currentPageReference.state.c__line_item_quantity;
          this.line_item_unit_price = currentPageReference.state.c__line_item_unit_price;

          this.rows = [
                { id: 1, staticValue: 'origin_record', dynamicValue: this.origin_record },
                { id: 2, staticValue: 'account', dynamicValue: this.accountId },
                { id: 3, staticValue: 'invoice_date', dynamicValue: this.invoice_date },
                { id: 4, staticValue: 'invoice_due_date', dynamicValue: this.invoice_due_date },
                { id: 5, staticValue: 'child_relationship_name', dynamicValue: this.child_relationship_name },
                { id: 6, staticValue: 'line_item_description', dynamicValue: this.line_item_description },
                { id: 7, staticValue: 'line_item_quantity', dynamicValue: this.line_item_quantity },
                { id: 8, staticValue: 'line_item_unit_price', dynamicValue: this.line_item_unit_price }
            ];
       }
    }

    navigateToPage() {
        const pageReference = {
            type: 'standard__navItemPage', // Navigate to a Lightning app page
            attributes: {
                apiName: 'Display_Invoice_JSON',//Will redirect to this lightning page where added the parameters in the state
            },
            state: {
                'c__recordId' : (this.origin_record).toString(),
                'c__account' : (this.accountId).toString(),
                'c__invoice_date' : (this.invoice_date).toString(),
                'c__invoice_due_date' : (this.invoice_due_date).toString(),
                'c__child_relationship_name' : (this.child_relationship_name).toString(),
                'c__line_item_description' : (this.line_item_description).toString(),
                'c__line_item_quantity' : (this.line_item_quantity).toString(),
                'c__line_item_unit_price' : (this.line_item_unit_price).toString()
            }
        };

        // Use NavigationMixin to navigate
        this[NavigationMixin.Navigate](pageReference);
    }
    
}