<template>
  <ul class="timeline-wrapper">
    <li
      v-for="(nodeDynamic, index) in props.dataList"
      :key="index"
      class="timeline-item"
    >
      <div class="timeline-box">
        <div
          class="out-circle"
          :style="{ background: nodeDynamic.statusLabelCss }"
        >
          {{ nodeDynamic.statusValue }}
        </div>
        <div class="long-line"></div>
      </div>
      <div class="timeline-content">
        <div class="timeline-date">{{ nodeDynamic.nodeName }}</div>
        <div class="timeline-title">
<!--          <el-tooltip-->
<!--            v-if="-->
<!--              nodeDynamic.candidateNames &&-->
<!--              nodeDynamic.candidateNames.length > 10-->
<!--            "-->
<!--            class="box-item"-->
<!--            effect="dark"-->
<!--            placement="top-start"-->
<!--          >-->
<!--            <template #content>{{ nodeDynamic.candidateNames }}</template>-->

<!--            {{ handleApproveName(nodeDynamic.candidateNames) }}-->
<!--          </el-tooltip>-->
          <span v-if="!nodeDynamic.nodeKey.startsWith('EndEvent')">
            <ab-avatar
              v-if="nodeDynamic.assignInfo && nodeDynamic.assignInfo !== ''"
              :data="nodeDynamic.assignInfo"
            />
          </span>

          <span style="float: right">
            {{ nodeDynamic.approveTimeStr }}
          </span>
        </div>
        <div class="timeline-desc">
          <div
            v-for="(item, index2) in nodeDynamic.discussesList"
            :key="index2"
          >
            <div
              class="cardStyle"
              :style="{
                float: item.type == 2 ? 'right' : 'left',
                textAlign: item.type == 2 ? 'right' : 'left',
                marginBottom: '5px',
                background: '#f7f7f7',
                padding: '8px',
              }"
            >
              <p class="pTitle">
                {{ getContentDesc(item, nodeDynamic) }}
              </p>

              <p class="pTime">
                {{ item.desc }}
              </p>
              <ab-upload-file
                v-if="item.attachment"
                v-model="item.attachment"
                disabled
                hide-button
              />
            </div>
            <div
              v-if="
                nodeDynamic.approveNames &&
                nodeDynamic.approveNames.length > 0 &&
                index2 === 0
              "
              style="float: left; margin-top: 10px; margin-left: 20px"
            >
              <el-badge
                v-if="!nodeDynamic.currentUserLauded"
                style="cursor: pointer"
                :value="
                  nodeDynamic.laudCount > 0
                    ? nodeDynamic.laudCount
                    : nodeDynamic.c
                "
              >
                <vab-icon
                  icon="heart-add-fill"
                  style="font-size: 18px; color: grey"
                  @click="addLaud(nodeDynamic)"
                />
              </el-badge>

              <el-badge
                v-else
                class="item"
                style="cursor: pointer"
                :value="
                  nodeDynamic.laudCount > 0
                    ? nodeDynamic.laudCount
                    : nodeDynamic.c
                "
                @click="addLaud(nodeDynamic)"
              >
                <vab-icon
                  icon="heart-add-fill"
                  style="font-size: 18px; color: rgb(233, 20, 20)"
                />
              </el-badge>
            </div>
          </div>
          <div style="float: left; width: 100px">
            <el-button
              v-if="nodeDynamic.buttonType && nodeDynamic.buttonType === 1"
              size="small"
              text
              type="primary"
              @click="openDialog(nodeDynamic, 1)"
            >
              {{ $abT('bpm.office.postscript', '附言') }}
            </el-button>
            <el-button
              v-if="nodeDynamic.buttonType && nodeDynamic.buttonType === 2"
              size="small"
              text
              type="primary"
              @click="openDialog(nodeDynamic, 2)"
            >
              {{ $abT('bpm.office.comment', '评论') }}
            </el-button>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
  const props = defineProps({ dataList: { type: Array<any>, required: true } })
  const emit = defineEmits(['addLaud', 'openDialog'])
  import { abUploadFile, abAvatar } from '~/agilebpm'
  import { abT } from '@/i18n'
  const addaudInfo = reactive({
    timer: null,
    canClick: true,
  })

  const addLaud = (nodeDynamic: any) => {
    if (addaudInfo.canClick) {
      addaudInfo.canClick = false
      emit('addLaud', nodeDynamic)
      if (addaudInfo.timer) {
        clearTimeout(addaudInfo.timer)
      }
      addaudInfo.timer = setTimeout(() => {
        addaudInfo.canClick = true
      }, 3000)
    }
  }
  const openDialog = (nodeDynamic: any, type: number) => {
    emit('openDialog', nodeDynamic, type)
  }

  const getContentDesc = (discuss: any, nodeDynamic: any) => {
    let content = discuss.content
    if (discuss.type == 1 || discuss.type == 2) {
      return content
    }
    if (content) {
      return content
    }
    if (
      nodeDynamic.status === 'pending' ||
      nodeDynamic.status === 'processing'
    ) {
      content = abT('bpm.office.expectedcompletedTime', '预计于{a}完成', {
        a: nodeDynamic.estimateCompleteTimeStr,
      })
    }
    return content
  }

  const handleApproveName = (approveNames: string) => {
    if (!approveNames) {
      return abT('bpm.office.noCandidate', '无候选人')
    }
    if (approveNames.length < 10) {
      return approveNames
    }
    const result = []
    const names = approveNames.split(',')
    for (let i = 0; i < names.length; i++) {
      const name = names[i]
      if (name.indexOf(';') != -1) {
        const items = name.split(';')
        for (const index in items) {
          result.push(items[index])
        }
      } else {
        result.push(name)
      }
    }

    return `${result.join(',').substring(0, 10)}...`
  }
