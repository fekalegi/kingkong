import { useState, useEffect } from 'react';

interface PaginationProps {
  totalData: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalData, limit, offset, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages: number = Math.ceil(totalData / limit);

  useEffect(() => {
    setCurrentPage(Math.floor(offset / limit) + 1);
  }, [offset, limit]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onPageChange((pageNumber - 1) * limit);
  };

  return (
    <div className="flex justify-center mt-0">
      <nav>
        <ul className="pagination flex gap-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
