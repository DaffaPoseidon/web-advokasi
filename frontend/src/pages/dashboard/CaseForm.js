import React, { useState, useEffect } from 'react';

const CaseForm = ({ refreshCases, editMode, formData, setFormData, handleUpdate, setEditMode }) => {
    const initialFormState = {
        noPerkara: '',
        penggugat: '',
        objekGugatan: '',
        mdnSebagai: '',
        status: 'Sedang Berjalan',
        posisiPerkara: 'Banding',
        file: null,
    };

    const [localFormData, setLocalFormData] = useState(initialFormState);

    useEffect(() => {
        if (editMode) {
            setLocalFormData(formData);
        } else {
            setLocalFormData(initialFormState);
        }
    }, [editMode, formData]);

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
            file: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editMode && handleUpdate) {  // Pastikan handleUpdate ada sebelum dipanggil
            await handleUpdate(localFormData);
        } else {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            Object.keys(localFormData).forEach((key) => {
                formDataToSend.append(key, localFormData[key]);
            });

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
    };

    return (
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
                <input type="file" name="file" onChange={handleFileChange}
                    className="border border-gray-300 rounded p-2" />
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
    );
};

export default CaseForm;


// import React, { useState, useEffect } from 'react';
// import API_BASE_URL from '../../config';

// const CaseForm = ({ refreshCases, editMode, formData, setFormData, handleUpdate, setEditMode }) => {
//     const initialFormState = {
//         noPerkara: '',
//         penggugat: '',
//         objekGugatan: '',
//         mdnSebagai: '',
//         status: 'Sedang Berjalan',
//         posisiPerkara: 'Banding',
//         file: null,
//     }

//     const [localFormData, setLocalFormData] = useState(initialFormState);

//     useEffect(() => {
//         if (editMode) {
//             setLocalFormData(formData);
//         } else {
//             setLocalFormData(initialFormState);
//         }
//     }, [editMode, formData]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setLocalFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleFileChange = (e) => {
//         setLocalFormData((prevData) => ({
//             ...prevData,
//             file: e.target.files[0],
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (editMode) {
//             await handleUpdate(localFormData);
//         } else {
//             const token = localStorage.getItem('token');
//             const formDataToSend = new FormData();
//             Object.keys(localFormData).forEach((key) => {
//                 formDataToSend.append(key, localFormData[key]);
//             });

//             try {
//                 const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cases`, {
//                     method: 'POST',
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: formDataToSend,
//                 });

//                 if (response.ok) {
//                     console.log('Kasus berhasil ditambahkan');
//                     refreshCases();
//                     setLocalFormData(initialFormState);
//                 } else {
//                     const errorResult = await response.json();
//                     console.error('Gagal menambahkan kasus:', errorResult.message || 'Unknown error');
//                 }
//             } catch (error) {
//                 console.error('Error:', error.message);
//             }
//         }
//     };

//     // Fungsi untuk membatalkan perubahan dan kembali ke mode input data
//     const handleCancel = () => {
//         setLocalFormData(initialFormState);  // Reset form ke state awal
//         setEditMode(false);  // Kembali ke mode input data (bukan edit)
//     };

//     return (
//         <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 mb-4">
//             <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Kasus' : 'Tambah Kasus Baru'}</h2>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//                 <input
//                     type="text"
//                     name="noPerkara"
//                     placeholder="No Perkara"
//                     value={localFormData.noPerkara}
//                     onChange={handleInputChange}
//                     className="border border-gray-300 rounded p-2"
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="penggugat"
//                     placeholder="Penggugat"
//                     value={localFormData.penggugat}
//                     onChange={handleInputChange}
//                     className="border border-gray-300 rounded p-2"
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="objekGugatan"
//                     placeholder="Objek Gugatan"
//                     value={localFormData.objekGugatan}
//                     onChange={handleInputChange}
//                     className="border border-gray-300 rounded p-2"
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="mdnSebagai"
//                     placeholder="MDN Sebagai"
//                     value={localFormData.mdnSebagai}
//                     onChange={handleInputChange}
//                     className="border border-gray-300 rounded p-2"
//                     required
//                 />
//                 <select
//                     name="status"
//                     value={localFormData.status}
//                     onChange={handleInputChange}
//                     className="border border-gray-300 rounded p-2"
//                     required
//                 >
//                     <option value="Sedang Berjalan">Sedang Berjalan</option>
//                     <option value="Selesai">Selesai</option>
//                     <option value="Semi Aktif">Semi Aktif</option>
//                 </select>
//                 <select
//                     name="posisiPerkara"
//                     value={localFormData.posisiPerkara}
//                     onChange={handleInputChange}
//                     className="border border-gray-300 rounded p-2"
//                     required
//                 >
//                     <option value="Banding">Banding</option>
//                     <option value="Kasasi">Kasasi</option>
//                     <option value="PK Aktif">PK Aktif</option>
//                 </select>
//                 <input
//                     type="file"
//                     name="file"
//                     onChange={handleFileChange}
//                     className="border border-gray-300 rounded p-2"
//                 />
//             </div>

//             <div className="flex space-x-4">
//                 <button
//                     type="submit"
//                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                     {editMode ? 'Update' : 'Simpan'}
//                 </button>
                
//                 {/* Tombol Batal hanya muncul di mode Edit */}
//                 {editMode && (
//                     <button
//                         type="button"
//                         onClick={handleCancel}
//                         className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                     >
//                         Batal
//                     </button>
//                 )}
//             </div>
//         </form>
//     );
// };

// export default CaseForm;
