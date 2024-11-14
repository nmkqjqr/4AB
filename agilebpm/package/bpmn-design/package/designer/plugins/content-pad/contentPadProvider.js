import { assign, forEach, isArray } from 'min-dash'

import { is } from '~/agilebpm/package/bpmn-js/lib/util/ModelUtil'

import {
  isExpanded,
  isEventSubProcess,
} from '~/agilebpm/package/bpmn-js/lib/util/DiUtil'

import { isAny } from '~/agilebpm/package/bpmn-js/lib/features/modeling/util/ModelingUtil'

import { getChildLanes } from '~/agilebpm/package/bpmn-js/lib/features/modeling/util/LaneUtil'

import { hasPrimaryModifier } from 'diagram-js/lib/util/Mouse'
import { customizeId } from './../utils'
import ZhTranslate from '~/agilebpm/package/bpmn-design/package/designer/plugins/translate/zh.js'

/**
 * A provider for BPMN 2.0 elements context pad
 */
export default function ContextPadProvider(
  config,
  injector,
  eventBus,
  contextPad,
  modeling,
  bpmnFactory,
  elementFactory,
  connect,
  create,
  popupMenu,
  canvas,
  rules,
  translate,
  elementRegistry
) {
  config = config || {}

  contextPad.registerProvider(this)

  this._contextPad = contextPad

  this._modeling = modeling

  this._elementFactory = elementFactory
  this._connect = connect
  this._create = create
  this._popupMenu = popupMenu
  this._canvas = canvas
  this._rules = rules
  this._translate = translate
  this._bpmnFactory = bpmnFactory
  this._elementRegistry = elementRegistry
  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false)
  }

  eventBus.on('create.end', 250, function (event) {
    const context = event.context,
      shape = context.shape

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return
    }

    const entries = contextPad.getEntries(shape)

    if (entries.replace) {
      entries.replace.action.click(event, shape)
    }
  })
}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'bpmnFactory',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate',
  'elementRegistry',
]

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  const contextPad = this._contextPad,
    modeling = this._modeling,
    elementFactory = this._elementFactory,
    connect = this._connect,
    create = this._create,
    popupMenu = this._popupMenu,
    canvas = this._canvas,
    rules = this._rules,
    autoPlace = this._autoPlace,
    bpmnFactory = this._bpmnFactory,
    translate = this._translate,
    elementRegistry = this._elementRegistry
  const actions = {}

  // 标签直接返回
  if (element.type === 'label') {
    return actions
  }
  // debugger;
  const businessObject = element.businessObject

  function startConnect(event, element) {
    connect.start(event, element)
  }

  function removeElement() {
    modeling.removeElements([element])
  }

  function getReplaceMenuPosition(element) {
    const Y_OFFSET = 5

    const diagramContainer = canvas.getContainer(),
      pad = contextPad.getPad(element).html

    const diagramRect = diagramContainer.getBoundingClientRect(),
      padRect = pad.getBoundingClientRect()

    const top = padRect.top - diagramRect.top
    const left = padRect.left - diagramRect.left

    const pos = {
      x: left,
      y: top + padRect.height + Y_OFFSET,
    }

    return pos
  }

  // 初始化 nodeid的规则
  function createId(type) {
    const CAPS_REGEX = /[A-Z]/g
    const arr = elementRegistry.filter(
      (element, gfx) => element.type == `bpmn:${type}`
    )
    let last = arr[arr.length - 1]
      ? arr[arr.length - 1].id.replace(type, '')
      : 0
    let id, name
    const str = type.replace(CAPS_REGEX, ' $&').trim()
    if (isNaN(last)) {
      last = `${arr.length}`
    }

    if (last == arr.length) {
      id = `${type}${arr.length + 1}`
      name = `${ZhTranslate[str]}${arr.length + 1}`
    } else {
      id = `${type}${parseInt(last) + 1}`
      name = `${ZhTranslate[str]}${parseInt(last) + 1}`
    }
    return { id, name }
  }
  /**
   * Create an append action
   *
   * @param {string} type
   * @param {string} className
   * @param {string} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {
    if (typeof title !== 'string') {
      options = title
      title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') })
    }

    function appendStart(event, element) {
      const { id, name } = createId(type.replace(/^bpmn:/, ''))

      const taskBusinessObject = bpmnFactory.create(type, { id, name })
      const shape = elementFactory.createShape(
        assign({ type: type }, options, { businessObject: taskBusinessObject })
      )

      // var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape, {
        source: element,
      })
    }

    const append = autoPlace
      ? function (event, element) {
          const { id, name } = createId(type.replace(/^bpmn:/, ''))

          const taskBusinessObject = bpmnFactory.create(type, { id, name })
          const shape = elementFactory.createShape(
            assign({ type: type }, options, {
              businessObject: taskBusinessObject,
            })
          )
          // var shape = elementFactory.createShape(assign({ type: type }, options));

          autoPlace.append(element, shape)
        }
      : appendStart

    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append,
      },
    }
  }

  function splitLaneHandler(count) {
    return function (event, element) {
      // actual split
      modeling.splitLane(element, count)

      // refresh context pad after split to
      // get rid of split icons
      contextPad.open(element, true)
    }
  }

  if (
    isAny(businessObject, ['bpmn:Lane', 'bpmn:Participant']) &&
    isExpanded(businessObject)
  ) {
    const childLanes = getChildLanes(element)

    assign(actions, {
      'lane-insert-above': {
        group: 'lane-insert-above',
        className: 'bpmn-icon-lane-insert-above',
        title: translate('Add Lane above'),
        action: {
          click: function (event, element) {
            modeling.addLane(element, 'top')
          },
        },
      },
    })

    if (childLanes.length < 2) {
      if (element.height >= 120) {
        assign(actions, {
          'lane-divide-two': {
            group: 'lane-divide',
            className: 'bpmn-icon-lane-divide-two',
            title: translate('Divide into two Lanes'),
            action: {
              click: splitLaneHandler(2),
            },
          },
        })
      }

      if (element.height >= 180) {
        assign(actions, {
          'lane-divide-three': {
            group: 'lane-divide',
            className: 'bpmn-icon-lane-divide-three',
            title: translate('Divide into three Lanes'),
            action: {
              click: splitLaneHandler(3),
            },
          },
        })
      }
    }

    assign(actions, {
      'lane-insert-below': {
        group: 'lane-insert-below',
        className: 'bpmn-icon-lane-insert-below',
        title: translate('Add Lane below'),
        action: {
          click: function (event, element) {
            modeling.addLane(element, 'bottom')
          },
        },
      },
    })
  }

  if (is(businessObject, 'bpmn:FlowNode')) {
    if (is(businessObject, 'bpmn:EventBasedGateway')) {
      assign(actions, {
        'append.receive-task': appendAction(
          'bpmn:ReceiveTask',
          'bpmn-icon-receive-task',
          translate('Append ReceiveTask')
        ),
        'append.message-intermediate-event': appendAction(
          'bpmn:IntermediateCatchEvent',
          'bpmn-icon-intermediate-event-catch-message',
          translate('Append MessageIntermediateCatchEvent'),
          { eventDefinitionType: 'bpmn:MessageEventDefinition' }
        ),
        'append.timer-intermediate-event': appendAction(
          'bpmn:IntermediateCatchEvent',
          'bpmn-icon-intermediate-event-catch-timer',
          translate('Append TimerIntermediateCatchEvent'),
          { eventDefinitionType: 'bpmn:TimerEventDefinition' }
        ),
        'append.condition-intermediate-event': appendAction(
          'bpmn:IntermediateCatchEvent',
          'bpmn-icon-intermediate-event-catch-condition',
          translate('Append ConditionIntermediateCatchEvent'),
          { eventDefinitionType: 'bpmn:ConditionalEventDefinition' }
        ),
        'append.signal-intermediate-event': appendAction(
          'bpmn:IntermediateCatchEvent',
          'bpmn-icon-intermediate-event-catch-signal',
          translate('Append SignalIntermediateCatchEvent'),
          { eventDefinitionType: 'bpmn:SignalEventDefinition' }
        ),
      })
    } else if (
      isEventType(
        businessObject,
        'bpmn:BoundaryEvent',
        'bpmn:CompensateEventDefinition'
      )
    ) {
      assign(actions, {
        'append.compensation-activity': appendAction(
          'bpmn:Task',
          'bpmn-icon-task',
          translate('Append compensation activity'),
          {
            isForCompensation: true,
          }
        ),
      })
    } else if (
      !is(businessObject, 'bpmn:EndEvent') &&
      !businessObject.isForCompensation &&
      !isEventType(
        businessObject,
        'bpmn:IntermediateThrowEvent',
        'bpmn:LinkEventDefinition'
      ) &&
      !isEventSubProcess(businessObject)
    ) {
      assign(actions, {
        'append.end-event': appendAction(
          'bpmn:EndEvent',
          'bpmn-icon-end-event-none',
          translate('Append EndEvent')
        ),
        'append.gateway': appendAction(
          'bpmn:ExclusiveGateway',
          'bpmn-icon-gateway-xor',
          translate('Append Gateway')
        ),
        'append.append-task': appendAction(
          'bpmn:UserTask',
          'bpmn-icon-user-task',
          translate('Append Task')
        ),
        'append.append-service-task': appendAction(
          'bpmn:ServiceTask',
          'bpmn-icon-service',
          translate('Append ServiceTask')
        ),
        // 'append.intermediate-event': appendAction(
        //     'bpmn:IntermediateThrowEvent',
        //     'bpmn-icon-intermediate-event-none',
        //     translate('Append Intermediate/Boundary Event')
        // ),
      })
    }
  }

  // 追加修改类型工具
  //
  if (
    !popupMenu.isEmpty(element, 'bpmn-replace') &&
    isAny(businessObject, [
      'bpmn:IntermediateCatchEvent',
      'bpmn:BoundaryEvent',
      'bpmn:IntermediateThrowEvent',
    ])
  ) {
    // Replace menu entry
    assign(actions, {
      replace: {
        group: 'edit',
        className: 'bpmn-icon-screw-wrench',
        title: translate('Change type'),
        action: {
          click: function (event, element) {
            const position = assign(getReplaceMenuPosition(element), {
              cursor: { x: event.x, y: event.y },
            })
            popupMenu.open(element, 'bpmn-replace', position)
          },
        },
      },
    })
  }

  if (
    isAny(businessObject, [
      'bpmn:FlowNode',
      'bpmn:InteractionNode',
      'bpmn:DataObjectReference',
      'bpmn:DataStoreReference',
    ]) &&
    !is(businessObject, 'bpmn:EndEvent')
  ) {
    assign(actions, {
      'append.text-annotation': appendAction(
        'bpmn:TextAnnotation',
        'bpmn-icon-text-annotation'
      ),
      connect: {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate(
          `Connect using ${
            businessObject.isForCompensation ? '' : 'Sequence/MessageFlow or '
          }Association`
        ),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    })
  }

  if (
    isAny(businessObject, [
      'bpmn:DataObjectReference',
      'bpmn:DataStoreReference',
    ])
  ) {
    assign(actions, {
      connect: {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate('Connect using DataInputAssociation'),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    })
  }

  if (is(businessObject, 'bpmn:Group')) {
    assign(actions, {
      'append.text-annotation': appendAction(
        'bpmn:TextAnnotation',
        'bpmn-icon-text-annotation'
      ),
    })
  }

  // delete element entry, only show if allowed by rules
  let deleteAllowed = rules.allowed('elements.delete', { elements: [element] })

  if (isArray(deleteAllowed)) {
    // was the element returned as a deletion candidate?
    deleteAllowed = deleteAllowed[0] === element
  }

  if (deleteAllowed) {
    assign(actions, {
      delete: {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement,
        },
      },
    })
  }
  return actions
}

// helpers /////////

function isEventType(eventBo, type, definition) {
  const isType = eventBo.$instanceOf(type)
  let isDefinition = false

  const definitions = eventBo.eventDefinitions || []
  forEach(definitions, function (def) {
    if (def.$type === definition) {
      isDefinition = true
    }
  })

  return isType && isDefinition
}
