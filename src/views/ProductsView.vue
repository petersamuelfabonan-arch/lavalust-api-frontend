<template>
  <div class="wrap">
    <div class="top">
      <h1>Products</h1>
      <div>
        <button class="btn" @click="showCreateForm = true">+ Add Product</button>
        <button class="btn-logout" @click="handleLogout">Log out</button>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.product_name }}</td>
          <td>{{ product.description }}</td>
          <td>₱{{ Number(product.price).toFixed(2) }}</td>
          <td>{{ product.quantity }}</td>
          <td class="actions">
            <button class="btn-small btn-edit" @click="startEdit(product)">Edit</button>
            <button class="btn-small btn-delete" @click="confirmDelete(product.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateForm || editingProduct" class="modal-overlay" @click.self="closeForm">
      <div class="modal">
        <h2>{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h2>
        <form @submit.prevent="handleSubmit">
          <label>Product Name</label>
          <input v-model="form.product_name" type="text" required />
          <label>Description</label>
          <textarea v-model="form.description" rows="3"></textarea>
          <label>Price</label>
          <input v-model="form.price" type="number" step="0.01" required />
          <label>Quantity</label>
          <input v-model="form.quantity" type="number" required />
          <div class="form-actions">
            <button type="submit">{{ editingProduct ? 'Update' : 'Save' }} Product</button>
            <button type="button" class="cancel" @click="closeForm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getProducts, createProduct, updateProduct, deleteProduct, logout } from '../api';

const products = ref([]);
const error = ref('');
const showCreateForm = ref(false);
const editingProduct = ref(null);
const router = useRouter();

const form = reactive({
  product_name: '',
  description: '',
  price: '',
  quantity: '',
});

async function loadProducts() {
  try {
    const data = await getProducts();
    products.value = data.data;
  } catch (err) {
    error.value = err.message;
  }
}

function startEdit(product) {
  editingProduct.value = product;
  form.product_name = product.product_name;
  form.description = product.description;
  form.price = product.price;
  form.quantity = product.quantity;
}

function closeForm() {
  showCreateForm.value = false;
  editingProduct.value = null;
  form.product_name = '';
  form.description = '';
  form.price = '';
  form.quantity = '';
}

async function handleSubmit() {
  try {
    if (editingProduct.value) {
      await updateProduct(editingProduct.value.id, form);
    } else {
      await createProduct(form);
    }
    closeForm();
    await loadProducts();
  } catch (err) {
    error.value = err.message;
  }
}

async function confirmDelete(id) {
  if (!confirm('Delete this product?')) return;
  try {
    await deleteProduct(id);
    await loadProducts();
  } catch (err) {
    error.value = err.message;
  }
}

function handleLogout() {
  logout();
  router.push('/login');
}

onMounted(loadProducts);
</script>

<style scoped>
.wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 24px;
  font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
}
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
h1 { font-size: 26px; margin: 0; }
.btn {
  padding: 10px 18px;
  background: #1c1c1c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;
}
.btn-logout {
  padding: 10px 18px;
  background: #fff;
  color: #444;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.btn-small { padding: 6px 12px; font-size: 13px; border-radius: 5px; border: none; color: #fff; cursor: pointer; margin-right: 6px; }
.btn-edit { background: #2563eb; }
.btn-delete { background: #dc2626; }
table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; }
th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; }
th { background: #f5f5f5; font-weight: 600; color: #444; }
tr:last-child td { border-bottom: none; }
.error { background: #fee; color: #c00; padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; }

.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: #fff; border-radius: 10px; padding: 32px; width: 400px;
}
.modal h2 { margin: 0 0 20px; font-size: 20px; }
.modal label { display: block; font-size: 13px; color: #666; margin-bottom: 6px; }
.modal input, .modal textarea {
  width: 100%; padding: 10px 12px; margin-bottom: 16px;
  border: 1px solid #ddd; border-radius: 6px; font-size: 14px;
  box-sizing: border-box; font-family: inherit;
}
.form-actions button {
  padding: 10px 20px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;
}
.form-actions button[type="submit"] { background: #1c1c1c; color: #fff; margin-right: 10px; }
.form-actions .cancel { background: #fff; border: 1px solid #ddd; color: #444; }
</style>