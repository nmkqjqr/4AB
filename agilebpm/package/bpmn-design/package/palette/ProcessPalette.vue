<template>
  <!-- 简易画板 -->
  <div class="my-process-palette">
    <div class="my-process-palette_header">
      <span>流程节点</span>
      <!-- <el-icon :size="14" style="cursor: pointer" @click="width = 30">
        <DArrowLeft />
      </el-icon> -->
    </div>
    <div class="my-process-palette_con">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1" title="流程节点">
          <div
            class="custom-button"
            @click="createElement($event, 'StartEvent')"
            @mousedown="createElement($event, 'StartEvent')"
          >
            <span class="task-icon task-icon-start"></span>
            开始节点
          </div>
          <div
            class="custom-button"
            @click="createElement($event, 'EndEvent')"
            @mousedown="createElement($event, 'EndEvent')"
          >
            <span class="task-icon task-icon-end"></span>
            结束节点
          </div>
          <!--  可以简化。。。 -->
          <!-- <div
					class="custom-button"
					@click="createElement($event, 'Task')"
					@mousedown="createElement($event, 'Task')"
				>
					<span class="task-icon task-icon-end"></span>yong
				</div> -->
          <div
            class="custom-button"
            @click="createElement($event, 'UserTask')"
            @mousedown="createElement($event, 'UserTask')"
          >
            <span class="task-icon task-icon-user"></span>
            用户任务
          </div>

          <div
            class="custom-button"
            @click="createElement($event, 'ServiceTask')"
            @mousedown="createElement($event, 'ServiceTask')"
          >
            <span class="task-icon task-icon-service"></span>
            服务任务
          </div>

          <div
            class="custom-button"
            @click="
              createElement($event, 'SubProcess', {
                isExpanded: true,
                collapsed: false,
                height: 210,
                width: 360,
              })
            "
            @mousedown="
              createElement($event, 'SubProcess', {
                isExpanded: true,
                collapsed: false,
                height: 210,
                width: 360,
              })
            "
          >
            <span class="task-icon bpmn-icon-subprocess-expanded"></span>
            子流程
          </div>
          <div
            class="custom-button"
            @click="createElement($event, 'CallActivity')"
            @mousedown="createElement($event, 'CallActivity')"
          >
            <span class="task-icon bpmn-icon-call-activity"></span>
            外部子流程
          </div>
          <div
            class="custom-button"
            @click="createElement($event, 'ExclusiveGateway')"
            @mousedown="createElement($event, 'ExclusiveGateway')"
          >
            <span class="task-icon task-icon-exclusive"></span>
            分支网关
          </div>

          <div
            class="custom-button"
            @click="createElement($event, 'ParallelGateway')"
            @mousedown="createElement($event, 'ParallelGateway')"
          >
            <span class="task-icon task-icon-parallel"></span>
            并行网关
          </div>
          <div
            class="custom-button"
            @click="createElement($event, 'InclusiveGateway')"
            @mousedown="createElement($event, 'InclusiveGateway')"
          >
            <span
              class="task-icon bpmn-icon-gateway-or"
              style="font-size: 18px"
            ></span>
            相容网关
          </div>
        </el-collapse-item>
        <el-collapse-item name="2" title="辅助">
          <div
            class="custom-button"
            @click="createElement($event, 'Participant')"
            @mousedown="createElement($event, 'Participant')"
          >
            <span class="task-icon task-icon-pool"></span>
            池
          </div>
          <div
            class="custom-button"
            @click="createElement($event, 'Lane')"
            @mousedown="createElement($event, 'Lane')"
          >
            <span class="task-icon task-icon-lane"></span>
            泳道
          </div>
          <div
            class="custom-button"
            @click="createElement($event, 'TextAnnotation')"
            @mousedown="createElement($event, 'TextAnnotation')"
          >
            <span class="task-icon task-icon-annotation"></span>
            注释说明
          </div>
        </el-collapse-item>
        <el-collapse-item name="3" title="高级节点">
          <template v-for="(item, index) in seniorNode" :key="index">
            <div
              class="custom-button"
              @click="
                createElementHeight(
                  $event,
                  item.task,
                  item.eventDefinitionType,
                  item.options
                )
              "
              @mousedown="
                createElementHeight(
                  $event,
                  item.task,
                  item.eventDefinitionType,
                  item.options
                )
              "
            >
              <span :class="`task-icon ${item.icon}`"></span>
              {{ item.name }}
            </div>

            <!-- entry  -->
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="js">
   import { DArrowRight, DArrowLeft } from '@element-plus/icons-vue'
   import { assign } from 'min-dash';
   import { customizeId } from '../designer/plugins/utils.js'
   import ZhTranslate from '~/agilebpm/package/bpmn-design/package/designer/plugins/translate/zh.js'
   /**
    * 节点元素定义。
    * 事件都是用一个圆圈来代表，影响流程的流动，
    * 一般有一个原因（trigger）或者一个影响（result）。
    * 标准定义了三种事件：开始，中间和结束。从定义和分类名称上来看也能猜到事件的作用了，
    * 控制流程的开始，中间流转和结束，
    * 这些控制可能采取触发器（trigger）来完成，或者是导致一个结果（结束或抛出）。
    * 开始事件
    * 开始事件	        Start Event	None	 	image
       条件开始事件	Conditional start event	Conditional	 	image
       消息开始事件	Message start event	Message	 	image[16]
       多重启动事件	Multiple start event	Multiple	 	image
       多重并行开始事件	Parallel multiple start event	Parallel
       Multiple	 	image
       信号开始事件	Signal start event	signal	 	image
       定时开始事件	Timer start event	Timer
    */
   export default {
   	name: 'MyProcessPalette',
     components:{
      //  DArrowRight,
       DArrowLeft
     },
   	data() {
   		return {
               activeNames: ["1","2","3"],
               seniorNode: [
                   {name: '定时开始节点',icon: 'bpmn-icon-start-event-timer',task: 'StartEvent',eventDefinitionType:'TimerEventDefinition', options: {nodeType: 'StartTimerEvent'}},
                   {name: '定时边界事件',icon: 'bpmn-icon-intermediate-event-catch-timer',task: 'BoundaryEvent',eventDefinitionType:'TimerEventDefinition', options: {nodeType: 'BoundaryTimerEvent'}},
                   {name: '定时等待节点',icon: 'bpmn-icon-intermediate-event-catch-timer',task: 'IntermediateCatchEvent',eventDefinitionType:'TimerEventDefinition'},
                   // {name: '信号开始事件',icon: 'bpmn-icon-start-event-signal',task: 'StartEvent',eventDefinitionType:'SignalEventDefinition'},
                   // {name: '信号抛出事件',icon: 'bpmn-icon-intermediate-event-catch-signal',task: 'IntermediateCatchEvent',eventDefinitionType:'SignalEventDefinition'},
                   // {name: '信号边界事件',icon: 'bpmn-icon-intermediate-event-catch-signal',task: 'BoundaryEvent',eventDefinitionType:'SignalEventDefinition'},
                   // {name: '信号等待事件',icon: 'task-icon-timer',task: 'SignalEventDefinition'},
                   // {name: '结束错误事件',icon: 'bpmn-icon-end-event-error',task: 'EndEvent',eventDefinitionType:'ErrorEventDefinition'},
                   // {name: '错误边界事件',icon: 'bpmn-icon-intermediate-event-catch-error',task: 'BoundaryEvent',eventDefinitionType:'ErrorEventDefinition'},
                   // {name: '终止结束事件',icon: 'bpmn-icon-end-event-terminate',task: 'EndEvent',eventDefinitionType:'TerminateEventDefinition'},
               ],
               toolNode: [
                   {name: '手型工具',icon: 'task-icon-timer',task: 'handTool'},
                   {name: '框选工具',icon: 'task-icon-timer',task: 'lassoTool'},
                   {name: '连线工具',icon: 'task-icon-timer',task: 'connectTool'},
               ]
           };
   	},
  mounted() {},

  methods: {
     toolsClick(type){
       const BpmnModeler=window.bpmnInstances.modeler;
       BpmnModeler.get(type).toggle();
     },
     createId(type){
       const CAPS_REGEX = /[A-Z]/g;
       const elementRegistry=window.bpmnInstances.modeler.get('elementRegistry');
       const arr= elementRegistry.filter((element,gfx)=>element.type== `bpmn:${type}`);
       const last=arr[arr.length-1]?arr[arr.length-1].id.replace(type,''):0;
       let id,name;
       const str=type.replace(CAPS_REGEX,' $&').trim();
       if(last==arr.length){
        id =`${type}${arr.length+1}`;
         name=`${ZhTranslate[str]}${arr.length+1}`
       }else{
        id=`${type}${parseInt(last)+1}`;
         name=`${ZhTranslate[str]}${parseInt(last)+1}`
       }
       return {id,name}
     },
     createElementHeight(event, type,eventDefinitionType, options = {}) {
  		const ElementFactory = window.bpmnInstances.elementFactory;
       const BpmnFactory = window.bpmnInstances.bpmnFactory;
  		const create = window.bpmnInstances.modeler.get('create');
       const moddle=window.bpmnInstances.modeler.get('moddle');
       const {id,name}= this.createId(type);
       const taskBusinessObject = BpmnFactory.create(`bpmn:${type}`, { id, name });
       const newEventDefinition=moddle.create( `bpmn:${eventDefinitionType}`)
       newEventDefinition.$parent = taskBusinessObject;
       taskBusinessObject.eventDefinitions = [newEventDefinition];
  		const shape = ElementFactory.createShape(assign({ type: `bpmn:${type}` }, options, { businessObject: taskBusinessObject}));
  		if (options) {
  			shape.businessObject.di.isExpanded = options.isExpanded;
        shape.businessObject.di.nodeType = options.nodeType
  		}
       // 创建
  	  create.start(event, shape);
  	},
     initPropertryInfo(type){
       const modeling=window.bpmnInstances.modeler.get('modeling');

     },
  	createElement(event, type, options = {}) {
  		const ElementFactory = window.bpmnInstances.elementFactory;
       const BpmnFactory = window.bpmnInstances.bpmnFactory;
  		 const create = window.bpmnInstances.modeler.get('create');
       const modeling=window.bpmnInstances.modeler.get('modeling');
       const {id,name}= this.createId(type);
       const taskBusinessObject = BpmnFactory.create(`bpmn:${type}`, { id, name: name });
  		 const shape = ElementFactory.createShape(assign({ type: `bpmn:${type}` },options , { businessObject: taskBusinessObject }));

      if (options) {
  			shape.businessObject.di.isExpanded = options.isExpanded;
        // 添加节点类型，用于识别高级节点类型
        shape.businessObject.di.nodeType = options.nodeType;
  		}
       // 创建
  		create.start(event, shape);

       // 总节点

  	},
  	startTool(event, type) {
  		if (type === 'handTool') {
  			window.bpmnInstances.modeler.get('handTool').activateHand(event);
  		}
  		if (type === 'lassoTool') {
  			window.bpmnInstances.modeler.get('lassoTool').activateSelection(event);
  		}
  		if (type === 'connectTool') {
  			window.bpmnInstances.modeler.get('globalConnect').toggle(event);
  		}
  	},
         trackName(element){
         }
  },
   };
