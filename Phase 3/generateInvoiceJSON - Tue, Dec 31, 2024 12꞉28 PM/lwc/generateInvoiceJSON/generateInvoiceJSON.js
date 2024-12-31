import { LightningElement, wire } from 'lwc';
import { CurrentPageReference,NavigationMixin } from 'lightning/navigation';
import getDataByObject from '@salesforce/apex/InvoiceController.getObjectInfoData';
import processInvoices from '@salesforce/apex/InvoiceController.insertInvoiceAndLinrItems';

export default class GenerateInvoiceJSON extends NavigationMixin(LightningElement) {
recordId;
invoiceJSON;
queryFieldsString;

    @wire(CurrentPageReference)
    getPageReferenceParameters(currentPageReference) {
       if (currentPageReference) {
        //Getting the data from url used to form the string and to build the JSON.
          this.recordId = currentPageReference.state.c__recordId;
          this.account = currentPageReference.state.c__account;
          this.invoice_date = currentPageReference.state.c__invoice_date;
          this.invoice_due_date = currentPageReference.state.c__invoice_due_date;
          this.child_relationship_name = currentPageReference.state.c__child_relationship_name;
          this.line_item_description = currentPageReference.state.c__line_item_description;
          this.line_item_quantity = currentPageReference.state.c__line_item_quantity;
          this.line_item_unit_price = currentPageReference.state.c__line_item_unit_price;

          this.queryFieldsString = `${this.invoice_date},${this.invoice_due_date},(SELECT ${this.line_item_description}, ${this.line_item_quantity}, ${this.line_item_unit_price} FROM ${this.child_relationship_name})`; 
       }
    }

    @wire(getDataByObject, { recordId: '$recordId', queryString: '$queryFieldsString' })
    wiredObjectType({ data, error }) {
        if (data) {
            console.log(data);
            this.generateJson(data);// Will generate the JSON and will store it in a variable invoiceJSON
        } else if (error) {
            console.error(error);
        }
    }

    generateJson(data){
        let childrelationName = this.child_relationship_name;
        if(data != null){
            this.allData = data;
            this.closeDate = data.CloseDate;
            this.dueDate = data.Due_Date__c;
            this.lineItemsMap = data[childrelationName].map(item => ({// Using square bracket notation instead of dot to handle dynamic nature of thr child object because it might be differ for different objects
                Description: item.Description || '',
                Quantity: item.Quantity || '0.0000',
                UnitAmount: item.UnitPrice || '0.00'
            }))
            this.invoiceJSON = {
                Invoices: [
                    {
                        Type: 'ACCREC',// Used Type ACCREC because to create a saleInvice
                        Contact: {
                            ContactID: '0000000'
                        },
                        DateString: data.CloseDate+'T00:00:00' || '',
                        DueDateString: data.Due_Date__c+'T00:00:00' || '',
                        Status: 'AUTHORISED', // Used AUTHORISED as it will be ready for the customer and it will be confirmed in previous page
                        LineItems: this.lineItemsMap
                        
                }
                ]
            }
            this.invoiceJSON = JSON.stringify(this.invoiceJSON);
        }
    }

    handleCreateInvoices() {
        let childrelationName = this.child_relationship_name;
        let recordId = this.recordId;
        this.parentMap = {};
        this.childMap = {};
        this.lineItemsMap = this.allData[childrelationName].map(item => ({// Using square bracket notation instead of dot to handle dynamic nature of thr child object because it might be differ for different objects
                Line_Description__c: item.Description || '',
                Quantity__c: item.Quantity || '0.0000',
                Unit_Price__c: item.UnitPrice || '0.00'
            }))
        // Example: Populate parentMap and childMap dynamically
        this.parentMap = {
            Account__c: this.account,
            Invoice_Date__c: this.closeDate,
            Due_Date__c: this.dueDate,
            Invoice_Reference__c: recordId
        };


        this.childMap[recordId] = this.lineItemsMap;

        // Call Apex method
        processInvoices({
            parentMap: this.parentMap,
            childMap: this.childMap
        })
            .then(result => {
                if(result){
                    this[NavigationMixin.Navigate]({
                        type: 'standard__recordPage',
                        attributes: {
                            recordId: result,
                            actionName: 'view' // Options: view, edit
                        }
                    });
                }
                console.log('Invoices created successfully:', result);
            })
            .catch(error => {
                console.error('Error creating invoices:', error);
            });

    }
}