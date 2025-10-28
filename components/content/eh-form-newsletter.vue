<template>
    <div id="contact-us-form">
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'
  
  onMounted(() => {
    const script = document.createElement('script')
    script.src = "//js.hsforms.net/forms/embed/v2.js"
    script.type = "text/javascript"
    script.charset = "utf-8"
    
    script.onload = () => {
      window.hbspt.forms.create({
        region: "na1",
        portalId: "21247113",
        formId: "56969656-646b-423d-98af-133ab4c4e2dd",
        target: "#contact-us-form"
      })
    }
  
    document.body.appendChild(script)
  })
  </script>
  