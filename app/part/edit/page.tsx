"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useRouter,useSearchParams } from 'next/navigation';
import { Part } from "@/types/part";
import Select from 'react-select';

export const metadata: Metadata = {
  title: "KingKong Motor",
  description: "KingKong Motor",
  // other metadata
};
const FormLayout = () => {

  const [formData, setFormData] = useState<Part>({
    part_id: 0,
    part_name: '',
    supplier_id: 0,
    supplier_name:'',
    price: 0,
    stock_quantity: 0,
  });

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormData({
      ...formData,
      supplier_id: selectedOption.value
    });
    // Perform other actions or state updates based on the selected option here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value, 10);
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };
  
  const router = useRouter();
  
  const notify = () => toast.success('Part added successfully!', {});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:7000/api/v1/part/${formData.part_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        notify();
        router.push('/part/')
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

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  useEffect(() => {
    fetch(`http://localhost:7000/api/v1/part/${id}`)
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData && responseData.data) {
          const parts: Part = responseData.data;
          setFormData(parts);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) return <p>Loading...</p>

  return (
    <>
    <Breadcrumb pageName="New Part" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* Part Form */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Part Form
              </h3>
            </div>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Part Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter part's name"
                    name="part_name"
                    value={formData.part_name}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Supplier
                  </label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isLoading={isLoading}
                    isClearable={true}
                    isSearchable={true}
                    name="supplier"
                    options={options}
                    onChange={handleChange}
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
                    value={formData.price}
                    onChange={handleNumberChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Stock"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleNumberChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                {/* Include other fields similar to above for phone_number, contact_person, etc. */}

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
