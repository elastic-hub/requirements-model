<template>
  <div :class="ui.megaFooter">
    <img v-if="footer.image.background" :src="footer.image.background" alt="background_image"
      :class="ui.backgroundImg" />
    <div :class="ui.contentContainer">
      <div :class="ui.upperContainer">
        <div :class="ui.contentAboveHr">
          <img :src="footer.image.logo || site.image.logo" alt="logo"
            :title="footer.brand.name.value || site.brand.name.value" :class="ui.logo" />
          <div :title="footer.brand.name.value || site.brand.name.value" :class="ui.branding">
            <b :class="ui.name" :style="{
              fontFamily: footer.brand?.name?.font?.type || site.brand?.name?.font?.type,
              fontSize: footer.brand?.name?.font?.size || site.brand?.name?.font?.size
            }">
              {{ footer.brand.name.value || site.brand.name.value }}
              <ContentRenderer v-if="page && (!footer.brand.name.value || !site.brand.name.value)" :value="page"
                :style="{ fontFamily: footer.content.font.type, fontSize: footer.content.font.size }" />
            </b>
            <b :class="ui.tagline" :title="footer.brand.tagline.value"
              :style="{ fontFamily: footer.brand.tagline.font.type, fontSize: footer.brand.tagline.font.size }">
              {{footer.brand.tagline.value }}
            </b>
          </div>
          <AppSocialLinks :class="ui.socialLinks" />
        </div>
        <hr v-if="page && (footer.brand.name.value || site.brand.name.value)" :class="ui.hr">
      </div>
      <div class="flex mx-auto">
        <ContentRenderer v-if="page && (footer.brand.name.value || site.brand.name.value)" :value="page"
          :style="{ fontFamily: footer.content.font.type, fontSize: footer.content.font.size }" class="mx-auto" />
      </div>
    </div>
  </div>

  <footer :class="ui.footer" v-bind="attrs">
    <UContainer :class="ui.container">
      <div :class="ui.copyrightContainer">
        <span :class="ui.copyright">
          Copyright &copy; &nbsp;<div>{{ year }}</div>
        </span>
        <ClientOnly>
          <!-- <ColorMode :class="ui.colorMode" /> -->
        </ClientOnly>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'

const site = useAppConfig().site
const footer = useAppConfig().footer;

const route = useRoute()
const { data: page } = await useAsyncData("/footer-content", () => {
  return useQueryCollection('localContent').path("/footer-content").first()
})
const date = new Date();
const year = date.getFullYear();

const config = {
  megaFooter: "relative p-6 dark:dark:bg-[#10121A] overflow-hidden bottom-0",
  contentContainer: "relative z-30",
  upperContainer: "container w-[70%] mx-auto",
  contentAboveHr: "flex justify-between items-start",
  backgroundImg: "absolute bottom-0 left-0 w-full opacity-20 object-cover h-full xl:h-auto xl:object-fill object-center z-20",
  logo: "size-[15%] md:size-[10%] lg:size-[7%] pr-3",
  branding: "grid grid-rows-2 font-thin text-white text-center",
  name: "row-start-1 text-3xl sm:text-3xl md:text-3xl lg:text-5xl font-thin text-white text-center",
  tagline: "row-start-2 text-sm sm:text-base md:text-lg lg:text-xl font-thin italic text-white text-center",
  socialLinks: "text-xl sm:text-2xl md:text-3xl space-x-2 pl-3",
  hr: "mx-auto mb-10 mt-5 dark:border-neutral-600",
  megaFooterContent: "text-left z-40",
  footer: "py-1 sm:py-2 bottom-0 w-full bg-background/75 backdrop-blur border-t border-primary/[0.4] dark:border-primary/[0.4] z-50",
  container: "",
  copyrightContainer: "flex justify-center sm:items-center sm:justify-around",
  copyright: "text-sm text-gray-500 sm:text-center dark:text-gray-400 flex items-center",
  colorMode: "",
};

const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    imageBackground?: string;
    class?: any;
  }>(),
  {
    ui: () => ({}),
    imageBackground: '',
    class: undefined,
  },
);

const { ui, attrs } = useUI(
  "footer",
  toRef(props, "ui"),
  config,
  toRef(props, "class"),
  true,
);
</script>