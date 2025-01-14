import {computed} from 'vue'

import NotFoundView from '@/views/NotFoundView.vue'

import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'

import DashboardView from '@/views/user/DashboardView.vue'
import UsersView from '@/views/admin/UsersView.vue'

import useUserService from '@/services/userService'
import useUserStore from '@/stores/userStore'
import {createWebHistory, createRouter, createWebHashHistory} from 'vue-router'

const userService = useUserService()
const { isAuthenticated } = useUserStore()

const routes = [
    {
        name: 'home',
        path: '/',
        component: HomeView,
        meta: {
            label: 'Login',
            requiresAuth: false
        },
    },
    {
        name: 'register',
        path: '/register',
        component: RegisterView,
        meta: {
            label: 'Register',
            requiresAuth: false
        },
    },
    {
        name: 'dashboard',
        path: '/user/dashboard',
        component: DashboardView,
        meta: {
            label: 'Dashboard',
            requiresAuth: true
        },
    },
    {
        name: 'admin.users',
        path: '/admin/users',
        component: UsersView,
        meta: {
            label: 'Users',
            requiresAuth: true
        },
    },
    {
        name: 'logout',
        path: '/user/logout',
        component: {
            async beforeRouteEnter(to, from, next) {
                await userService.logout()
                next({ name: 'home' })
            }
        },
        meta: {
            label: 'Logout',
            requiresAuth: true
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: NotFoundView
    },
]

const getRoutes = computed(() => {
    return routes.filter(route => {
        return route.meta?.requiresAuth === isAuthenticated() && route.meta.label !== undefined
    })
})

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.name === undefined) {
        next({ name: 'notFound' })
    } else if(to.name !== 'login' && !to.meta.requiresAuth && isAuthenticated()) {
        next({ name: 'dashboard', replace: true })
    } else if(to.name !== 'login' && to.meta.requiresAuth && !isAuthenticated()) {
        next({ name: 'home', replace: true })
    } else {
        next()
    }
})

export { router, getRoutes }