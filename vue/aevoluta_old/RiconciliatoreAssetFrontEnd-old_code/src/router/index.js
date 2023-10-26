import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../components/LoginView.vue'
import MatchAssociatedView from '../views/MatchAssociatedView.vue'
import MatchAssociatedView1 from '../views/MatchAssociatedView1.vue'
import MatchAssociatedView2 from '../views/MatchAssociatedView2.vue'
import ManualMatchView from '../views/ManualMatch/ManualMatchView.vue'
import ManualMatchView1 from '../views/ManualMatch/ManualMatchView1.vue'
import ClosedMatch from '../views/ClosedMatch/ClosedMatch.vue'
import ClosedMatch1 from '../views/ClosedMatch/ClosedMatch1.vue'
import UnmatchedDocuments from '../views/UnmatchedDocuments/UnmatchedDocuments.vue'
import WizardView from '../views/wizard/WizardView.vue'
import TuttePartiteView from '../views/TuttePartiteView.vue'
import store from '../store'
import BIView from '../views/BIView.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true,
      items: [
        {
          text: 'Home',
          disabled: true,
        }
      ],
    },
    alias: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      guest: true,
      items: [
        {
          text: 'Login',
          disabled: true,
        }
      ],
    },
  },
  /*{
    path: '/logout',
    name: 'logout',
    component: LogoutView,
    meta: { guest: true },
  },*/

  {
    path: '/home/associatedmatchesselect',
    name: 'matchassociated',
    component: MatchAssociatedView,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'Match Associati Select',
          disabled: true,
        }
      ],
    },
  },
  {
    path: '/home/associatedmatchesselect/associatedmatcheslist',
    name: 'matchassociated1',
    component: MatchAssociatedView1,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'Match Associati Select',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'matchassociated'
          }
        },
        {
          text: 'Match Associati List',
          disabled: true,
        }   
      ],
    },
    props: true
  },
  {
    path: '/home/associatedmatchesselect/associatedmatcheslist/:id',
    name: 'matchassociated2',
    component: MatchAssociatedView2,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'Match Associati Select',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'matchassociated'
          }
        },
        {
          text: 'Match Associati List',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'matchassociated1'
          }
        },
        {
          text: 'Match Associati Details',
          disabled: true,
        }   
      ],
    },
    props: true
  },
  {
    path: '/home/manualmatchessearch',
    name: 'manualmatch',
    component: ManualMatchView,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'Match Manuali Search',
          disabled: true,
        }
      ],
    },
    props: true
  },
  
  {
    path: '/home/manualmatchessearch/manualmatches',
    name: 'manualmatch1',
    component: ManualMatchView1,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'Match Manuali Search',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'manualmatch'
          }
        },
        {
          text: 'Match Manuali List',
          disabled: true,
        }   
      ],
    },
    props: true
  },
  {
    path: '/home/closedmatches',
    name: 'closedmatch',
    component: ClosedMatch,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'Match Chiusi List',
          disabled: true,
        }
      ],
    },
    props: true
  },
  {
    path: '/home/closedmatches/closedmatchdetail/:id',
    name: 'closedmatch1',
    component: ClosedMatch1,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'Match Chiusi List',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'closedmatch'
          }
        },
        {
          text: 'Match Chiusi Details',
          disabled: true,
        }   
      ],
    },
    props: true
  },
  {
    path: '/unmatcheddocuments',
    name: 'unmatcheddocuments',
    component: UnmatchedDocuments,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'Documents Check',
          disabled: true,
        }
      ],
    },    props: true
  },
  {
    path: '/home/wizard',
    name: 'wizard',
    component: WizardView,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'wizard',
          disabled: true,
        }
      ],
    },
  },
  {
    path: '/home/viewpartite',
    name: 'viewpartite',
    component: TuttePartiteView,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'view partite',
          disabled: true,
        }
      ],
    },
  },
  {
    path: '/home/biview',
    name: 'biview',
    component: BIView,
    meta: {requiresAuth: true,
      items: [
        {
          text: 'Home',
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: 'home'
          }       
        },
        {
          text: 'statistics',
          disabled: true,
        }
      ],
    },
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log("scrollbeahviour: " + JSON.stringify(savedPosition  ));
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters["auth/isAuthenticated"]) {
      next();
      return;
    }
    console.log("requested page was: " + to.name);
    await store.commit("auth/setRequestedPage", to.name);
    next("/login");
  } else {
    next();
  }
});

export default router
