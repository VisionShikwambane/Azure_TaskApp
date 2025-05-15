export class Setting {
  id: number = 0;
  userID: string = '1';
  companyName: string = 'Default Company Name';
  companyEmail: string = 'default@company.com';
  companyAddress: string = '123 Default St, City, Country';
  companyPhone: string = '123-456-7890';
  companyLogo!: string;
  vatEnabled: boolean = false;
  vatRate: number = 0;
  invoicePrefix: string = 'INV';
  invoiceNextNo: string = '0001';
  defaultCurrency: string = 'USD';
  defaultNote: string = 'Thank you for your business!';
  invoiceDueDays: number = 30;
  defaultTermsAndConditions: string = 'Default Terms and Conditions apply.';

  constructor(
    id?: number,
    userID?: string,
    companyName?: string,
    companyEmail?: string,
    companyAddress?: string,
    companyPhone?: string,
    companyLogo?: string,
    vatEnabled?: boolean,
    vatRate?: number,
    invoicePrefix?: string,
    invoiceNextNo?: string,
    defaultCurrency?: string,
    defaultNote?: string,
    invoiceDueDays?: number,
    defaultTermsAndConditions?: string
  ) {
    if (id) this.id = id;
    if (userID) this.userID = userID;
    if (companyName) this.companyName = companyName;
    if (companyEmail) this.companyEmail = companyEmail;
    if (companyAddress) this.companyAddress = companyAddress;
    if (companyPhone) this.companyPhone = companyPhone;
    if (companyLogo) this.companyLogo = companyLogo;
    if (vatEnabled !== undefined) this.vatEnabled = vatEnabled;
    if (vatRate) this.vatRate = vatRate;
    if (invoicePrefix) this.invoicePrefix = invoicePrefix;
    if (invoiceNextNo) this.invoiceNextNo = invoiceNextNo;
    if (defaultCurrency) this.defaultCurrency = defaultCurrency;
    if (defaultNote) this.defaultNote = defaultNote;
    if (invoiceDueDays) this.invoiceDueDays = invoiceDueDays;
    if (defaultTermsAndConditions) this.defaultTermsAndConditions = defaultTermsAndConditions;
  }
}
