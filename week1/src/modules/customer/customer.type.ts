interface Address {
  street: string;
  city: string;
  province: string;
  zipCode: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
}

type CreateCustomerInput = Omit<Customer, "id">;
type UpdateCustomerInput = Partial<Omit<Customer, "id">>;
type CustomerBrief = Pick<Customer, "id" | "name" | "email" | "phone">;

export { Address, Customer, CreateCustomerInput, UpdateCustomerInput, CustomerBrief };
