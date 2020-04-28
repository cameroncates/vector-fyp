<template>
  <div class="container-fluid">
    <!-- Header -->
  <div class="row p-3 bg-dark-2 justify-content-between border-dark-2" ref="header">
    <div>
      <button class="btn-default text-success2 font-weight-bold d-flex"><span class="display-5">&#119249;</span> <span class="align-self-center ml-2">ImgToSVG</span></button>
    </div>
    <div>
      <button class="btn-default font-weight-normal">Login</button>
      <button class="btn-default font-weight-normal">Signup</button>
    </div>

  </div>

  <div class="row" ref="work-area" :style="{height: work_area_height + 'px'}">
    <div class="d-flex col-md-3 p-0">
      <div class="col-md-4 h-100 p-0">
        <button @click="active_tab = 1" class="w-100 pt-4 pb-4 btn-default text-small" :class="active_tab === 1 ? active_classes : '' ">
          <span class="material-icons w-100">publish</span>
          <span class="w-100">Uploads</span>
        </button>
        <button @click="active_tab = 2" class="w-100 pt-4 pb-4 btn-default text-small" :class="active_tab === 2 ? active_classes : '' ">
          <span class="material-icons w-100">favorite</span>
          <span class="w-100">Favorites</span>
        </button>
      </div>
      <div class="col-md-8 bg-dark-2 p-1" ref="uploads-container">
        <p class="p-2 w-100 small text-right" v-if="upload_counts > 0">Upload &#149; <span class="text-success2 font-weight-bold">{{upload_counts}}</span></p>
        <div class="container mt-5" v-if="upload_counts <= 0">
          <p class="w-100 display-4 p-0 m-0 text-center text-success2">&#9432;</p>
          <p class="w-100 small pl-1 pr-1 text-center">Try to uploaded images from your local storage and they will appear here. :)</p>
        </div>
      </div>
    </div>
    <div class="col-md-9  d-flex justify-content-center flex-wrap" ref="workspace-container">
      <div class="align-self-center row" id="workspace" :style="{width: w_width + 'px', height: w_height + 'px'}"></div>
    </div>
  </div>


  
  </div>
</template>

<script>
import vue from 'vue'
import FileUploader from '../components/FileUploader.vue'
import { EventBus } from '@/globals/event-bus.js'
import IMG_FUNC from '@/static/IMG_FUNCTIONS.js'
export default {
  components: {
    FileUploader
  },
  data() {
    return {
      active_tab: 1,
      active_classes: 'text-success2 bg-dark-2 font-weight-bold',
      header: null,
      work_area: null,
      work_space_container: null,
      uploads_container: null,
      work_area_height: 100,
      w_width: 500,
      w_height: 500,
      upload_counts: 0,
      DIP_PROCESS: null
    }
  },
  methods: {
    $component(component, props = null) {
      let ComponentClass = vue.extend(component)
      let instance = new ComponentClass({ propsData: props })
      instance.$mount()
      return instance.$el
    },
    $init() {
      this.uploads_container = $(this.$refs['uploads-container'])
      this.work_area = $(this.$refs['work-area'])
      this.header = $(this.$refs['header'])
      this.work_space_container = $(this.$refs['workspace-container'])
      this.DIP_PROCESS = new IMG_FUNC()
      this.$def_w_h()
    },
    $def_w_h() {

      this.work_area_height = $(window).height() - this.header.outerHeight()
      this.$set_workspace_dim(0.75, 0.75)
    },
    $set_workspace_dim(w, h) {
      this.w_width = (this.work_space_container.outerWidth()) * w
      this.w_height = (this.work_area_height) * h
    },
    $createImg({ src }) {
      let img = $("<img>")
      img.css({
        width: 50 + '%',
      })
      img.attr("src", src)
      img.addClass("border-light-2 p-2")
      this.uploads_container.append(img)
      this.DIP_PROCESS._IMAGE_LOAD(src, (DATA) => {
        console.log(DATA, 'my image data')
      })
      this.upload_counts++
    }
  },
  mounted() {
    this.$init()
    $(window).resize(() => this.$def_w_h())

    let file_uploader = this.$component(FileUploader)
    $('#workspace').append(file_uploader)
    EventBus.$on('$img-uploaded', (payload) => {
      this.$createImg(payload)
    })
  }
}
</script>

<style>
body {
  background: rgba(0, 0, 0, 0.95);
  color: rgba(255, 255, 255, 0.45);
}
#workspace {
  background: rgba(255, 255, 255, 0.015);
  border: 1px dashed rgba(255, 255, 255, 0.25);
}
</style>