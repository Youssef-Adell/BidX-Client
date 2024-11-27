import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useAuthStore } from "@/stores/AuthStore";

const routes = [
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
  {
    path: "/auctions/create",
    component: () => import("../views/CreateAuctionView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/auctions/:id",
    component: () => import("../views/AuctionView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // Wait until authStore becomes ready if it is not (to avoid misidentifying user state by the checks below)
  await authStore.waitUntilReady();

  // Prevent unauthenticated users from navigating to views that require auth
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { path: "/login" };
  }

  // Prevent authenticated users from navigating to login, register, and forgot-password views
  if (to.meta.requiresUnAuth && authStore.isLoggedIn) {
    return { path: "/" };
  }

  // Add query param to redirect back to after login
  if (to.path === "/login" && !to.query.redirect) {
    return { path: "/login", query: { redirect: from.path } }; // If there is no previous page, from.path defaults to "/"
  }

  // Navigate normally
  return true;
});

export default router;
