import NotFoundView from '@/views/NotFoundView.vue'

import HomeView from '@/views/HomeView.vue'

import DashboardView from '@/views/user/DashboardView.vue'
import UsersView from '@/views/admin/UsersView.vue'
import StatsView from '@/views/admin/StatsView.vue'
import AbsenceView from "@/views/admin/AbsenceView.vue"

import useUserStore from '@/stores/userStore'
import {createRouter, createWebHashHistory} from 'vue-router'

const { getUser, isAuthenticated } = useUserStore()

const routes = [
    {
        name: 'home',
        path: '/',
        component: HomeView,
        meta: {
            requiresAuth: false,
            roles: ['guest']
        },
    },
    {
        name: 'user.dashboard',
        path: '/user/dashboard',
        component: DashboardView,
        meta: {
            label: 'Dashboard',
            requiresAuth: true,
            roles: ['user']
        },
    },
    {
        name: 'admin.users',
        path: '/admin/users',
        component: UsersView,
        meta: {
            label: 'Benutzer',
            requiresAuth: true,
            roles: ['admin']
        },
    },
    {
        name: 'admin.stats',
        path: '/admin/statistics',
        component: StatsView,
        meta: {
            label: 'Statistiken',
            requiresAuth: true,
            roles: ['admin']
        },
    },
    {
        name: 'admin.absence',
        path: '/admin/absence',
        component: AbsenceView,
        meta: {
            label: 'Abwesenheiten',
            requiresAuth: true,
            roles: ['admin']
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: NotFoundView
    },
]

const getRoutes = () => {
    const userRole = getUser().role
    return routes.filter(route => {
        if (route.meta === undefined) {
            return false
        }

        return route.meta.label !== undefined && route.meta.roles.indexOf(userRole) > -1
    })
}

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.name === undefined) {
        next({ name: 'notFound' })
    } else if(to.name !== 'login' && !to.meta.requiresAuth && isAuthenticated.value) {
        next({ name: getUser().startRoute, replace: true })
    } else if(to.name !== 'login' && to.meta.requiresAuth && !isAuthenticated.value) {
        next({ name: 'home', replace: true })
    } else {
        next()
    }
})

export { router, getRoutes }