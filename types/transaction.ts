export type Transaction = {
    transaction_id: number;
    user_id: number;
    username: string;
    customer_id: number;
    customer_name: string;
    transaction_type: string;
    transaction_date: string;
    total_price: number;
    additional_information: string;
    transaction_parts: TransactionPart[];
  };

  export type TransactionPart = {
    transaction_part_id: number;
    transaction_id: number;
    part_id: number;
    part_name: string;
    quantity: number;
    price: number;
  };