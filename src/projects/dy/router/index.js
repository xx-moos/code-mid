import { createRouter, createWebHashHistory } from "vue-router";
const router = createRouter({
    history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
    routes: [
        {
            path: "/",
            name: "order",
            component: () => import("@projects/dy/views/order/index.vue"),
            meta: { title: "我的订单" },
        },
    ],
});

router.afterEach((to, from, next) => {
    //遍历meta改变title
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    window.scrollTo(0, 0);
});
export default router;
