import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/accounts/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data profil");
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data profil.");
      })
      .finally(() => setLoading(false));
  }, [navigate, token]);

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus akun ini?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/accounts/${userData._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Akun berhasil dihapus!");
        localStorage.removeItem("token");
        navigate("/register");
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menghapus akun.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus akun.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <p className="text-gray-600">Memuat data profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <p className="text-red-500 font-semibold">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
          >
            Login Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Profil Pengguna</h2>

        <div className="space-y-4 text-gray-700">
          <p><span className="font-semibold">Nama:</span> {userData.name || "-"}</p>
          <p><span className="font-semibold">Email:</span> {userData.email || "-"}</p>
          <p><span className="font-semibold">No. Telepon:</span> {userData.phoneNumber || "-"}</p>
          <p><span className="font-semibold">Alamat:</span> {userData.address || "-"}</p>
          <p><span className="font-semibold">Nomor Identitas:</span> {userData.identityNumber || "-"}</p>
        </div>

        <button
          onClick={handleDelete}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
        >
          🗑️ Hapus Akun Ini
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
        >
          ⬅️ Balik ke Dashboard
        </button>
      </div>
    </div>
  );
}
