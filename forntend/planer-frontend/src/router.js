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
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/income',
    name: 'Income',
    component: IncomeListView
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoriesView
  },
  {
    path: '/budget',
    name: 'Budget',
    component: BudgetView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
