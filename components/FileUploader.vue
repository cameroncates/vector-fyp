<template>
  <div class="container text-center align-self-center">
      <input type="file" name="" id="" ref="upload-input" class="d-none">
      <!-- <button  ref="upload-btn">Choose a file</button> -->
      <button class="btn-default" ref="upload-btn"><i class="material-icons text-success2 text-xl">add_photo_alternate</i></button>
      <p class="small p-0 m-0">Click here to add an Image</p>
  </div>
</template>

<script>
import { EventBus } from '@/globals/event-bus.js'
export default {
    data() {
        return {
            upload_btn: null
        }
    },
    methods: {
        $readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();        
                reader.onload = function(e) {
                    EventBus.$emit('$img-uploaded', { src: e.target.result} )
                    // console.log(e.target.result, 'my final image')
                }                
                reader.readAsDataURL(input.files[0]);
            }            
        }
    },
    mounted() {
        let $this = this
        let upload_input = $(this.$refs['upload-input'])
        this.upload_btn = $(this.$refs['upload-btn'])

        this.upload_btn.click(() => upload_input.click())

        upload_input.change(function() {
            $this.$readURL(this)
        })
    }
}
</script>

<style>

</style>