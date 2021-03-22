<script>
export default {
  name: 'app-loading',

  functional: true,

  props: {
    show: {
      type: Boolean
    }
  },

  render (createElement, context) {
    const show = context.props.show;
    const styles = {
      display: show ? 'block' : 'none'
    };

    return (
      <div class="loading-app-wr">
        <div v-loading="show" class="app-loading" style={styles} />
      </div>
    );
  }
};
</script>

<style scoped>
.app-loading {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
