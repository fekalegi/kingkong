"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { Transaction, TransactionPart, TransactionSales } from "@/types/transaction";
import TableTransactionPart from "@/components/Tables/TableTransactionPart";

const FormLayout = () => {
  
  const [transactionParts, setTransactionParts] = useState<TransactionPart[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPartPrice, setTotalPartPrice] = useState(0);
  const addTransactionPart = () => {
    setTransactionParts([...transactionParts, formTransactionPart]);
    setFormTransactionPart({
      transaction_part_id: 0,
      transaction_id: 0,
      part_id: 0,
      part_name: "",
      quantity: 0,
      price: 0,
    });
    setSelectedOption(null);
    setFormData({
      ...formData,
      transaction_parts: [...transactionParts, formTransactionPart],
    });
  };

  const deleteTransactionPart = (index) => {
    const updatedParts = [...transactionParts];
    updatedParts.splice(index, 1);
    setTransactionParts(updatedParts);
    setFormData({
      ...formData,
      transaction_parts: updatedParts,
    });
  };

  const [formTransactionPart, setFormTransactionPart] = useState<TransactionPart>({
    transaction_part_id: 0,
    transaction_id: 0,
    part_id: 0,
    part_name: "",
    quantity: 0,
    price: 0,
  });

  const [formData, setFormData] = useState<Transaction>({
      transaction_id: 0,
      user_id: 0,
      username: "",
      customer_id: 0,
      customer_name : "",
      transaction_type : "Sales",
      transaction_date : "",
      total_price : 0,
      additional_information : "",
      transaction_parts : [],
    });

    const [transactions, setSaless] = useState<TransactionSales>({
      transaction_transaction_id: 0,
      transaction_id: 0,
      part_id: 0,
      quantity: 0,
      price: 0,
    });

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormTransactionPart({
      ...formTransactionPart, 
      part_id: selectedOption.value,
      part_name: selectedOption.label
    });
    // Perform other actions or state updates based on the selected option here
  };
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleChangeCustomer = (selectedCustomer) => {
    setSelectedCustomer(selectedCustomer);
    setFormData({
      ...formData, 
      customer_id: selectedCustomer.value,
    });
    // Perform other actions or state updates based on the selected option here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(name === "transaction_date") {
      setFormData({
        ...formData,
        [name]: formatDate(value),
      });
    }else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value, 10);
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const handleNumberPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value, 10);
    setFormTransactionPart({
      ...formTransactionPart,
      [name]: parsedValue,
    });
  };
  
  const router = useRouter();
  
  const notify = () => toast.success('Sales added successfully!', {});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:7000/api/v1/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        notify();
        router.push('/sales/')
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.message || 'Unknown error occurred';
  
        // Handle error response
        toast.error(`Error response: ${errorMessage}`);
      }
    } catch (error) {
      toast.error('Error submitting :'+ error)
    }
  };

  function formatDate(inputDate: string) {
    return `${inputDate}T01:00:00+07:00`;
  }

  const [options, setOptions] = useState([]);
  const [optionsCustomer, setOptionsCustomer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Function to fetch options from the API
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:7000/api/v1/part?limit=-1`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const options = data.data.map((item: any) => ({
          value: item.part_id,
          label: `${item.part_name} | ${item.supplier_name}`,
        }));
        // Assuming the API response is an array of objects with 'value' and 'label' properties
        setOptions(options);
        const responseCustomer = await fetch(`http://localhost:7000/api/v1/customer?limit=-1`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const dataCustomer = await responseCustomer.json();
        const optionsCustomer = dataCustomer.data.map((item: any) => ({
          value: item.customer_id,
          label: `${item.customer_name}`,
        }));
        // Assuming the API response is an array of objects with 'value' and 'label' properties
        setOptionsCustomer(optionsCustomer);
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    // Calculate total price whenever formTransactionPart changes
    const newTotalPrice = formTransactionPart.price * formTransactionPart.quantity;
    setTotalPartPrice(isNaN(newTotalPrice) ? 0 : newTotalPrice);
  }, [formTransactionPart]);
  
  useEffect(() => {
    // Whenever transactionParts change, update selectedOption
    setSelectedOption(null);
  }, [transactionParts]);
  return (
    <>
    <Breadcrumb pageName="New Sales" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* Sales Form */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Sales Form
              </h3>
            </div>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-black dark:text-white">
                    Select date
                  </label>
                <div className="relative">
                  <input
                    type="date"
                    name="transaction_date"
                    onChange={handleInputChange}
                    className="custom-input-date custom-input-date-2 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Customer
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isLoading={isLoading}
                      isClearable={true}
                      isSearchable={true}
                      name="customers"
                      options={optionsCustomer}
                      onChange={handleChangeCustomer}
                      value={selectedCustomer}
                    />
                  </div>
                                
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Informations
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Additional Information"
                    name="additional_information"
                    value={formData.additional_information}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Parts
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isLoading={isLoading}
                      isClearable={true}
                      isSearchable={true}
                      name="parts"
                      options={options}
                      onChange={handleChange}
                      value={selectedOption}
                    />
                    </div>
                    <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Price
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Price"
                      name="price"
                      value={formTransactionPart.price}
                      onChange={handleNumberPartChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    </div>
                    <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Quantity"
                      name="quantity"
                      value={formTransactionPart.quantity}
                      onChange={handleNumberPartChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    </div>
                    <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Total Price: {totalPartPrice}
                    </label>
                  </div>
                  <button type="button" onClick={addTransactionPart} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                    Add Parts
                  </button>
                </div>
                
                <TableTransactionPart data={transactionParts} handleDelete={deleteTransactionPart} />
                </div>

                {/* Include other fields similar to above for phone_number, contact_person, etc. */}

                <div className="mb-4.5"></div>
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormLayout;
