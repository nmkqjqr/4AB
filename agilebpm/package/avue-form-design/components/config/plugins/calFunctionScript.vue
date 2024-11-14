<template>
  <div>
  <codemirror
    v-model="docText"
    :extensions="codemirrorExtensions"
    ref="editor"
    :indent-with-tab="true"
    :placeholder="props.placeholder"
    :config="config"
    :style="{
      border: `1px solid #e4e7ed`,
      minHeight:'66px',
      width: props.width,
    }"
    @ready="codemirrorReady"
  />
</div>
</template>
<script lang="ts" setup>
  import { Codemirror } from 'vue-codemirror'
  import {EditorState, EditorSelection} from "@codemirror/state"

  import {
    Decoration,
    EditorView,
    ViewPlugin,
    WidgetType,
    MatchDecorator,
  } from '@codemirror/view'

  const props = defineProps({
    modelValue: { type: String, required: true },
    placeholder:{ type: String, required: false,default:'请输入脚本' },
    width:{ type: String, required: false,default:'500px' },
  })
  const config = reactive({
        indentWithTab: true,
        tabSize: 2,
        autofocus: true,
        height: 'auto',
        language: 'javascript',
        theme:  'oneDark'
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
      elt.className = 'el-tag el-tag--light mx-1'
      elt.style.margin = '1px 2px'
      elt.textContent = this.name
      return elt
    }

    ignoreEvent() {
      return false
    }
  }
  const codemirrorRef = ref()

  const setScript = (script:string)=>{
    const {state,view}  = codemirrorRef.value;

    const startPos = view.state.selection.main.head
    // 设置脚本
    view.dispatch({
      changes: {
        from: startPos,
        insert: script
      }
    })

    // 光标往后移动
    nextTick(() => {
      const newCursorPosition = view.state.selection.main.head + script.length
      const newSelection = EditorSelection.cursor(newCursorPosition);

      view.dispatch({
        selection: newSelection ,
    })

    })
  } 

  defineExpose({ setScript })

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

  const codemirrorExtensions = [placeholders, EditorView.lineWrapping,]

  function codemirrorReady(payload: any) {
    const { state: editorState, view: editorView } = payload
    codemirrorRef.value = payload
    editorView.dom
      .getElementsByClassName('cm-content cm-lineWrapping')
      ?.forEach((ele: any) => (ele.style.wordBreak = 'break-all'))

    editorView.dom
      .getElementsByClassName('cm-gutters')
      ?.forEach((ele: any) => (ele.innerHTML = null))
  }
</script>
