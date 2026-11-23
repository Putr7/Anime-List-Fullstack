import { useState, useEffect } from 'react';
import Header from './components/Header';
import AnimeSummary from './components/AnimeSummary';
import AnimeForm from './components/AnimeForm';
import AnimeList from './components/AnimeList';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/anime';

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [editingAnime, setEditingAnime] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  // 1. GET: Ambil seluruh data anime dari backend NestJS
  useEffect(() => {
    let active = true;

    fetch(API_BASE_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (active) {
          setAnimeList(data);
          setApiError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setApiError(
            `Koneksi backend gagal: ${err.message}. Pastikan backend NestJS berjalan di port 3000.`
          );
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [reloadCount]);

  const handleRetry = () => {
    setLoading(true);
    setReloadCount((c) => c + 1);
  };

  // 2. POST: Tambah anime baru ke backend NestJS
  const handleAddAnime = async (newAnimePayload) => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAnimePayload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || 'Gagal menambahkan anime.';
      throw new Error(errorMessage);
    }

    setAnimeList((prevList) => [data, ...prevList]);
  };

  // 3. PATCH: Ubah data anime di backend NestJS
  const handleUpdateAnime = async (id, updatePayload) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || 'Gagal memperbarui anime.';
      throw new Error(errorMessage);
    }

    setAnimeList((prevList) =>
      prevList.map((item) => (item.id === id ? data : item))
    );
    setEditingAnime(null);
  };

  // 4. DELETE: Hapus anime dari backend NestJS
  const handleDeleteAnime = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal menghapus anime.');
      }

      setAnimeList((prevList) => prevList.filter((anime) => anime.id !== id));
      if (editingAnime?.id === id) {
        setEditingAnime(null);
      }
    } catch (err) {
      alert(`Error saat menghapus: ${err.message}`);
    }
  };

  // 5. RESET: Pulihkan data sampel awal
  const handleResetData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Gagal mereset data.');
      }
      const data = await response.json();
      setAnimeList(data);
      setEditingAnime(null);
    } catch (err) {
      alert(`Error saat memulihkan data: ${err.message}`);
    }
  };

  const handleStartEdit = (anime) => {
    setEditingAnime(anime);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingAnime(null);
  };

  return (
    <div className="app-container">
      <Header />

      {apiError && (
        <div className="api-error-banner">
          {apiError}
          <button
            type="button"
            className="btn-secondary"
            style={{ marginLeft: '12px' }}
            onClick={handleRetry}
          >
            Coba Lagi
          </button>
        </div>
      )}

      <AnimeSummary animeList={animeList} />

      <AnimeForm
        key={editingAnime ? `edit-${editingAnime.id}` : 'new'}
        onAddAnime={handleAddAnime}
        editingAnime={editingAnime}
        onUpdateAnime={handleUpdateAnime}
        onCancelEdit={handleCancelEdit}
      />

      {loading ? (
        <div className="empty-state-box">
          <p>Sedang memuat katalog anime dari backend...</p>
        </div>
      ) : (
        <AnimeList
          animeList={animeList}
          onDelete={handleDeleteAnime}
          onEdit={handleStartEdit}
          onReset={handleResetData}
        />
      )}
    </div>
  );
}

export default App;
