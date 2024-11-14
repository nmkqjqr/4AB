<template>
  <div>
    <ul class="myMods">
      <li
        v-for="mod in myMods"
        :key="mod.path"
        :style="{ background: mod.meta.color || '#909399' }"
      >
        <a v-if="mod.meta.type == 'link'" :href="mod.path" target="_blank">
          <el-icon>
            <component :is="mod.meta.icon || el - icon - menu" />
          </el-icon>
          <p>{{ mod.meta.title }}</p>
        </a>
        <router-link v-else :to="{ path: mod.path }">
          <el-icon>
            <component :is="mod.meta.icon || el - icon - menu" />
          </el-icon>
          <p>{{ mod.meta.title }}</p>
        </router-link>
      </li>
      <li class="modItem-add" @click="addMods">
        <a href="javascript:void(0)">
          <el-icon />
        </a>
      </li>
    </ul>

    <el-drawer
      v-model="modsDrawer"
      destroy-on-close
      :size="570"
      title="添加应用"
    >
      <div class="setMods">
        <h4>我的常用 ( {{ myMods.length }} )</h4>
        <draggable
          v-model="myMods"
          animation="200"
          group="people"
          item-key="path"
          tag="ul"
        >
          <template #item="{ element }">
            <li :style="{ background: element.meta.color || '#909399' }">
              <el-icon>
                <component :is="element.meta.icon || el - icon - menu" />
              </el-icon>
              <p>{{ element.meta.title }}</p>
            </li>
          </template>
        </draggable>
      </div>
      <div class="setMods">
        <h4>全部应用 ( {{ filterMods.length }} )</h4>
        <draggable
          v-model="filterMods"
          animation="200"
          group="people"
          item-key="path"
          :sort="false"
          tag="ul"
        >
          <template #item="{ element }">
            <li :style="{ background: element.meta.color || '#909399' }">
              <el-icon>
                <component :is="element.meta.icon || el - icon - menu" />
              </el-icon>
              <p>{{ element.meta.title }}</p>
            </li>
          </template>
        </draggable>
      </div>
      <template #footer>
        <el-button @click="modsDrawer = false">取消</el-button>
        <el-button type="primary" @click="saveMods">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable,
    },
    data() {
      return {
        mods: [],
        myMods: [],
        myModsName: [],
        filterMods: [],
        modsDrawer: false,
      }
    },
    mounted() {
      this.getMods()
    },
    methods: {
      addMods() {
        this.modsDrawer = true
      },
      getMods() {
        //这里可用改为读取远程数据
        this.myModsName = this.$TOOL.data.get('my-mods') || []
        var menuTree = this.$TOOL.data.get('MENU')
        this.filterMenu(menuTree)
        this.myMods = this.mods.filter((item) => {
          return this.myModsName.includes(item.name)
        })
        this.filterMods = this.mods.filter((item) => {
          return !this.myModsName.includes(item.name)
        })
      },
      filterMenu(map) {
        map.forEach((item) => {
          if (item.meta.hidden) {
            return false
          }
          if (item.meta.type == 'iframe') {
            item.path = `/i/${item.name}`
          }
          if (item.children && item.children.length > 0) {
            this.filterMenu(item.children)
          } else {
            this.mods.push(item)
          }
        })
      },
      saveMods() {
        const myModsName = this.myMods.map((v) => v.name)
        this.$TOOL.data.set('my-mods', myModsName)
        this.$message.success('设置常用成功')
        this.modsDrawer = false
      },
    },
  }
</script>

<style scoped>
  .myMods {
    margin: -10px;
    list-style: none;
  }
  .myMods li {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin: 10px;
    vertical-align: top;
    border-radius: 5px;
    transition: all 0.3s ease;
  }
  .myMods li:hover {
    opacity: 0.8;
  }
  .myMods li a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 10px;
    color: #fff;
    text-align: center;
  }
  .myMods li i {
    font-size: 26px;
    color: #fff;
  }
  .myMods li p {
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
    font-size: 12px;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .modItem-add {
    cursor: pointer;
    border: 1px dashed #ddd;
  }
  .modItem-add i {
    font-size: 30px;
    color: #999 !important;
  }
  .modItem-add:hover,
  .modItem-add:hover i {
    color: #409eff !important;
    border-color: #409eff;
  }

  .setMods {
    padding: 0 20px;
  }
  .setMods h4 {
    font-size: 14px;
    font-weight: normal;
  }
  .setMods ul {
    min-height: 90px;
    margin: 20px -5px;
  }
  .setMods li {
    display: inline-block;
    width: 80px;
    height: 80px;
    padding: 4px;
    padding-top: 15px;
    margin: 5px;
    color: #fff;
    text-align: center;
    vertical-align: top;
    cursor: move;
    border-radius: 3px;
  }
  .setMods li i {
    font-size: 20px;
  }
  .setMods li p {
    margin-top: 10px;
    font-size: 12px;
  }
  .setMods li.sortable-ghost {
    opacity: 0.3;
  }
</style>
