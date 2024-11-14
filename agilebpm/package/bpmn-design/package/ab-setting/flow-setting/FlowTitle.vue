<template>
  <codemirror
    v-model="docText"
    :extensions="codemirrorExtensions"
    :indent-with-tab="true"
    placeholder="流程标题"
    :style="{
      border: `1px solid #e4e7ed`,
      minHeight: `50px`,
      width: `100%`,
    }"
    @ready="codemirrorReady"
  />
</template>
<script lang="ts" setup>
  import { Codemirror } from 'vue-codemirror'
  import {
    Decoration,
    EditorView,
    ViewPlugin,
    WidgetType,
    MatchDecorator,
  } from '@codemirror/view'

  const props = defineProps({
    modelValue: { type: String, required: true },
    placeholder: { type: String, required: false, default: '请输入脚本' },
  })

  //双向绑定
  const emit = defineEmits(['update:modelValue', 'input'])

  const docText = useVModel(props, 'modelValue', emit)

  class PlaceholderWidget extends WidgetType {
    constructor(readonly name: string) {}

    eq(other: PlaceholderWidget) {
      return this.name == other.name
    }

    toDOM() {
      const elt = document.createElement('span')
      elt.className = 'el-tag el-tag--large el-tag--light mx-1'
      elt.style.margin = '1px 2px'
      elt.textContent = this.name
      return elt
    }

    ignoreEvent() {
      return false
    }
  }

  const placeholderMatcher = new MatchDecorator({
    regexp: /\{\{([^:]+):([^}]+)\}\}/g,
    decoration: (match) =>
      Decoration.replace({
        widget: new PlaceholderWidget(match[2]),
      }),
  })

  const placeholders = ViewPlugin.fromClass(
    class {
      constructor(view: EditorView) {
        this.placeholders = placeholderMatcher.createDeco(view)
      }

      update(update) {
        this.placeholders = placeholderMatcher.updateDeco(
          update,
          this.placeholders
        )
      }
    },
    {
      decorations: (instance) => instance.placeholders,
      provide: (plugin) =>
        EditorView.atomicRanges.of((view) => {
          return view.plugin(plugin)?.placeholders || Decoration.none
        }),
    }
  )

  const codemirrorExtensions = [placeholders, EditorView.lineWrapping]

  function codemirrorReady(payload: any) {
    // const { state: editorState, view: editorView } = payload
    // editorView.dom
    //   .getElementsByClassName('cm-content cm-lineWrapping')
    //   ?.forEach((ele: any) => (ele.style.wordBreak = 'break-all'))

    // editorView.dom
    //   .getElementsByClassName('cm-gutters')
    //   ?.forEach((ele: any) => (ele.innerHTML = null))
  }
</script>
