"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useRouter,useSearchParams } from 'next/navigation';
import { Transaction, TransactionPart } from "@/types/transaction";
import TableTransactionPartDisabled from "@/components/Tables/TableTransactionPartDisabled";

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
      transaction_type : "Purchase",
      transaction_date : "",
      total_price : 0,
      additional_information : "",
      transaction_parts : [],
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
  
  const notify = () => toast.success('Purchase added successfully!', {});

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
        router.push('/purchase/')
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

  const formatDate = (dateString: string) => {
    const extractedDate = dateString.split('T')[0];
    return extractedDate
  };

  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  useEffect(() => {
    fetch(`http://localhost:7000/api/v1/transaction/${id}`)
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData && responseData.data) {
          let transaction: Transaction = responseData.data;
          const transactionParts: TransactionPart[] = responseData.data.transaction_parts;
          const transactionDate = responseData.data.transaction_date;
          transaction.transaction_date = formatDate(transactionDate);
          setFormData(transaction);
          setTransactionParts(transactionParts);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>

  return (
    <>
    <Breadcrumb pageName="View Purchase" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* Purchase Form */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Purchase Form
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
                    disabled={true}
                    name="transaction_date"
                    onChange={handleInputChange}
                    defaultValue={formData.transaction_date}
                    className="custom-input-date custom-input-date-2 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                </div>
                                
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Informations
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    placeholder=" - "
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
                    
                  </div>
                </div>
                
                <TableTransactionPartDisabled data={transactionParts} handleDelete={deleteTransactionPart} />
                </div>

                {/* Include other fields similar to above for phone_number, contact_person, etc. */}

                <div className="mb-4.5"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormLayout;
