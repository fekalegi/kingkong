import { PriceChanges } from "@/types/price-changes";
import { useRouter } from "next/navigation";

interface TablePriceChangesProps {
  data: PriceChanges[];
  handleDelete: (key: number) => Promise<void>;
}

const TablePriceChanges: React.FC<TablePriceChangesProps> = ({ data }) => {
  if (!data) {
    return <p>No data available</p>;
  }

  const formatRP = (num: number) => {
    const formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(num);
    return formattedNumber
  };

  const formatDate = (dateString: string) => {
    const extractedDate = dateString.split('T')[0];
    return extractedDate
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">
                No
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Part Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Supplier Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Price Before
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Price After
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((packageItem, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {key + 1}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {packageItem.part_name}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {packageItem.supplier_name}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {formatRP(packageItem.price_before)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {formatRP(packageItem.price_after)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {formatDate(packageItem.created_date)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePriceChanges;