</script>

<style scoped lang="scss">
  :deep(.el-collapse-item__header) {
    font-weight: bold;
  }
  .my-process-palette {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    // padding: 0 10px;
    height: 100%;
    overflow: auto;
    user-select: none;
    background: #fff;
    .my-process-palette_con {
      box-sizing: border-box;
      width: 100%;
      padding: 0px 8px;
      .top_action {
        .group {
          .entry {
            display: inline-block;
            width: 50px;
            height: 50px;
            font-size: 30px;
            line-height: 50px;
            color: #333;
            text-align: center;
            cursor: pointer;
          }
          .entry:hover {
            color: blue;
          }
        }
      }
    }
    .my-process-palette_header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 36px;
      padding: 0px 8px;
      background-color: #f8f8f8;
    }
    .title {
      padding: 0 8px;
      margin: 0;
      font-weight: bold;
      line-height: 48px;
    }
    :deep(.el-collapse-item__header) {
      padding: 0 8px;
    }
    .custom-button {
      box-sizing: border-box;
      padding: 5px 8px;
      cursor: pointer;
      // margin-bottom: 8px;
      //border: 1px solid rgba(24, 144, 255, 0.8);
      border-radius: 4px;
      &:first-child {
        margin-top: 0px;
      }
    }
  }

  .task-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    aspect-ratio: auto 16 / 16;
    margin-right: 3px;
    font-size: 18px;
    line-height: 16px;
    vertical-align: text-bottom;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;

    &-start {
      background-image: url('../image/none.png');
    }
    &-end {
      background-image: url('../image/none-end.png');
    }
    &-user {
      background-image: url('../image/type.user.png');
    }
    &-service {
      background-image: url('../image/type.service.png');
    }
    &-subprocess {
      background-image: url('../image/expanded.subprocess.png');
    }
    &-out-task {
      background-image: url('../image/task.png');
    }
    &-exclusive {
      background-image: url('../image/exclusive.databased.png');
    }
    &-parallel {
      background-image: url('../image/parallel.png');
    }
    &-inclusive {
      background-image: url('../image/inclusive.png');
    }
    // 辅助
    &-pool {
      background-image: url('../image/pool.png');
    }
    &-lane {
      background-image: url('../image/lane.png');
    }
    &-annotation {
      background-image: url('../image/text.annotation.png');
    }
    // 高级节点
    &-timer {
      background-image: url('../image/timer.png');
    }
    &-signal-start {
      background-image: url('../image/signal-start.png');
    }
    &-annotation {
      background-image: url('../image/text.annotation.png');
    }
  }
</style>
