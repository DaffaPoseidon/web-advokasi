// src/pages/dataRekap/DataRekap.js
import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import xlsx library

const DataRekap = () => {
  const [cases, setCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk pencarian berdasarkan nama penggugat
  const navigate = useNavigate();

  // Fungsi untuk mengambil daftar kasus
  const fetchCases = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect jika token tidak ada
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cases?filter=`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        console.error('Token invalid, redirecting to Landing Page');
        navigate('/'); // Redirect ke halaman login jika token invalid
        return;
      }

      const data = await response.json();
      setCases(data.cases);
    } catch (error) {
      console.error('Error fetching cases:', error.message);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Fungsi untuk menangani perubahan pencarian
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter hasil berdasarkan pencarian
  const filteredCases = cases.filter((caseItem) =>
    caseItem.penggugat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fungsi untuk mengekspor data ke Excel
  const handleDownloadExcel = () => {
    // Menyiapkan data yang akan dimasukkan ke dalam Excel
    const modifiedCases = filteredCases.map((caseItem, index) => {
      // Menghapus kolom yang tidak diperlukan dan mengganti _id dengan nomor urut
      return {
        Nomor: index + 1, // Kolom nomor urut
        'No Perkara': caseItem.noPerkara,
        Penggugat: caseItem.penggugat,
        'Objek Gugatan': caseItem.objekGugatan,
        'MDN Sebagai': caseItem.mdnSebagai,
        Status: caseItem.status,
        'Posisi Perkara': caseItem.posisiPerkara,
      };
    });

    // Convert modified data menjadi sheet Excel
    const ws = XLSX.utils.json_to_sheet(modifiedCases); // Convert the modified data to Excel sheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data Kasus'); // Append the sheet to the workbook

    // Generate the Excel file and trigger the download
    XLSX.writeFile(wb, 'data_kasus.xlsx');
  };

  // Fungsi untuk kembali ke home/landing page
  const goToHome = () => {
    navigate('/'); // Mengarahkan pengguna ke halaman utama
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tombol atau Logo untuk kembali ke halaman utama */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-6">Data Rekap Perkara</h1>
          <button
            onClick={goToHome} // Ketika tombol diklik, kembali ke home
            className="text-blue-500 hover:text-blue-700 font-bold text-lg"
          >
            Kembali ke Beranda
          </button>
        </div>

        {/* Search bar and Download Button */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Cari berdasarkan nama penggugat..."
            value={searchQuery}
            onChange={handleSearchChange} // Directly handle change
            className="px-4 py-2 w-full sm:w-80 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Tombol untuk mengekspor ke Excel */}
          <button
            onClick={handleDownloadExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Download Semua Data Dalam Excel
          </button>
        </div>

        {/* Tabel Daftar Kasus */}
        <div className="bg-white shadow rounded p-6 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Daftar Kasus</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nomor</th>
                <th className="border border-gray-300 px-4 py-2">No Perkara</th>
                <th className="border border-gray-300 px-4 py-2">Penggugat</th>
                <th className="border border-gray-300 px-4 py-2">Objek Gugatan</th>
                <th className="border border-gray-300 px-4 py-2">MDN Sebagai</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Posisi Perkara</th>
                <th className="border border-gray-300 px-4 py-2">File</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((caseItem, index) => (
                <tr key={caseItem._id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{caseItem.noPerkara}</td>
                  <td className="border border-gray-300 px-4 py-2">{caseItem.penggugat}</td>
                  <td className="border border-gray-300 px-4 py-2">{caseItem.objekGugatan}</td>
                  <td className="border border-gray-300 px-4 py-2">{caseItem.mdnSebagai}</td>
                  <td className="border border-gray-300 px-4 py-2">{caseItem.status}</td>
                  <td className="border border-gray-300 px-4 py-2">{caseItem.posisiPerkara}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {caseItem.file ? (
                      <a
                        href={`${process.env.REACT_APP_API_BASE_URL}/cases/${caseItem._id}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Download
                      </a>
                    ) : (
                      'Tidak ada file'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataRekap;



// // src/pages/dataRekap/DataRekap.js
// import React, { useState, useEffect } from 'react';
// import API_BASE_URL from '../../config';
// import { useNavigate } from 'react-router-dom';

// const DataRekap = () => {
//   const [cases, setCases] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filter, setFilter] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate(); // Inisialisasi navigate

//   // Fungsi untuk mengambil daftar kasus
//   const fetchCases = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       // Redirect jika token tidak ada (belum login)
//       navigate('/'); // Navigasi ke halaman Landing Page jika token tidak ada
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/cases?page=${currentPage}&filter=${filter}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401 || response.status === 403) {
//         console.error('Token invalid, redirecting to Landing Page');
//         navigate('/'); // Redirect ke halaman login jika token invalid
//         return;
//       }

//       const data = await response.json();
//       setCases(data.cases);
//     } catch (error) {
//       console.error('Error fetching cases:', error.message);
//     }
//   };

//   useEffect(() => {
//     fetchCases();
//   }, [currentPage, filter]);

//   // Fungsi untuk menangani perubahan pencarian
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   // Filter hasil berdasarkan pencarian
//   const filteredCases = cases.filter((caseItem) =>
//     caseItem.penggugat.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Fungsi untuk menangani download file
//   const handleDownload = (fileUrl) => {
//     window.open(fileUrl, '_blank');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-gray-700 mb-6">Data Rekap Perkara</h1>

//         {/* Search bar */}
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Cari berdasarkan nama penggugat..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="px-4 py-2 w-full sm:w-80 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Tabel Daftar Kasus */}
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
//           <thead>
//             <tr className="text-center bg-gray-100 border-b border-gray-300">
//               <th className="px-4 py-2 text-sm font-semibold text-gray-700 border-r border-gray-300">Nomor</th> {/* Kolom Nomor */}
//               <th className="px-4 py-2 text-sm font-semibold text-gray-700 border-r border-gray-300">No Perkara</th>
//               <th className="px-4 py-2 text-sm font-semibold text-gray-700 border-r border-gray-300">Penggugat</th>
//               <th className="px-4 py-2 text-sm font-semibold text-gray-700 border-r border-gray-300">Objek Gugatan</th>
//               <th className="px-4 py-2 text-sm font-semibold text-gray-700 border-r border-gray-300">MDN Sebagai</th>
//               <th className="px-4 py-2 text-sm font-semibold text-gray-700 border-r border-gray-300">Status</th>
//               <th className="px-4 py-2 text-sm font-semibold text-gray-700 border-r border-gray-300">Posisi Perkara</th>
//               <th className="px-4 py-2 text-sm font-semibold text-gray-700">File</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredCases.map((caseItem, index) => (
//               <tr key={caseItem._id} className="border-b border-gray-300">
//                 {/* Nomor urut berdasarkan index */}
//                 <td className="px-4 py-2 text-sm text-gray-700 text-center border-r border-gray-300">{index + 1}</td> {/* Menambahkan Nomor */}
//                 <td className="px-4 py-2 text-sm text-gray-700 text-center border-r border-gray-300">{caseItem.noPerkara}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 text-center border-r border-gray-300">{caseItem.penggugat}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 text-center border-r border-gray-300">{caseItem.objekGugatan}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 text-center border-r border-gray-300">{caseItem.mdnSebagai}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 text-center border-r border-gray-300">{caseItem.status}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 text-center border-r border-gray-300">{caseItem.posisiPerkara}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 text-center">
//                   {caseItem.file ? (
//                     <button
//                       onClick={() => handleDownload(`${API_BASE_URL}/cases/${caseItem._id}/file`)} // URL untuk mengunduh file
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     >
//                       Download
//                     </button>
//                   ) : (
//                     'Tidak ada file'
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="mt-6 flex justify-between">
//           <button
//             onClick={() => setCurrentPage(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-300 text-white rounded-md"
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => setCurrentPage(currentPage + 1)}
//             className="px-4 py-2 bg-gray-300 text-white rounded-md"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataRekap;
