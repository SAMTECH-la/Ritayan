import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Plus, Edit2, Trash2, Image as ImageIcon, 
  X, Check, AlertCircle, Save, Sword, Zap, Shield, RefreshCw 
} from 'lucide-react';
import { getAdminCharacters, createCharacter, updateCharacter, deleteCharacter } from '../services/api';

const BACKEND_URL = 'http://127.0.0.1:8000';

const CATEGORY_OPTIONS = [
  { value: 'FISH', label: 'Fish (Matsya / Water Bubbles)' },
  { value: 'SERPENT', label: 'Serpent (Vasuki / Naga Coils)' },
  { value: 'LION', label: 'Lion (Narasimha / Fiery Claws)' },
  { value: 'BOAR', label: 'Boar (Varaha / Bedrock Tremors)' },
  { value: 'TORTOISE', label: 'Tortoise (Kurma / Carapace Shield)' },
  { value: 'ROYAL_DEVOTEE', label: 'Royal Devotee (King Parikshit / Temple Lotus)' },
];

const CharacterManagerPage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    avatar_type: 'Dashavatara',
    character_category: 'FISH',
    yuga: 'Satya Yuga',
    theme_color: '#0284C7',
    bg_gradient: 'linear-gradient(135deg, #020617 0%, #0369A1 50%, #0284C7 100%)',
    weapon_symbol: '',
    power_level: 95,
    description: '',
    lore_details: '',
    associated_slug: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const res = await getAdminCharacters();
      if (res.characters) {
        setCharacters(res.characters);
      }
    } catch (err) {
      setError('Failed to fetch characters from server.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCharacter(null);
    setFormData({
      name: '',
      title: '',
      avatar_type: 'Dashavatara',
      character_category: 'FISH',
      yuga: 'Satya Yuga',
      theme_color: '#0284C7',
      bg_gradient: 'linear-gradient(135deg, #020617 0%, #0369A1 50%, #0284C7 100%)',
      weapon_symbol: '',
      power_level: 95,
      description: '',
      lore_details: '',
      associated_slug: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ch) => {
    setEditingCharacter(ch);
    setFormData({
      name: ch.name || '',
      title: ch.title || '',
      avatar_type: ch.avatar_type || 'Dashavatara',
      character_category: ch.character_category || 'FISH',
      yuga: ch.yuga || 'Satya Yuga',
      theme_color: ch.theme_color || '#F59E0B',
      bg_gradient: ch.bg_gradient || 'linear-gradient(135deg, #020617 0%, #1E3A8A 50%, #0284C7 100%)',
      weapon_symbol: ch.weapon_symbol || '',
      power_level: ch.power_level || 95,
      description: ch.description || '',
      lore_details: ch.lore_details || '',
      associated_slug: ch.associated_slug || '',
    });
    setImageFile(null);
    setImagePreview(ch.avatar_image ? `${BACKEND_URL}/uploads/${ch.avatar_image}` : null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Character Name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });

    if (imageFile) {
      payload.append('avatar_image', imageFile);
    }

    try {
      if (editingCharacter) {
        await updateCharacter(editingCharacter.id, payload);
        setSuccessMsg(`Character "${formData.name}" updated successfully!`);
      } else {
        await createCharacter(payload);
        setSuccessMsg(`Character "${formData.name}" created successfully!`);
      }
      setIsModalOpen(false);
      fetchCharacters();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save character.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ch) => {
    if (!window.confirm(`Are you sure you want to delete "${ch.name}"?`)) return;

    try {
      await deleteCharacter(ch.id);
      setSuccessMsg(`Character "${ch.name}" deleted.`);
      fetchCharacters();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError('Failed to delete character.');
    }
  };

  return (
    <div className="space-y-8 p-6 sm:p-8 max-w-7xl mx-auto">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>MYTHIC AVATARS CONTROL CENTER</span>
          </div>
          <h1 className="text-3xl font-black font-serif text-white">
            Character Codex Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Add, edit, upload HD artwork images, and configure elemental sound/animation categories for public website characters.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW CHARACTER</span>
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. CHARACTERS GRID TABLE */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading character database...
        </div>
      ) : characters.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
          <p className="font-bold">No characters found in database.</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add New Character" above to create your first avatar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((ch) => {
            const imageUrl = ch.avatar_url || (ch.avatar_image ? (ch.avatar_image.startsWith('http') ? ch.avatar_image : `${BACKEND_URL}/uploads/${ch.avatar_image}`) : null);
            return (
              <div 
                key={ch.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition shadow-xl flex flex-col justify-between"
              >
                {/* Image Banner */}
                <div className="h-48 relative overflow-hidden bg-slate-950">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={ch.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-3xl font-black text-amber-500/40" style={{ background: ch.bg_gradient }}>
                      {ch.name[0]}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40"></div>

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-amber-400/30 text-amber-400 font-bold text-[10px] uppercase backdrop-blur">
                      {ch.avatar_type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur">
                      {ch.yuga}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-black font-serif text-white">{ch.name}</h3>
                    <p className="text-[11px] font-bold text-amber-400 uppercase">{ch.title}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">CATEGORY:</span>
                      <span className="text-slate-200 font-bold">{ch.character_category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">POWER LEVEL:</span>
                      <span className="text-amber-400 font-bold">{ch.power_level} / 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">SYMBOL:</span>
                      <span className="text-slate-300 font-medium truncate max-w-[150px]">{ch.weapon_symbol}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(ch)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(ch)}
                      className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-white">
                  {editingCharacter ? `Edit Character: ${editingCharacter.name}` : 'Create New Mythic Character'}
                </h3>
                <p className="text-xs text-slate-400">Fill in details and upload custom HD artwork.</p>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Character Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. MATSYA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Title / Epithet</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. The Primordial Savior"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Category & Yuga */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">FX Category (Canvas & Sound)</label>
                  <select 
                    value={formData.character_category}
                    onChange={(e) => setFormData({ ...formData, character_category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Yuga / Epoch</label>
                  <input 
                    type="text"
                    value={formData.yuga}
                    onChange={(e) => setFormData({ ...formData, yuga: e.target.value })}
                    placeholder="e.g. Satya Yuga"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 3: Avatar Type & Power Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Avatar Type Badge</label>
                  <input 
                    type="text"
                    value={formData.avatar_type}
                    onChange={(e) => setFormData({ ...formData, avatar_type: e.target.value })}
                    placeholder="e.g. Dashavatara #1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Power Level ({formData.power_level} / 100)</label>
                  <input 
                    type="range"
                    min="50"
                    max="100"
                    value={formData.power_level}
                    onChange={(e) => setFormData({ ...formData, power_level: e.target.value })}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-2"
                  />
                </div>
              </div>

              {/* Row 4: Weapon Symbol & Associated Comic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Weapon & Divine Symbol</label>
                  <input 
                    type="text"
                    value={formData.weapon_symbol}
                    onChange={(e) => setFormData({ ...formData, weapon_symbol: e.target.value })}
                    placeholder="e.g. Golden Horn & Sacred Vedas"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Featured Comic Slug</label>
                  <input 
                    type="text"
                    value={formData.associated_slug}
                    onChange={(e) => setFormData({ ...formData, associated_slug: e.target.value })}
                    placeholder="e.g. ritayan-001"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Artwork Image File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">HD Artwork Image Upload</label>
                <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-amber-500/40" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">PNG, JPG, WEBP recommended.</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Overview Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short summary of the character..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              {/* Lore Details */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Puranic Lore & Chronicle</label>
                <textarea
                  rows="3"
                  value={formData.lore_details}
                  onChange={(e) => setFormData({ ...formData, lore_details: e.target.value })}
                  placeholder="Detailed mythological story..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingCharacter ? 'Update Character' : 'Save Character'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CharacterManagerPage;
