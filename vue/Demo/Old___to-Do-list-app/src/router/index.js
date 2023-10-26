import { createRouter, createWebHashHistory } from "vue-router";
import Style from "@/views/StyleView.vue";
import Home from "@/views/HomeView.vue";

const routes = [
  {
    meta: {
      title: "To do List",
    },
    path: "/",
    name: "Dashboard",
    component: () => import("@/views/TodoListView.vue"),
  },
  {
    meta: {
      title: "To do List",
    },
    path: "/to-do-list",
    name: "todo",
    component: () => import("@/views/TodoListView.vue"),
  },
  {
    meta: {
      title: "Add To Do",
    },
    path: "/add-edit-todo",
    name: "Add todo",
    component: () => import("@/views/AddTodoView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
