<template>
  <div>
    <span v-for="(crumb, i) in buildCrumbs" :key="crumb.url">
      <router-link :to="crumb.path" class="bread-crumb"> {{ crumb.name }} </router-link>
      <span style="margin: 0 0" v-if="i !== buildCrumbs.length - 1">/</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'UrlBreadcrumbs',
  computed: {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    buildCrumbs() {
      if (this.$route.path === '/') {
        return '';
      }
      // custom breadcrumbs
      if (this.$route.meta.getBreadcrumbs) {
        const breadCrumbsArr = this.$route.meta.getBreadcrumbs(
          this.$route.params,
          this.$store.state,
        );
        breadCrumbsArr.unshift({ path: '/', name: 'Home' });
        // eslint-disable-next-line unicorn/no-reduce
        return breadCrumbsArr.reduce((accum, pathStep, i) => {
          if (i === 0) return [pathStep];
          return [
            ...accum,
            {
              path: `${accum[i - 1].path}${
                accum[i - 1].path[accum[i - 1].path.length - 1] === '/' || pathStep.path === ''
                  ? ''
                  : '/'
              }${pathStep.path}`,
              name: pathStep.name,
            },
          ];
        }, []);
      }
      // default breadcrumbs
      // eslint-disable-next-line unicorn/no-reduce
      return this.$route.path.split('/').reduce((accum, pathStep, i) => {
        if (i === 0) {
          return [{ path: `${pathStep === '/' ? '' : '/'}${pathStep}`, name: 'Home' }];
        }
        return [
          ...accum,
          {
            path: `${accum[i - 1].path}${
              accum[i - 1].path[accum[i - 1].path.length - 1] === '/' ? '' : '/'
            }${pathStep}`,
            name: pathStep,
          },
        ];
      }, []);
    },
  },
};
</script>

<style scoped></style>
