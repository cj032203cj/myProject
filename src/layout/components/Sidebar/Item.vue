<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<div class="center"><i class={[icon, 'sub-el-icon']} /></div>)
      } else {
        vnodes.push(<div class="center"><svg-icon icon-class={icon}/></div>)
      }
    }

    if (title) {
      vnodes.push(<div class="center" slot='title'>{(title)}</div>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
  .center{
    text-align: center;
  }
</style>
