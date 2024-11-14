<template>
  <el-card v-show="info.show" ref="card" v-bind="$attrs">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
  </el-card>
</template>
<script lang="ts" setup>
  const props = defineProps({
    isHidden: {
      type: Boolean,
      default: true,
    },
    permission: {
      type: String,
      default: '',
    },
  })
  const pageInstance = getCurrentInstance()
  const abFormMananger = inject('abForm') as AbFormProvide

  const info: any = reactive({
    show: true,
  })

  onMounted(() => {
    handle()
  })

  const handle = () => {
    if (['w', 'b', 'r'].includes(props.permission)) {
      info.show = true
      return
    }
    if (props.permission == 'n') {
      info.show = false
      return
    }
    if (!props.isHidden) {
      return
    }
    try {
      const body = pageInstance?.refs.card?.$el.querySelector('.el-card__body')
      const header =
        pageInstance?.refs.card?.$el.querySelector('.el-card__header')
      if (body) {
        //分组
        const row = body.querySelector('.el-row')
        if (row) {
          if (row.childElementCount == 0) {
            info.show = false
          } else {
            //子有元素，则判断是否全部元素都是隐藏
            info.show = false
            row.children.forEach((c: any) => {
              if ('none' != c.style.display) {
                //只要有一个不是隐藏的都显示
                info.show = true
              }
            })
          }
        }
        //子表内容为空
        else if (body.childElementCount == 0) {
          info.show = !!header.querySelector('.el-button')
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  watch(
    () => abFormMananger.key,
    (now, old) => {
      nextTick(() => {
        handle()
      })
    }
  )
</script>
