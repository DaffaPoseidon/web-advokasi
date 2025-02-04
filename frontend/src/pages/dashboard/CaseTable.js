import React from 'react';

const CaseTable = ({ cases, onEdit, onDelete, refreshCases }) => {
  // Ambil data user dari localStorage dan parse ke JSON
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role; // Ambil role dari user (bisa undefined jika tidak ada user)

  const handleDelete = async (id) => {
    if (!onDelete) return;

    await onDelete(id);
    if (refreshCases) {
      refreshCases(); // Panggil refresh setelah delete berhasil
    } else {
      console.error("refreshCases is not defined");
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Daftar Kasus</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">No Perkara</th>
            <th className="border border-gray-300 px-4 py-2">Penggugat</th>
            <th className="border border-gray-300 px-4 py-2">Objek Gugatan</th>
            <th className="border border-gray-300 px-4 py-2">MDN Sebagai</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Posisi Perkara</th>
            <th className="border border-gray-300 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item, index) => (
            <tr key={item._id}>
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{item.noPerkara}</td>
              <td className="border border-gray-300 px-4 py-2">{item.penggugat}</td>
              <td className="border border-gray-300 px-4 py-2">{item.objekGugatan}</td>
              <td className="border border-gray-300 px-4 py-2">{item.mdnSebagai}</td>
              <td className="border border-gray-300 px-4 py-2">{item.status}</td>
              <td className="border border-gray-300 px-4 py-2">{item.posisiPerkara}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => onEdit(item)}>
                  Edit
                </button>
                {/* Tombol Delete hanya ditampilkan jika role = superadmin */}
                {userRole === "superadmin" && (
                  <button className="bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseTable;


// import API_BASE_URL from '../../config';

// const CaseTable = ({ cases, onEdit }) => {
//   return (
//     <div className="bg-white shadow rounded p-6 overflow-x-auto">
//       <h2 className="text-xl font-bold mb-4">Daftar Kasus</h2>
//       <table className="table-auto w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border border-gray-300 px-4 py-2">No</th>
//             <th className="border border-gray-300 px-4 py-2">No Perkara</th>
//             <th className="border border-gray-300 px-4 py-2">Penggugat</th>
//             <th className="border border-gray-300 px-4 py-2">Objek Gugatan</th>
//             <th className="border border-gray-300 px-4 py-2">MDN Sebagai</th>
//             <th className="border border-gray-300 px-4 py-2">Status</th>
//             <th className="border border-gray-300 px-4 py-2">Posisi Perkara</th>
//             <th className="border border-gray-300 px-4 py-2">Aksi</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cases.map((item, index) => (
//             <tr key={item._id}>
//               <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
//               <td className="border border-gray-300 px-4 py-2">{item.noPerkara}</td>
//               <td className="border border-gray-300 px-4 py-2">{item.penggugat}</td>
//               <td className="border border-gray-300 px-4 py-2">{item.objekGugatan}</td>
//               <td className="border border-gray-300 px-4 py-2">{item.mdnSebagai}</td>
//               <td className="border border-gray-300 px-4 py-2">{item.status}</td>
//               <td className="border border-gray-300 px-4 py-2">{item.posisiPerkara}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 <button
//                   className="bg-yellow-500 text-white px-4 py-2 rounded"
//                   onClick={() => onEdit(item)}
//                 >
//                   Edit
//                 </button>
//               </td>

//               <td className="border border-gray-300 px-4 py-2">
//                 {item.file ? (
//                   <a
//                     href={`${process.env.REACT_APP_API_BASE_URL}/cases/${item._id}/file`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 underline"
//                   >
//                     Download
//                   </a>
//                 ) : (
//                   'Tidak ada file'
//                 )}
//               </td>

//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CaseTable;
