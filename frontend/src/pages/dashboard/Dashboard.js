import React, { useState, useEffect, useCallback } from 'react';
import CaseForm from './CaseForm';
import CaseTable from './CaseTable';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import * as XLSX from 'xlsx'; // Import xlsx library

const Dashboard = () => {
  const [cases, setCases] = useState([]); // Daftar kasus
  const [filter, setFilter] = useState(''); // Filter untuk status selesai/BELUM selesai
  const [searchQuery, setSearchQuery] = useState(''); // State untuk pencarian berdasarkan nama penggugat
  const [formData, setFormData] = useState({
    noPerkara: '',
    penggugat: '',
    objekGugatan: '',
    mdnSebagai: '',
    status: '',
    posisiPerkara: '',
  });
  const [editMode, setEditMode] = useState(false); // Mode edit
  const navigate = useNavigate();

  const initialFormState = {
    noPerkara: '',
    penggugat: '',
    objekGugatan: '',
    mdnSebagai: '',
    status: 'Sedang Berjalan',
    posisiPerkara: 'Banding',
  };

  // Fungsi untuk mengambil daftar kasus
  const fetchCases = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/cases?filter=${filter}`,
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

  // Ambil kasus ketika halaman dimuat atau filter/pencarian berubah
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Fungsi untuk menangani perubahan pencarian
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter hasil berdasarkan pencarian
  const filteredCases = cases.filter((caseItem) =>
    caseItem.penggugat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fungsi untuk mengedit kasus
  const handleEdit = (caseData) => {
    setFormData(caseData);
    setEditMode(true);
  };

  const handleUpdate = async (localFormData) => {
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();

    Object.keys(localFormData).forEach((key) => {
      // formDataToSend.append(key, localFormData[key]);
      if (key === 'file' && localFormData[key] instanceof File) {
        formDataToSend.append(key, localFormData[key]);
      } else {
        formDataToSend.append(key, localFormData[key]);
      }
    });

    // Object.entries(formData).forEach(([key, value]) => {
    //   if (key === 'file' && value instanceof File) {
    //     formDataToSend.append(key, value);
    //   } else {
    //     formDataToSend.append(key, value);
    //   }
    // });

    try {
      const response = await fetch(`${API_BASE_URL}/cases/${formData._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchCases(); // Refresh data setelah update
        setEditMode(false); // Keluar dari mode edit
        setFormData(initialFormState); // Reset form
      } else {
        const errorResult = await response.json();
        console.error('Gagal memperbarui kasus:', errorResult.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

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

  const goToHome = () => {
    navigate('/'); // Mengarahkan pengguna ke halaman utama
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-6">Dashboard</h1>
          <button
            onClick={goToHome} // Ketika tombol diklik, kembali ke home
            className="text-blue-500 hover:text-blue-700 font-bold text-lg"
          >
            Kembali ke Beranda
          </button>
        </div>


        {/* Form untuk menambah atau mengedit kasus */}
        <CaseForm
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
          handleUpdate={handleUpdate}
          refreshCases={fetchCases}
          setEditMode={setEditMode}
        />

        {/* Search bar */}
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

        {/* Tabel kasus */}
        <CaseTable
          cases={filteredCases} // Tampilkan hasil yang sudah difilter
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default Dashboard;