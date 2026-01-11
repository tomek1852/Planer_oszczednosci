import { createRouter, createWebHistory } from 'vue-router'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import IncomeListView from './views/IncomeListView.vue'
import CategoriesView from './views/CategoriesView.vue'
import BudgetView from './views/BudgetView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/income',
    name: 'Income',
    component: IncomeListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoriesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/budget',
    name: 'Budget',
    component: BudgetView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard – sprawdzenie czy użytkownik jest zalogowany
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('planer_userId')

  // Jeśli trasa wymaga autentykacji a użytkownik nie jest zalogowany
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  }
  // Jeśli użytkownik jest zalogowany i próbuje wejść na login/register
  else if (!to.meta.requiresAuth && isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    next('/income')
  }
  else {
    next()
  }
})

export default router
