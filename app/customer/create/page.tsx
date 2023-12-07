"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Supplier } from "@/types/supplier";

export const metadata: Metadata = {
  title: "Form Layout Page | Next.js E-commerce Dashboard Template",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};

const FormLayout = () => {
  const [formData, setFormData] = useState<Supplier>({
    supplier_id: 0,
    supplier_name: '',
    phone_number: '',
    email: '',
    contact_person: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const router = useRouter();
  
  const notify = () => toast.success('Supplier added successfully!', {});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:7000/api/v1/supplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        notify();
        router.push('/supplier/')
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

  return (
    <>
    <Breadcrumb pageName="New Supplier" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* Supplier Form */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Supplier Form
              </h3>
            </div>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter supplier's name"
                    name="supplier_name"
                    value={formData.supplier_name}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Contact Person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                                
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
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
