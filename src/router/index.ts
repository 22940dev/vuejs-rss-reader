import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import ViewFeed from "@/views/ViewFeed.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/settings'
    },
    {
        path: '/feed/:feedId',
        name: 'ViewFeed',
        component: ViewFeed
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
