import Vue from "vue";
import store from "./store";
// import {isMobile} from "mobile-device-detect";
import Router from "vue-router";
import NProgress from "nprogress";
// import authenticate from "./auth/authenticate";

Vue.use(Router);

// create new router

const routes = [
  {
    path: "/app/pages",
    component: () => import("./views/app"), //webpackChunkName app
    // beforeEnter: authenticate,
    redirect: "/app/pages/blank",
    name: 'dashboard',
    meta: {
      requiresAuth: true
    },

    children: [

      // pages
      {
        path: "/app/pages",
        component: () => import("./views/app/pages"),
        redirect: "/app/pages/profile",
        children: [
          {
            path: "profile",
            component: () => import("./views/app/pages/profile")
          },
          {
            path: "error",
            component: () => import("./views/app/pages/notFound")
          },
          {
            path: "icons",
            component: () => import("./views/app/pages/icons")
          },
          {
            path: "search-result",
            component: () => import("./views/app/pages/search-result")
          },
          {
            path: "pricing-table",
            component: () => import("./views/app/pages/pricingTable")
          },
          {
            path: "faq",
            component: () => import("./views/app/pages/faq")
          },
          {
            path: "blank",
            component: () => import("./views/app/pages/blank")
          },

        ]
      },


      // Users
      {
        path: "/app/users",
        component: () => import("./views/app/users"),
        redirect: "/app/users/userslist",
        children: [
          {
            path: "userslist",
            component: () => import("./views/app/users/userslist"),
            name: 'userslist',
            meta: {
              requiresAuth: true
            },
          },
          {
            path: "usersdetail/:id",
            component: () => import("./views/app/users/usersdetail"),
            name: 'usersdetail',
            meta: {
              requiresAuth: true
            },
          }
        ]
      },


      // Companies
      {
        path: "/app/companies",
        component: () => import("./views/app/companies"),
        redirect: "/app/companies/companieslist",
        children: [
          {
            path: "companieslist",
            component: () => import("./views/app/companies/companieslist"),
            name: 'companieslist',
            meta: {
              requiresAuth: true
            },
          },
          {
            path: "companiesdetail/:id",
            component: () => import("./views/app/companies/companiesdetail"),
            name: 'companiesdetail',
            meta: {
              requiresAuth: true
            },
          }
        ]
      },


      // Horses
      {
        path: "/app/horses",
        component: () => import("./views/app/horses"),
        redirect: "/app/horses/horseslist",
        children: [
          {
            path: "horseslist",
            component: () => import("./views/app/horses/horseslist"),
            name: 'horseslist',
            meta: {
              requiresAuth: true
            },
          },
          {
            path: "horsesdetail/:id",
            component: () => import("./views/app/horses/horsesdetail"),
            name: 'horsesdetail',
            meta: {
              requiresAuth: true
            },
          }
        ]
      },


      // Products
      {
        path: "/app/products",
        component: () => import("./views/app/products"),
        redirect: "/app/products/productlist",
        children: [
          {
            path: "productslist",
            component: () => import("./views/app/products/productslist"),
            name: 'productslist',
            meta: {
              requiresAuth: true
            },
          },
          {
            path: "productdetail/:id",
            component: () => import("./views/app/products/productdetail"),
            name: 'productdetail',
            meta: {
              requiresAuth: true
            },
          }
        ]
      },



      // Horses Feeds
      {
        path: "/app/horsesfeeds",
        component: () => import("./views/app/horsesfeeds"),
        redirect: "/app/horsesfeeds/horsesfeedslist",
        children: [
          {
            path: "horsesfeedslist",
            component: () => import("./views/app/horsesfeeds/horsesfeedslist"),
            name: 'horsesfeedslist',
            meta: {
              requiresAuth: true
            },
          },
          {
            path: "horsesfeedsdetail/:id",
            component: () => import("./views/app/horsesfeeds/horsesfeedsdetail"),
            name: 'horsesfeedsdetail',
            meta: {
              requiresAuth: true
            },
          }
        ]
      },


      // Stables
      {
        path: "/app/stables",
        component: () => import("./views/app/stables"),
        redirect: "/app/stables/stableslist",
        children: [
          {
            path: "stableslist",
            component: () => import("./views/app/stables/stableslist"),
            name: 'stableslist',
            meta: {
              requiresAuth: true
            },
          },
          {
            path: "stablesdetail/:id",
            component: () => import("./views/app/stables/stablesdetail"),
            name: 'stablesdetail',
            meta: {
              requiresAuth: true
            },
          }
        ]
      },



    ]
  },

  // sessions
  {
    path: "/app/sessions",
    component: () => import("./views/app/sessions"),
    redirect: "/app/sessions/signIn",
    children: [
      {
        path: "signIn",
        component: () => import("./views/app/sessions/signIn"),
        name: 'signIn',
        meta: {
          guest: true
        }
      },
      {
        path: "signUp",
        component: () => import("./views/app/sessions/signUp"),
        name: 'signUp',
        meta: {
          guest: true
        }
      },
      {
        path: "forgot",
        component: () => import("./views/app/sessions/forgot"),
        name: 'forgot',
        meta: {
          guest: true
        }
      }
    ]
  },

  {
    path: "/",
    component: () => import("./views/app/sessions"),
    redirect: "/app/sessions/signIn",
    meta: {
      guest: true
    }
  },

  {
    path: "*",
    component: () => import("./views/app/pages/notFound"),
    meta: {
      guest: true
    }
  }
];

const router = new Router({
  mode: "history",
  linkActiveClass: "open",
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  debugger;
  // // If this isn't an initial page load.
  // if (to.path) {
  //   // Start the route progress bar.
  //   NProgress.start();
  //   NProgress.set(0.1);
  // }
  // next();


  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') == null) {
      next({
        path: '/app/sessions/signIn',
        params: { nextUrl: to.fullPath }
      })
    } else {
      // let user = JSON.parse(localStorage.getItem('userInfo'))
      // if (to.matched.some(record => record.meta.is_admin)) {
      //   if (user.is_admin == 1) {
      //     next()
      //   }
      //   else {
      //     next({ name: 'userboard' })
      //   }
      // } else {
      //   next()
      // }

      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token') == null) {
      next()
    }
    else {
      // next({ name: 'dashboard' })
      localStorage.clear();
      next()
    }
  } else {
    next()
  }
});

router.afterEach(() => {
  // Remove initial loading
  const gullPreLoading = document.getElementById("loading_wrap");
  if (gullPreLoading) {
    gullPreLoading.style.display = "none";
  }
  // Complete the animation of the route progress bar.
  setTimeout(() => NProgress.done(), 500);
  // NProgress.done();
  // if (isMobile) {
  if (window.innerWidth <= 1200) {
    // console.log("mobile");
    store.dispatch("changeSidebarProperties");
    if (store.getters.getSideBarToggleProperties.isSecondarySideNavOpen) {
      store.dispatch("changeSecondarySidebarProperties");
    }

    if (store.getters.getCompactSideBarToggleProperties.isSideNavOpen) {
      store.dispatch("changeCompactSidebarProperties");
    }
  } else {
    if (store.getters.getSideBarToggleProperties.isSecondarySideNavOpen) {
      store.dispatch("changeSecondarySidebarProperties");
    }

    // store.state.sidebarToggleProperties.isSecondarySideNavOpen = false;
  }
});

export default router;
