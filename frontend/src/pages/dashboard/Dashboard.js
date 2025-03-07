import React, { useState, useEffect, useCallback, useRef } from 'react';
import CaseForm from './CaseForm';
import CaseTable from './CaseTable';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    noPerkara: '',
    penggugat: '',
    objekGugatan: '',
    mdnSebagai: '',
    status: '',
    posisiPerkara: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false); // State untuk modal
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const initialFormState = {
    noPerkara: '',
    penggugat: '',
    objekGugatan: '',
    mdnSebagai: '',
    status: 'Sedang Berjalan',
    posisiPerkara: 'Banding',
    file: null,
  };

  // Fetch daftar kasus
  const fetchCases = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/cases?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        console.error('Token invalid, redirecting to login');
        navigate('/login');
        return;
      }

      const data = await response.json();
      setCases(data.cases);
    } catch (error) {
      console.error('Error fetching cases:', error.message);
    }
  }, [filter, navigate]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleDownloadExcel = () => {
    const modifiedCases = cases.map((caseItem, index) => ({
      Nomor: index + 1,
      'No Perkara': caseItem.noPerkara,
      Penggugat: caseItem.penggugat,
      'Objek Gugatan': caseItem.objekGugatan,
      'MDN Sebagai': caseItem.mdnSebagai,
      Status: caseItem.status,
      'Posisi Perkara': caseItem.posisiPerkara,
    }));

    const ws = XLSX.utils.json_to_sheet(modifiedCases);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Kasus');
    XLSX.writeFile(wb, 'data_kasus.xlsx');
  };

  // Fungsi delete kasus
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cases/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Kasus berhasil dihapus');
        fetchCases(); // Refresh data setelah delete
      } else {
        const errorResult = await response.json();
        console.error('Gagal menghapus kasus:', errorResult.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (caseData) => {
    setFormData(caseData);
    setEditMode(true);
  };

  const handleUpdate = async (localFormData) => {
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();

    // Validasi file saat update
    if (!localFormData.file) {
      setShowModal(true); // Tampilkan modal jika file tidak diunggah
      return; // Hentikan proses update
    }

    // Lanjutkan proses update jika file ada
    Object.keys(localFormData).forEach((key) => {
      if (key === 'file' && localFormData.file) {
        Array.from(localFormData.file).forEach((file) => {
          formDataToSend.append('files', file);
        });
      } else {
        formDataToSend.append(key, localFormData[key]);
      }
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/cases/${localFormData._id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        await fetchCases();
        setEditMode(false);
        setFormData(initialFormState); // Reset form
        fileInputRef.current.value = ''; // Reset input file
      } else {
        const errorResult = await response.json();
        console.error('Gagal memperbarui kasus:', errorResult.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const goToHome = () => {
    navigate('/'); // Kembali ke halaman utama
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-6">Dashboard</h1>
          <button
            onClick={goToHome}
            className="text-blue-500 hover:text-blue-700 font-bold text-lg"
          >
            Kembali ke Beranda
          </button>
        </div>

        {/* MODAL UNTUK FILE KOSONG */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <p className="text-red-500 text-lg font-bold">File harus diunggah!</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Form untuk menambah atau mengedit kasus */}
        <CaseForm
          initialFormState={initialFormState}
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
          handleUpdate={handleUpdate}
          refreshCases={fetchCases}
          setEditMode={setEditMode}
          setShowModal={setShowModal} // Kirim setShowModal ke CaseForm
        />

        {/* Search bar */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Cari berdasarkan nama penggugat..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 w-full sm:w-80 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleDownloadExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Download Semua Data Dalam Excel
          </button>
        </div>

        {/* Tabel kasus */}
        <CaseTable
          cases={cases.filter((caseItem) =>
            caseItem.penggugat.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          onEdit={handleEdit}
          onDelete={handleDelete}
          refreshCases={fetchCases}
        />
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import CaseForm from './CaseForm';
// import CaseTable from './CaseTable';
// import { useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';

// const Dashboard = () => {
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

//         {/* Form untuk menambah atau mengedit kasus */}
//         <CaseForm
//           initialFormState={initialFormState}
//           formData={formData}
//           setFormData={setFormData}
//           editMode={editMode}
//           handleUpdate={handleUpdate}
//           refreshCases={fetchCases}
//           setEditMode={setEditMode}
//         />

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
//           onEdit={handleEdit}
//           onDelete={handleDelete} // Kirim handleDelete ke CaseTable
//           refreshCases={fetchCases} // Kirim refreshCases agar bisa dipanggil di CaseTable
//         />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;