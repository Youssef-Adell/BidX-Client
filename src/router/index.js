import { useAuthStore } from "@/stores/AuthStore";
import HomeView from "@/views/HomeView.vue";

import { createRouter, createWebHistory, useRoute } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView,
    },
    {
      path: "/login",
      component: () => import("../views/LoginView.vue"),
      meta: { requiresUnAuth: true },
    },
    {
      path: "/register",
      component: () => import("../views/RegisterView.vue"),
      meta: { requiresUnAuth: true },
    },
    {
      path: "/forgot-password",
      component: () => import("../views/ForgotPasswordView.vue"),
      meta: { requiresUnAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const isLoggedIn = useAuthStore().isLoggedIn;

  // Prevent unauthenticated users from navigating to views that requires auth
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { path: "/login" };
  }
  // Prevent authenticated users from navigating to login, register and forgot-password views
  else if (to.meta.requiresUnAuth && isLoggedIn) {
    return { path: "/" };
  }
  // Navigate normally
  else {
    return true;
  }
});

export default router;
