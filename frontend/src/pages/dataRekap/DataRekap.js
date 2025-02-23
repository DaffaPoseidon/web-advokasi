// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import CaseTable from '../dashboard/CaseTable';
// import { useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';

// const DataRekap = () => {
//   const [cases, setCases] = useState([]); // Daftar kasus
//   const [filter, setFilter] = useState(''); // Filter untuk status
//   const [searchQuery, setSearchQuery] = useState(''); // Pencarian penggugat
//   const [formData, setFormData] = useState({
//     noPerkara: '',
//     penggugat: '',
//     objekGugatan: '',
//     mdnSebagai: '',
//     status: '',
//     posisiPerkara: '',
//   });
//   const [editMode, setEditMode] = useState(false);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   const initialFormState = {
//     noPerkara: '',
//     penggugat: '',
//     objekGugatan: '',
//     mdnSebagai: '',
//     status: 'Sedang Berjalan',
//     posisiPerkara: 'Banding',
//     file: null,
//   };

//   // Fetch daftar kasus
//   const fetchCases = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/cases?filter=${filter}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 401 || response.status === 403) {
//         console.error('Token invalid, redirecting to login');
//         navigate('/login');
//         return;
//       }

//       const data = await response.json();
//       setCases(data.cases);
//     } catch (error) {
//       console.error('Error fetching cases:', error.message);
//     }
//   }, [filter, navigate]);

//   useEffect(() => {
//     fetchCases();
//   }, [fetchCases]);

//   const handleDownloadExcel = () => {
//     const modifiedCases = cases.map((caseItem, index) => ({
//       Nomor: index + 1,
//       'No Perkara': caseItem.noPerkara,
//       Penggugat: caseItem.penggugat,
//       'Objek Gugatan': caseItem.objekGugatan,
//       'MDN Sebagai': caseItem.mdnSebagai,
//       Status: caseItem.status,
//       'Posisi Perkara': caseItem.posisiPerkara,
//     }));

//     const ws = XLSX.utils.json_to_sheet(modifiedCases);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Data Kasus');
//     XLSX.writeFile(wb, 'data_kasus.xlsx');
//   };

//   // Fungsi delete kasus
//   const handleDelete = async (id) => {
//     const token = localStorage.getItem('token');

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cases/${id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         console.log('Kasus berhasil dihapus');
//         fetchCases(); // Refresh data setelah delete
//       } else {
//         const errorResult = await response.json();
//         console.error('Gagal menghapus kasus:', errorResult.message);
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleEdit = (caseData) => {
//     setFormData(caseData);
//     setEditMode(true);
//   };

//   const handleUpdate = async (localFormData) => {
//     const token = localStorage.getItem('token');
//     const formDataToSend = new FormData();
  
//     Object.keys(localFormData).forEach((key) => {
//       if (key === 'file' && localFormData.file) {
//         Array.from(localFormData.file).forEach((file) => {
//           formDataToSend.append('files', file);
//         });
//       } else {
//         formDataToSend.append(key, localFormData[key]);
//       }
//     });
  
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/cases/${localFormData._id}`,
//         {
//           method: 'PUT',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formDataToSend,
//         }
//       );
  
//       if (response.ok) {
//         await fetchCases();
//         setEditMode(false);
//         setFormData(initialFormState); // Reset form
//         fileInputRef.current.value = ''; // Reset input file
//       } else {
//         const errorResult = await response.json();
//         console.error('Gagal memperbarui kasus:', errorResult.message);
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };

//   const goToHome = () => {
//     navigate('/'); // Kembali ke halaman utama
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-700 mb-6">Dashboard</h1>
//           <button
//             onClick={goToHome}
//             className="text-blue-500 hover:text-blue-700 font-bold text-lg"
//           >
//             Kembali ke Beranda
//           </button>
//         </div>

//         {/* Search bar */}
//         <div className="mb-6 flex items-center space-x-4">
//           <input
//             type="text"
//             placeholder="Cari berdasarkan nama penggugat..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="px-4 py-2 w-full sm:w-80 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={handleDownloadExcel}
//             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//           >
//             Download Semua Data Dalam Excel
//           </button>
//         </div>

//         {/* Tabel kasus */}
//         <CaseTable
//           cases={cases.filter((caseItem) =>
//             caseItem.penggugat.toLowerCase().includes(searchQuery.toLowerCase())
//           )}
//           refreshCases={fetchCases} // Kirim refreshCases agar bisa dipanggil di CaseTable
//         />
//       </div>
//     </div>
//   );
// };

// export default DataRekap;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const DataRekap = () => {
  const user = JSON.parse(localStorage.getItem("user"));
const userRole = user?.role; // Ambil role dari user (bisa undefined jika tidak ada user)

  const [cases, setCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchCases = useCallback(async () => {
    const token = localStorage.getItem("token");
    // if (!token) {
    //   navigate('/login');
    //   return;
    // }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/cases`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // if (response.status === 401 || response.status === 403) {
      //   console.error('Token invalid, redirecting to login');
      //   navigate('/login');
      //   return;
      // }

      const data = await response.json();
      setCases(data.cases);
    } catch (error) {
      console.error("Error fetching cases:", error.message);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleDownloadExcel = () => {
    const modifiedCases = cases.map((caseItem, index) => ({
      Nomor: index + 1,
      "No Perkara": caseItem.noPerkara,
      Penggugat: caseItem.penggugat,
      "Objek Gugatan": caseItem.objekGugatan,
      "MDN Sebagai": caseItem.mdnSebagai,
      Status: caseItem.status,
      "Posisi Perkara": caseItem.posisiPerkara,
    }));

    const ws = XLSX.utils.json_to_sheet(modifiedCases);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Kasus");
    XLSX.writeFile(wb, "data_kasus.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-6">
            Data Rekap Perkara
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-blue-500 hover:text-blue-700 font-bold text-lg"
          >
            Kembali ke Beranda
          </button>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Cari berdasarkan nama penggugat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 w-full sm:w-80 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {["admin", "superadmin"].includes(userRole) && (
            <button
              onClick={handleDownloadExcel}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Download Semua Data Dalam Excel
            </button>
          )}
        </div>

        <div className="bg-white shadow rounded p-6 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Daftar Kasus</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">No</th>
                <th className="border border-gray-300 px-4 py-2">No Perkara</th>
                <th className="border border-gray-300 px-4 py-2">Penggugat</th>
                <th className="border border-gray-300 px-4 py-2">
                  Objek Gugatan
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  MDN Sebagai
                </th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">
                  Posisi Perkara
                </th>
                {["admin", "superadmin"].includes(userRole) && (
                  <th className="border border-gray-300 px-4 py-2">Download</th>
                )}
              </tr>
            </thead>
            <tbody>
              {cases
                .filter((caseItem) =>
                  caseItem.penggugat
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((caseItem, index) => (
                  <tr key={caseItem._id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {caseItem.noPerkara}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {caseItem.penggugat}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {caseItem.objekGugatan}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {caseItem.mdnSebagai}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {caseItem.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {caseItem.posisiPerkara}
                    </td>
                    {["admin", "superadmin"].includes(userRole) && (
                      <td className="border border-gray-300 px-4 py-2">
                        {caseItem.files.length > 0 ? (
                          <ul>
                            {caseItem.files.map((file, index) => (
                              <li key={index}>
                                <a
                                  href={`${process.env.REACT_APP_BACKEND_BASEURL}/api/cases/${caseItem._id}/files/${index}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  {file.fileName}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "Tidak ada file"
                        )}
                      </td>
                    )}
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