</script>

<style scoped lang="scss">
  ul.timeline-wrapper {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  /* 时间线 */
  .timeline-item {
    position: relative;
    padding-bottom: 10px;
    overflow: hidden;
    .timeline-box {
      position: absolute;
      display: block;
      height: 100%;
      text-align: center;
      .out-circle {
        display: grid;
        align-items: center;
        width: 60px;
        height: 40px;
        padding: 5px;
        margin: 8px 0;
        font-size: 12px;
        color: aliceblue;
        text-align: center;
        /*opacity: 0.1;*/
        border-radius: 7px;
        // box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);

        .in-circle {
          width: 8px;
          height: 8px;
          margin: 0 auto;
          background: rgba(14, 116, 218, 1);
          border-radius: 50%;
          box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
        }
      }

      .long-line {
        width: 2px;
        height: 100%;
        margin-left: 30px;
        background: rgba(14, 116, 218, 1);
        box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
        opacity: 0.1;
      }
    }

    .timeline-content {
      box-sizing: border-box;
      padding: 0 0 0 20px;
      margin-top: 8px;
      margin-bottom: 14px;
      margin-left: 70px;
      text-align: left;

      .timeline-title {
        margin-bottom: 12px;
        font-size: 10px;
        color: #73767a;
        word-break: break-all;
        /*display: inline;*/
      }

      .timeline-date {
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: bolder;
        color: #333;
      }
      .timeline-desc {
        overflow: hidden;
        font-size: 12px;
        color: #999999;
      }
      .cardStyle {
        float: right;
        width: 80%;
        border-radius: 5px;
        .pTitle {
          margin: 0;
          margin: 0;
          font-size: 13px;
          font-weight: 530;
          color: #000;
          letter-spacing: 0.5px;
        }
        .pTime {
          margin: 8px 0 0 0;
          font-size: 10px;
          color: #666;
          letter-spacing: 0.5px;
        }
        :deep() {
          .el-card__body {
            padding: 8px;
          }
        }
      }
    }
  }
  .timeline-item:last-of-type .timeline-content {
    margin-bottom: 0;
  }
</style>
