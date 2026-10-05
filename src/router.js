import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import ProductsView from './views/ProductsView.vue';
import { isLoggedIn } from './api';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/products', component: ProductsView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

export default router;