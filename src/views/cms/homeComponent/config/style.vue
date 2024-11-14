<template>
  <el-select v-bind="$attrs">
    <el-option :label="$abT('page.common.default','默认')" value="xtmr">
      {{ $abT('page.common.default','默认') }}
      <span
        class="color-span"
        style="left: 12px; z-index: 10; background-color: #509ee3"
      ></span>
      <span
        class="color-span"
        style="left: 24px; z-index: 9; background-color: #9cc177"
      ></span>
      <span
        class="color-span"
        style="left: 36px; z-index: 8; background-color: #a989c5"
      ></span>
      <span
        class="color-span"
        style="left: 48px; z-index: 7; background-color: #f9d45c"
      ></span>
      <span
        class="color-span"
        style="left: 60px; z-index: 6; background-color: #f1b556"
      ></span>
      <span
        class="color-span"
        style="left: 72px; z-index: 5; background-color: #a6e7f3"
      ></span>
      <span
        class="color-span"
        style="left: 84px; z-index: 4; background-color: #7172ad"
      ></span>
    </el-option>
    <el-option :label="$abT('page.homeComponent.colorful','绚丽多彩')" value="xldc">
      {{ $abT('page.homeComponent.colorful','绚丽多彩') }}
      <span
        class="color-span"
        style="left: 12px; z-index: 10; background-color: #578af2"
      ></span>
      <span
        class="color-span"
        style="left: 24px; z-index: 9; background-color: #62e075"
      ></span>
      <span
        class="color-span"
        style="left: 36px; z-index: 8; background-color: #42b36f"
      ></span>
      <span
        class="color-span"
        style="left: 48px; z-index: 7; background-color: #ffd660"
      ></span>
      <span
        class="color-span"
        style="left: 60px; z-index: 6; background-color: #b3de36"
      ></span>
      <span
        class="color-span"
        style="left: 72px; z-index: 5; background-color: #fa914e"
      ></span>
      <span
        class="color-span"
        style="left: 84px; z-index: 4; background-color: #f25252"
      ></span>
    </el-option>
    <el-option :label="$abT('page.homeComponent.blue','蓝橙撞色')" value="lczs">
      {{ $abT('page.homeComponent.blue','蓝橙撞色') }}
      <span
        class="color-span"
        style="left: 12px; z-index: 10; background-color: #4d8cae"
      ></span>
      <span
        class="color-span"
        style="left: 24px; z-index: 9; background-color: #ad5601"
      ></span>
      <span
        class="color-span"
        style="left: 36px; z-index: 8; background-color: #324498"
      ></span>
      <span
        class="color-span"
        style="left: 48px; z-index: 7; background-color: #2b5b75"
      ></span>
      <span
        class="color-span"
        style="left: 60px; z-index: 6; background-color: #0fa8e0"
      ></span>
      <span
        class="color-span"
        style="left: 72px; z-index: 5; background-color: #ff8500"
      ></span>
      <span
        class="color-span"
        style="left: 84px; z-index: 4; background-color: #006bc2"
      ></span>
    </el-option>
    <el-option :label="$abT('page.homeComponent.red','英伦酒红')" value="yljh">
      {{ $abT('page.homeComponent.red','英伦酒红') }}
      <span
        class="color-span"
        style="left: 12px; z-index: 10; background-color: #db5545"
      ></span>
      <span
        class="color-span"
        style="left: 24px; z-index: 9; background-color: #784029"
      ></span>
      <span
        class="color-span"
        style="left: 36px; z-index: 8; background-color: #e39970"
      ></span>
      <span
        class="color-span"
        style="left: 48px; z-index: 7; background-color: #e0d09f"
      ></span>
      <span
        class="color-span"
        style="left: 60px; z-index: 6; background-color: #a5a187"
      ></span>
      <span
        class="color-span"
        style="left: 72px; z-index: 5; background-color: #474844"
      ></span>
      <span
        class="color-span"
        style="left: 84px; z-index: 4; background-color: #984337"
      ></span>
    </el-option>
    <el-option :label="$abT('page.homeComponent.green',' 清新草绿')" value="qxcl">
      {{ $abT('page.homeComponent.green',' 清新草绿') }}
      <span
        class="color-span"
        style="left: 12px; z-index: 10; background-color: #8ac98b"
      ></span>
      <span
        class="color-span"
        style="left: 24px; z-index: 9; background-color: #a4ded9"
      ></span>
      <span
        class="color-span"
        style="left: 36px; z-index: 8; background-color: #67b9cd"
      ></span>
      <span
        class="color-span"
        style="left: 48px; z-index: 7; background-color: #d6d6d7"
      ></span>
      <span
        class="color-span"
        style="left: 60px; z-index: 6; background-color: #8d9e69"
      ></span>
      <span
        class="color-span"
        style="left: 72px; z-index: 5; background-color: #eb4b5c"
      ></span>
      <span
        class="color-span"
        style="left: 84px; z-index: 4; background-color: #b7d62e"
      ></span>
    </el-option>
    <el-option :label="$abT('page.homeComponent.purple','神秘魅紫')" value="smmz">
      {{ $abT('page.homeComponent.purple','神秘魅紫') }}
      <span
        class="color-span"
        style="left: 12px; z-index: 10; background-color: #c366a1"
      ></span>
      <span
        class="color-span"
        style="left: 24px; z-index: 9; background-color: #503491"
      ></span>
      <span
        class="color-span"
        style="left: 36px; z-index: 8; background-color: #daa6d6"
      ></span>
      <span
        class="color-span"
        style="left: 48px; z-index: 7; background-color: #a999c9"
      ></span>
      <span
        class="color-span"
        style="left: 60px; z-index: 6; background-color: #d3c3db"
      ></span>
      <span
        class="color-span"
        style="left: 72px; z-index: 5; background-color: #a563ac"
      ></span>
      <span
        class="color-span"
        style="left: 84px; z-index: 4; background-color: #7260af"
      ></span>
    </el-option>
    <el-option :label="$abT('page.homeComponent.sunshine','热情暖阳')" value="rqny">
      {{ $abT('page.homeComponent.sunshine','热情暖阳') }}
      <span
        class="color-span"
        style="left: 12px; z-index: 10; background-color: #ff9090"
      ></span>
      <span
        class="color-span"
        style="left: 24px; z-index: 9; background-color: #d53872"
      ></span>
      <span
        class="color-span"
        style="left: 36px; z-index: 8; background-color: #b91515"
      ></span>
      <span
        class="color-span"
        style="left: 48px; z-index: 7; background-color: #bba588"
      ></span>
      <span
        class="color-span"
        style="left: 60px; z-index: 6; background-color: #ffd54f"
      ></span>
      <span
        class="color-span"
        style="left: 72px; z-index: 5; background-color: #ff9800"
      ></span>
      <span
        class="color-span"
        style="left: 84px; z-index: 4; background-color: #fbe8e1"
      ></span>
    </el-option>
  </el-select>
</template>

<script lang="ts">
  export default {
    name: 'EchartsStyleSelect',
  }
</script>

<style scoped>
  .color-span {
    position: absolute;
    width: 20px;
    height: 20px;
    margin-top: 7px;
    margin-left: 160px;
    background: #999999;
    border-radius: 100%;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.4);
  }
</style>
