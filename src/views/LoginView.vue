<template>
  <div class="login-page">
    <div class="card">
      <h1>Product Manager Login</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <label>Username</label>
        <input v-model="username" type="text" required />
        <label>Password</label>
        <input v-model="password" type="password" required />
        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await login(username.value, password.value);
    router.push('/products');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  background: #fafafa;
}
.card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 40px;
  width: 320px;
}
h1 { font-size: 22px; margin: 0 0 24px; }
label { display: block; font-size: 13px; color: #666; margin-bottom: 6px; }
input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 12px;
  background: #1c1c1c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error {
  background: #fee;
  color: #c00;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
}
</style>