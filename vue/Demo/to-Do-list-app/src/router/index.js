import { createRouter, createWebHashHistory } from "vue-router";

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
    path: "/add-todo",
    name: "Add todo",
    component: () => import("@/views/AddTodoView.vue"),
  },
  {
    meta: {
      title: "Edit To Do List",
    },
    path: "/edit-todo/:id",
    name: "Edit todo",
    component: () => import("@/views/AddTodoView.vue"),
  },
  // {
  //   meta: {
  //     title: "Add To Do List",
  //   },
  //   path: "/add-todo/:id",
  //   name: "Add todo",
  //   component: () => import("@/views/AddTodoView.vue"),
  // },
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
