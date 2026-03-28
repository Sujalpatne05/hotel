import React, { useEffect, useMemo, useState } from "react";
import { FaUtensils, FaCheckCircle, FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { apiRequest } from "@/lib/api";

type Recipe = {
  id: number;
  name: string;
  category: string;
  prep_time: number;
  stock: "Available" | "Unavailable";
  image: string;
  ingredients: string;
};

const categories = ["Starter", "Main Course", "Dessert", "Breakfast", "Beverage"];
const fallbackImage = "https://via.placeholder.com/400x200?text=No+Image";

export default function RecipeManagement() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", category: "", ingredients: "", prepTime: "", image: "" });
  const [viewRecipe, setViewRecipe] = useState<Recipe | null>(null);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [deleteRecipe, setDeleteRecipe] = useState<Recipe | null>(null);

  const loadRecipes = async () => {
    const data = await apiRequest<Recipe[]>("/recipes");
    setRecipes(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadRecipes();
      } catch (error) {
        // Recipe load error
      } finally {
        setLoading(false);
      }
    };
    void bootstrap();
  }, []);

  const filteredRecipes = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return recipes;
    return recipes.filter((recipe) => recipe.name.toLowerCase().includes(query));
  }, [recipes, search]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiRequest("/recipes", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          prepTime: Number(form.prepTime),
          ingredients: form.ingredients.trim(),
          image: form.image.trim(),
          stock: "Available",
        }),
      });
      setForm({ name: "", category: "", ingredients: "", prepTime: "", image: "" });
      setShowModal(false);
      await loadRecipes();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to create recipe");
    }
  };

  const openEdit = (recipe: Recipe) => {
    setEditRecipe(recipe);
    setForm({
      name: recipe.name,
      category: recipe.category,
      ingredients: recipe.ingredients || "",
      prepTime: String(recipe.prep_time),
      image: recipe.image || "",
    });
  };

  const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editRecipe) return;
    try {
      await apiRequest(`/recipes/${editRecipe.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          prepTime: Number(form.prepTime),
          ingredients: form.ingredients.trim(),
          image: form.image.trim(),
        }),
      });
      setEditRecipe(null);
      await loadRecipes();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to edit recipe");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRecipe) return;
    try {
      await apiRequest(`/recipes/${deleteRecipe.id}`, { method: "DELETE" });
      setDeleteRecipe(null);
      await loadRecipes();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to delete recipe");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaUtensils className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Recipe Management</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-700 transition" onClick={() => setShowModal(true)}>
            + Add New Recipe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && filteredRecipes.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 text-sm text-gray-600">No recipes found for this restaurant.</div>
        )}
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col">
            <img
              src={recipe.image || fallbackImage}
              alt={recipe.name}
              className="rounded-lg mb-3 h-40 object-cover w-full"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{recipe.name}</h3>
            <p className="text-sm text-gray-500 mb-1">Category: <span className="font-medium text-gray-700">{recipe.category}</span></p>
            <p className="text-sm text-gray-500 mb-1">Prep Time: <span className="font-medium text-gray-700">{recipe.prep_time} mins</span></p>
            <p className="text-sm text-green-600 flex items-center mb-2">Stock: {recipe.stock} <FaCheckCircle className="ml-1 h-4 w-4" /></p>
            <div className="flex gap-3 mt-auto">
              <button className="text-blue-600 flex items-center gap-1 hover:underline" onClick={() => setViewRecipe(recipe)}>
                <FaEye /> View
              </button>
              <button className="text-gray-600 flex items-center gap-1 hover:underline" onClick={() => openEdit(recipe)}>
                <FaEdit /> Edit
              </button>
              <button className="text-red-600 flex items-center gap-1 hover:underline" onClick={() => setDeleteRecipe(recipe)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" onClick={() => setShowModal(false)} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4">Add New Recipe</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input type="text" name="name" placeholder="Recipe Name" className="border rounded-lg px-3 py-2" value={form.name} onChange={handleInput} required />
              <select name="category" className="border rounded-lg px-3 py-2" value={form.category} onChange={handleInput} required>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <textarea name="ingredients" placeholder="Enter ingredients..." className="border rounded-lg px-3 py-2" value={form.ingredients} onChange={handleInput} />
              <input type="number" name="prepTime" placeholder="Preparation Time" className="border rounded-lg px-3 py-2" value={form.prepTime} onChange={handleInput} min={1} required />
              <input type="text" name="image" placeholder="Image URL (optional)" className="border rounded-lg px-3 py-2" value={form.image} onChange={handleInput} />
              <div className="flex gap-3 mt-4">
                <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-700 transition">Save Recipe</button>
                <button type="button" className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium shadow hover:bg-gray-300 transition" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewRecipe && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" onClick={() => setViewRecipe(null)} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4">{viewRecipe.name}</h2>
            <img src={viewRecipe.image || fallbackImage} alt={viewRecipe.name} className="rounded-lg mb-3 h-40 object-cover w-full" />
            <p className="mb-1"><strong>Category:</strong> {viewRecipe.category}</p>
            <p className="mb-1"><strong>Prep Time:</strong> {viewRecipe.prep_time} mins</p>
            <p className="mb-1"><strong>Stock:</strong> {viewRecipe.stock}</p>
            <p className="mb-1"><strong>Ingredients:</strong> {viewRecipe.ingredients || "N/A"}</p>
          </div>
        </div>
      )}

      {editRecipe && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" onClick={() => setEditRecipe(null)} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Recipe</h2>
            <form onSubmit={handleEditSave} className="flex flex-col gap-3">
              <input type="text" name="name" placeholder="Recipe Name" className="border rounded-lg px-3 py-2" value={form.name} onChange={handleInput} required />
              <select name="category" className="border rounded-lg px-3 py-2" value={form.category} onChange={handleInput} required>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <textarea name="ingredients" placeholder="Enter ingredients..." className="border rounded-lg px-3 py-2" value={form.ingredients} onChange={handleInput} />
              <input type="number" name="prepTime" placeholder="Preparation Time" className="border rounded-lg px-3 py-2" value={form.prepTime} onChange={handleInput} min={1} required />
              <input type="text" name="image" placeholder="Image URL (optional)" className="border rounded-lg px-3 py-2" value={form.image} onChange={handleInput} />
              <div className="flex gap-3 mt-4">
                <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-700 transition">Save Changes</button>
                <button type="button" className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium shadow hover:bg-gray-300 transition" onClick={() => setEditRecipe(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteRecipe && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" onClick={() => setDeleteRecipe(null)} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4">Delete Recipe</h2>
            <p>Are you sure you want to delete <strong>{deleteRecipe.name}</strong>?</p>
            <div className="flex gap-3 mt-4">
              <button className="bg-red-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-red-700 transition" onClick={() => void handleDeleteConfirm()}>Yes, Delete</button>
              <button className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium shadow hover:bg-gray-300 transition" onClick={() => setDeleteRecipe(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
