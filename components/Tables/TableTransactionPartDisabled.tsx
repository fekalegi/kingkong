import { Part } from "@/types/part";
import { TransactionPart } from "@/types/transaction";
import { useRouter } from "next/navigation";

interface TableTransactionPartDisabledProps {
  data: TransactionPart[];
  handleDelete: (key: number) => Promise<void>;
}

const TableTransactionPartDisabled: React.FC<TableTransactionPartDisabledProps> = ({ data, handleDelete }) => {
  if (!data) {
    return <p>No data available</p>;
  }

  const router = useRouter();
  
  const handleDeleteClick = async (key: number) => {
    try {
      await handleDelete(key);
    } catch (error) {
      console.log(error);
    }
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
                Part Name | Supplier Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Price
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((packageItem, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                 <p className="font-medium text-black dark:text-white">
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
                    {packageItem.price}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {packageItem.quantity}
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

export default TableTransactionPartDisabled;
