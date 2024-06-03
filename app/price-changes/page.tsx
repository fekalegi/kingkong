"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Pagination from "@/components/Paginations";
import TablePriceChanges from "@/components/Tables/TablePriceChanges";
import { PriceChanges } from "@/types/price-changes";
import {useRouter} from "next/navigation";
import { useEffect, useState } from "react";

const TablesPage = () => {
  const [data, setData] = useState<PriceChanges[] | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoading, setLoading] = useState(true);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const route = useRouter();

  const refreshTable = async (newOffset: number, newLimit: number) => {
    fetch(`http://localhost:7000/api/v1/changes-log?limit=${newLimit}&offset=${newOffset}&search=${search}`)
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData && responseData.data) {
          const suppliers: PriceChanges[] = responseData.data.map((item: any) => ({
            part_name: item.part_name,
            supplier_name: item.supplier_name,
            price_before: item.price_before,
            price_after: item.price_after,
            created_date: item.created_date,
          }));
          setTotalData(responseData.meta.total);
          setData(suppliers);
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

  const handlePageChange = (newOffset: number) => {
    refreshTable(newOffset, limit);
    setOffset(newOffset);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    refreshTable(offset, newLimit);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch(value);
  };

  function formatDate(inputDate: string) {
    const utcDate = new Date(inputDate);
    utcDate.setUTCHours(-7); // Set hours to 0 while keeping the same day

    console.log(utcDate.toISOString().replace('T00:00:00.000Z', 'T00:00:00Z'));
    return utcDate.toISOString().replace('T00:00:00.000Z', 'T00:00:00Z');;
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStartDate(formatDate(value));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEndDate(formatDate(value));
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    let url = `http://localhost:7000/api/v1/changes-log?limit=${limit}&offset=${offset}&search=${search}`;
    if (startDate != "") {
      url = url + `&start_date=${startDate}`
    }
    if (endDate != "") {
      url = url + `&end_date=${endDate}`
    }
    e.preventDefault();
    fetch(url)
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData && responseData.data) {
          const suppliers: PriceChanges[] = responseData.data.map((item: any) => ({
            part_name: item.part_name,
            supplier_name: item.supplier_name,
            price_before: item.price_before,
            price_after: item.price_after,
            created_date: item.created_date,
          }));
          setTotalData(responseData.meta.total);
          setData(suppliers);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <>
      <Breadcrumb pageName="Part Price Changes" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <form onSubmit={handleSearch}>
                
              <div className="mb-4.5">
                  <label className="mb-3 block text-black dark:text-white">
                    Select Start Date
                  </label>
                <input
                    type="date"
                    name="start_date"
                    onChange={handleStartDateChange}
                    className="custom-input-date custom-input-date-2 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  </div>
                  
                <div className="mb-4.5">
                  <label className="mb-3 block text-black dark:text-white">
                    Select End Date
                  </label>
                  <input
                      type="date"
                      name="end_date"
                      onChange={handleEndDateChange}
                      className="custom-input-date custom-input-date-2 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    </div>
                <input
                      type="text"
                      placeholder="Search ... "
                      name="supplier_name"
                      value={search}
                      onChange={handleSearchChange}
                      className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                <button className="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="40px" width="40" height="40" viewBox="0 0 128 128">
                    <path fill="#fff" d="M108.9,108.9L108.9,108.9c-2.3,2.3-6.1,2.3-8.5,0L87.7,96.2c-2.3-2.3-2.3-6.1,0-8.5l0,0c2.3-2.3,6.1-2.3,8.5,0l12.7,12.7C111.2,102.8,111.2,106.6,108.9,108.9z"></path><path fill="#fff" d="M52.3 17.299999999999997A35 35 0 1 0 52.3 87.3A35 35 0 1 0 52.3 17.299999999999997Z" transform="rotate(-45.001 52.337 52.338)"></path><path fill="#fff" d="M52.3 17.299999999999997A35 35 0 1 0 52.3 87.3A35 35 0 1 0 52.3 17.299999999999997Z" transform="rotate(-45.001 52.337 52.338)"></path><path fill="#adf9d2" d="M52.3 84.3c-1.7 0-3-1.3-3-3s1.3-3 3-3c6.9 0 13.5-2.7 18.4-7.6 6.4-6.4 9-15.5 6.9-24.4-.4-1.6.6-3.2 2.2-3.6 1.6-.4 3.2.6 3.6 2.2C86 55.8 82.9 67.1 75 75 68.9 81 60.9 84.3 52.3 84.3zM72.9 35c-.8 0-1.5-.3-2.1-.9L70.8 34c-1.2-1.2-1.2-3.1 0-4.3 1.2-1.2 3-1.2 4.2 0l.1.1c1.2 1.2 1.2 3.1 0 4.3C74.5 34.7 73.7 35 72.9 35z"></path><path fill="#444b54" d="M52.3 90.3c-9.7 0-19.5-3.7-26.9-11.1-14.8-14.8-14.8-38.9 0-53.7 14.8-14.8 38.9-14.8 53.7 0 0 0 0 0 0 0C94 40.3 94 64.4 79.2 79.2 71.8 86.6 62.1 90.3 52.3 90.3zM52.3 20.4c-8.2 0-16.4 3.1-22.6 9.4-12.5 12.5-12.5 32.8 0 45.3C42.2 87.4 62.5 87.4 75 75c12.5-12.5 12.5-32.8 0-45.3C68.7 23.5 60.5 20.4 52.3 20.4zM111 98.3L98.3 85.6c-1.7-1.7-4-2.6-6.4-2.6-1.4 0-2.7.3-3.9.9l-2.5-2.5c-1.2-1.2-3.1-1.2-4.2 0-1.2 1.2-1.2 3.1 0 4.2l2.5 2.5c-1.6 3.3-1 7.5 1.7 10.2L98.3 111c1.8 1.8 4.1 2.6 6.4 2.6s4.6-.9 6.4-2.6c0 0 0 0 0 0 1.7-1.7 2.6-4 2.6-6.4C113.7 102.3 112.7 100 111 98.3zM106.8 106.8C106.8 106.8 106.8 106.8 106.8 106.8c-1.2 1.2-3.1 1.2-4.2 0L89.8 94.1c-1.2-1.2-1.2-3.1 0-4.2 0 0 0 0 0 0 0 0 0 0 0 0 .6-.6 1.3-.9 2.1-.9.8 0 1.6.3 2.1.9l12.7 12.7c.6.6.9 1.3.9 2.1S107.4 106.2 106.8 106.8z"></path>
                  </svg>
                </button>
              </form>
          </div>
        </div>
        <TablePriceChanges data={data} />
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
