import Vue from 'vue';
import Router from 'vue-router';

// FIXME: Replace {view} with real view
import Home from 'vue/{view}';

Vue.use(Router);

const router = new Router({
  routes: [
    // FIXME: Replace {route} with real route
    {
      path: '/{route}',
      name: '{route}',
      component: Home
    },
  ]
});

export default router;