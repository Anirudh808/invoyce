import {
  GetClient,
  GetInvoice,
  GetInvoiceItems,
  GetUser,
  GetUserBusiness,
} from "@/database/schema";

export type GetUserWithBusiness = GetUser & {
  usersBusiness: GetUserBusiness;
};

export type GetClientWithInvoices = GetClient & {
  invoices: GetInvoice[];
};

export type GetInvoicesWithClient = GetInvoice & {
  client: GetClient;
};

export type GetSingleInvoice = GetInvoice & {
  client: GetClient;
  invoiceItems: GetInvoiceItems[];
};

export type User = {
  id: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
  businessUrl: string;
  businessLogo: string;
  profilePic: string;
  currency: string;
  doorNo: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  createdAt: string; // or Date
  updatedAt: string; // or Date
};

export interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
