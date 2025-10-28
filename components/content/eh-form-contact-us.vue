<template>
  <div id="hubspot-form"></div>
</template>

<script setup lang="ts">

onMounted(() => {
  // Add HubSpot embed script
  const script = document.createElement('script');
  script.src = '//js.hsforms.net/forms/embed/v2.js';
  script.charset = 'utf-8';
  script.type = 'text/javascript';

  // Append the script to the document head
  document.head.appendChild(script);

  // Once the script is loaded, initialize the form
  script.onload = () => {
    // Ensure hbspt exists after script is loaded
    if (window.hbspt) {
      window.hbspt.forms.create({
        region: 'na1',
        portalId: '21247113',
        formId: 'c9bf8828-7520-4e8c-987b-70fe763e77eb',
        target: '#hubspot-form',
      });
    }
  };
});
</script>
