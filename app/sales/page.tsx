"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Pagination from "@/components/Paginations";
import TableSales from "@/components/Tables/TableSales";
import { Transaction } from "@/types/transaction";
import { Metadata } from "next";
import {useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export const metadata: Metadata = {
  title: "KingKong Motor",
  description: "KingKong Motor",
  // other metadata
};

const TablesPage = () => {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [totalData, setTotalData] = useState(0);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const route = useRouter();

  const refreshTable = async (newOffset: number, newLimit: number) => {
    fetch(`http://localhost:7000/api/v1/transaction?limit=${newLimit}&offset=${newOffset}&type=Sales`)
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData && responseData.data) {
          const transactions: Transaction[] = responseData.data.map((item: any) => ({
            transaction_id: item.transaction_id,
            transaction_date: item.transaction_date,
            total_price: item.total_price,
            customer_name: item.customer_name,
            additional_information: item.additional_information,
            username: item.username
          }));
          setTotalData(responseData.meta.total);
          setData(transactions);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }
  useEffect(() => {
    refreshTable(offset, limit);
  }, []);

  
  const handleDelete = async (key: number) => {
    try {
      const response = await fetch(`http://localhost:7000/api/v1/transaction/${key}` , {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Part deleted successfully!', {});
        refreshTable(offset, limit);
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.message || 'Unknown error occurred';
  
        // Handle error response
        toast.error(`Error response: ${errorMessage}`);
      }
    } catch (error) {
      toast.error('Error submitting :'+ error);
    }
  };

  const handlePageChange = (newOffset: number) => {
    refreshTable(newOffset, limit);
    setOffset(newOffset);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    refreshTable(offset, newLimit);
  };

  if (isLoading) return <p>Loading...</p>

  return (
    <>
      <Breadcrumb pageName="Part" />
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold"></h1>
          <button
            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
            type="submit" onClick={() => {route.push('/sales/create')}}>
            Create New
          </button>
        </div>
        <TableSales data={data} handleDelete={handleDelete} />
      </div>
      <div className="flex flex-col gap-10">
      
      <div className="relative z-20 bg-white dark:bg-form-input" style={{ width: '100px', height: '50px' , marginTop: '5px'}}>
        <select
          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
          value={limit.toString()} // Controlled component to reflect the selected value
          onChange={handleLimitChange}
          style={{ width: '100%', height: '100%', padding: '5px' }} // Adjust padding for better appearance
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill="#637381"
              ></path>
            </g>
          </svg>
        </span>
      </div>
      <Pagination
        totalData={totalData}
        limit={limit}
        offset={offset}
        onPageChange={handlePageChange}
      />
    </div>
    </>
  );
};

export default TablesPage;
