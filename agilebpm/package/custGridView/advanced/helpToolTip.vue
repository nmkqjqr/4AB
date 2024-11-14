<template>
  <el-tooltip placement="right" popper-class="singleton-tooltip">
    <template #content>
      <p class="tooltipp mb8">
        您可以输入${xxx}作为参数变量,xxx参数可以从url地址传入,也可以从查询栏传入,优先使用查询栏的参数,例如
      </p>
      <p class="tooltipp mb8">
        SELECT t1.`id` AS t1id,t1.`mz` AS t1mz FROM test t1 where t1.user_id =
        '${currentUserId}'
      </p>
      <p class="tooltipp mb8">
        ${currentUserId}：当前用户ID；${currentUserName}：当前用户名（字符串）；${currentUserAccount}：当前用户账号（字符串）
        ；${currentOrgId}：当前用户组织ID（字符串）；${currentOrgName}：当前用户组织名（字符串）；${currentOrgCode}：当前用户组织code（字符串）
        ；${curTime}：当前时间（字符串，HH:mm:ss）；${curDate}：当前时间（字符串，
        yyyy-MM-dd）；${curDateTime}：当前时间（字符串，yyyy-MM-dd
        HH:mm:ss）；${currentDateTime}：当前时间（日期Date类型）；
      </p>
      <p class="tooltipp">注意：</p>
      <p class="tooltipp redColor">1. 尽量不要使用*全表查询</p>
      <p class="tooltipp redColor">
        2. 字段最好取一个别名,如果觉得麻烦可以点击添加别名按钮
      </p>
      <p class="tooltipp redColor">3. ${xx}需要用单双引号包裹</p>
      <p class="tooltipp redColor">4. 只能支持select查询</p>
      <p class="tooltipp redColor">5. 数据库字段备注规则如下</p>
      <p class="tooltipp pl16 redColor">
        5.1 备注 xxx 1:下拉项1,2:下拉项2,3:下拉项3 则会自动解析成下拉框控件
      </p>
      <p class="tooltipp pl16 redColor">
        5.2 备注 xxx dic:xxxx 则会自动解析成数据字典控件
      </p>
      <p class="tooltipp pl16 redColor">
        5.3 如果是date类型 则自动解析成日期控件 并且格式化参数为 yyyy-MM-dd
      </p>
      <p class="tooltipp pl16 redColor">
        5.4 如果是datetime类型 则自动解析成日期控件 并且格式化参数为 yyyy-MM-dd
        HH:mm:ss
      </p>
    </template>
    <el-button style="margin: 0 6px 0 0" type="primary">帮助</el-button>
  </el-tooltip>
</template>

<script lang="ts" setup></script>
