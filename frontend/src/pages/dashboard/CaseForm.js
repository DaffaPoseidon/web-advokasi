// import React, { useState, useEffect, useRef } from 'react';

// const CaseForm = ({ initialFormState, refreshCases, editMode, formData, setFormData, handleUpdate, setEditMode, setShowModal }) => {
//   const [localFormData, setLocalFormData] = useState(initialFormState);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (editMode) {
//       setLocalFormData(formData);
//     } else {
//       setLocalFormData(initialFormState);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''; // Reset input file
//       }
//     }
//   }, [editMode, formData, initialFormState]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setLocalFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setLocalFormData((prevData) => ({
//       ...prevData,
//       file: e.target.files.length > 0 ? e.target.files : null,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editMode && handleUpdate) {
//       await handleUpdate(localFormData); // Panggil handleUpdate dari props
//     } else {
//       const token = localStorage.getItem('token');
//       const user = JSON.parse(localStorage.getItem('user'));
//       const penggugah = user ? user._id : 'Unknown';

//       const formDataToSend = new FormData();
//       Object.keys(localFormData).forEach((key) => {
//         if (key === 'file' && localFormData.file) {
//           Array.from(localFormData.file).forEach((file) => {
//             formDataToSend.append('files', file);
//           });
//         } else {
//           formDataToSend.append(key, localFormData[key]);
//         }
//       });

//       formDataToSend.append('penggugah', penggugah);

//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cases`, {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formDataToSend,
//         });

//         if (response.ok) {
//           console.log('Kasus berhasil ditambahkan');
//           refreshCases();
//           setLocalFormData(initialFormState);
//           if (fileInputRef.current) {
//             fileInputRef.current.value = ''; // Reset input file
//           }
//         } else {
//           const errorResult = await response.json();
//           console.error('Gagal menambahkan kasus:', errorResult.message || 'Unknown error');
//         }
//       } catch (error) {
//         console.error('Error:', error.message);
//       }
//     }
//   };

//   const handleCancel = () => {
//     setLocalFormData(initialFormState);
//     setEditMode(false);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''; // Reset input file
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 mb-4">
//         <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Kasus' : 'Tambah Kasus Baru'}</h2>
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             name="noPerkara"
//             placeholder="No Perkara"
//             value={localFormData.noPerkara}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//             required
//           />
//           <input
//             type="text"
//             name="penggugat"
//             placeholder="Penggugat"
//             value={localFormData.penggugat}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//             required
//           />
//           <input
//             type="text"
//             name="objekGugatan"
//             placeholder="Objek Gugatan"
//             value={localFormData.objekGugatan}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//             required
//           />
//           <input
//             type="text"
//             name="mdnSebagai"
//             placeholder="MDN Sebagai"
//             value={localFormData.mdnSebagai}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//             required
//           />
//           <select
//             name="status"
//             value={localFormData.status}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//             required
//           >
//             <option value="Sedang Berjalan">Sedang Berjalan</option>
//             <option value="Selesai">Selesai</option>
//             <option value="Semi Aktif">Semi Aktif</option>
//           </select>
//           <select
//             name="posisiPerkara"
//             value={localFormData.posisiPerkara}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//             required
//           >
//             <option value="Banding">Banding</option>
//             <option value="Kasasi">Kasasi</option>
//             <option value="PK Aktif">PK Aktif</option>
//           </select>
//           <input
//             type="file"
//             name="file"
//             multiple
//             onChange={handleFileChange}
//             ref={fileInputRef}
//             className="border border-gray-300 rounded p-2"
//           />
//         </div>

//         <div className="flex space-x-4">
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//             {editMode ? 'Update' : 'Simpan'}
//           </button>

//           {editMode && (
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Batal
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CaseForm;

import React, { useState, useEffect, useRef } from 'react';

const CaseForm = ({ initialFormState, refreshCases, editMode, formData, setFormData, handleUpdate, setEditMode }) => {
    const [localFormData, setLocalFormData] = useState(initialFormState);
    const [showModal, setShowModal] = useState(false); // Modal untuk validasi file
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (editMode) {
            setLocalFormData(formData);
        } else {
            setLocalFormData(initialFormState);
            setShowModal(false);
            // Reset input file saat keluar dari edit mode
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [editMode, formData, formData._fileResetKey]); // Tambahkan dependency

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setLocalFormData((prevData) => ({
            ...prevData,
            file: e.target.files.length > 0 ? e.target.files : null, // Cek apakah ada file
        }));
        setShowModal(false); // Tutup modal jika user memilih file baru
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!localFormData.file) {
          setShowModal(true);
          return;
        }
      
        if (editMode && handleUpdate) {
          await handleUpdate(localFormData);
        } else {
          const token = localStorage.getItem('token');
          const user = JSON.parse(localStorage.getItem("user"));
          const penggugah = user ? user._id : "Unknown";
      
          const formDataToSend = new FormData();
          Object.keys(localFormData).forEach((key) => {
            if (key === 'file' && localFormData.file) {
              Array.from(localFormData.file).forEach(file => {
                formDataToSend.append('files', file);
              });
            } else {
              formDataToSend.append(key, localFormData[key]);
            }
          });
      
          formDataToSend.append("penggugah", penggugah);
      
          try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cases`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formDataToSend,
            });
      
            if (response.ok) {
              console.log('Kasus berhasil ditambahkan');
              refreshCases();
              setLocalFormData(initialFormState);
              setShowModal(false);
              fileInputRef.current.value = ''; // Reset input file
            } else {
              const errorResult = await response.json();
              console.error('Gagal menambahkan kasus:', errorResult.message || 'Unknown error');
            }
          } catch (error) {
            console.error('Error:', error.message);
          }
        }
      };

    const handleCancel = () => {
        setLocalFormData(initialFormState);
        setEditMode(false);
        setShowModal(false); // Reset modal setelah berhasil submit
        fileInputRef.current.value = ''; // Reset input file
    };

    return (
        <div>
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
            <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 mb-4">
                <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Kasus' : 'Tambah Kasus Baru'}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="text" name="noPerkara" placeholder="No Perkara"
                        value={localFormData.noPerkara} onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2" required />
                    <input type="text" name="penggugat" placeholder="Penggugat"
                        value={localFormData.penggugat} onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2" required />
                    <input type="text" name="objekGugatan" placeholder="Objek Gugatan"
                        value={localFormData.objekGugatan} onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2" required />
                    <input type="text" name="mdnSebagai" placeholder="MDN Sebagai"
                        value={localFormData.mdnSebagai} onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2" required />
                    <select name="status" value={localFormData.status}
                        onChange={handleInputChange} className="border border-gray-300 rounded p-2" required>
                        <option value="Sedang Berjalan">Sedang Berjalan</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Semi Aktif">Semi Aktif</option>
                    </select>
                    <select name="posisiPerkara" value={localFormData.posisiPerkara}
                        onChange={handleInputChange} className="border border-gray-300 rounded p-2" required>
                        <option value="Banding">Banding</option>
                        <option value="Kasasi">Kasasi</option>
                        <option value="PK Aktif">PK Aktif</option>
                    </select>
                    <input
                        type="file"
                        name="file"
                        multiple
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        key={formData._fileResetKey || 'file-input'} // Gunakan key untuk reset
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex space-x-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        {editMode ? 'Update' : 'Simpan'}
                    </button>

                    {editMode && (
                        <button type="button" onClick={handleCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CaseForm;