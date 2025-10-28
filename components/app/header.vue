<template>
  <header :class="ui.wrapper">
    <div class="px-8 dark:bg-[#161924]">
      <div :class="ui.container">
        <div :class="ui.left">
          <slot name="left">
            <NuxtLink :to="to" :aria-label="ariaLabel" :class="ui.branding">
              <img :src="header.image.logo || site.image.logo" alt="logo"
                :title="header.brand.name.value || site.brand.name.value" :class="ui.logo" />
              <div class="flex flex-col">
                <div v-if="header.brand.name.value" :class="ui.name" :style="{
                  fontFamily: header.brand?.name?.font?.type || site.brand?.name?.font?.type,
                  fontSize: header.brand?.name?.font?.size || site.brand?.name?.font?.size }">
                  {{ header.brand.name.value || site.brand.name.value }}
                </div>
                <div v-if="header.brand.tagline.value" :class="ui.tagline"
                  :style="{ fontFamily: header.brand.tagline.font.type, fontSize: header.brand.tagline.font.size }">
                  {{ header.brand.tagline.value }}
                </div>
              </div>
            </NuxtLink>
          </slot>
        </div>
        <div :class="ui.centerWrapper">
          <div :class="ui.center">
            <NavMenus :class="ui.menus" :compact="true"/>
            <!-- <NavBreadcrumbs :class="ui.breadcrumbs" class="hidden sm:flex lg:justify-between" /> -->
          </div>
        </div>
        <div :class="ui.right">
          <!-- <AppColorMode :class="ui.colorMode" /> -->
          <AppLogin :class="ui.login" />
          <!-- <AppSocialLinks :class="ui.socialLinks" /> -->
          <NavHamburgerMenu :class="ui.hamburgerMenu" />
        </div>
      </div>
    </div>
    <!-- <hr v-if="route.path !== '/'" :class="ui.hr" /> -->
  </header>
  <NavBreadcrumbs :class="ui.breadcrumbs" class="hidden md:flex justify-center fixed mt-20" />
</template>

<script setup lang="ts">
const route = useRoute();
const header = useAppConfig().header;
const site = useAppConfig().site;

const config = {
  wrapper: "flex flex-col -mb-px sticky top-3 bg-transparent backdrop-blur border rounded-xl dark:bg-[#161924] p-1 ml-5 mr-5 z-50",
  container: "flex items-center gap-3 h-[--header-height]",
  left: "flex items-center gap-1.5",
  branding: "flex flex-row flex-shrink-0 font-bold text-xl text-gray-900 dark:text-white items-center gap-1.5",
  logo: "shrink-0 grow-0 h-16 p-1",
  name: "",
  tagline: "text-sm font-normal contrast-[0.5]",
  centerWrapper: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  center: "hidden xl:flex flex items-center",
  menus: "z-50",
  right: "flex items-center gap-1.5 ml-auto",
  colorMode: "hidden 2xl:flex",
  login: "mr-2 text-base",
  socialLinks: "text-xl hidden 2xl:flex",
  hamburgerMenu: "xl:hidden order-last z-50 cursor-pointer ml-4",
  hr: "mt-1 border-neutral-50/[0.5] dark:border-neutral-700",
  breadcrumbs: "z-40",
  shadow: "text:black dark:text-golden hover:text-black dark:hover:text-golden hover:bg-golden dark:hover:bg-primary-600 rounded-xl p-2",
};

const props = withDefaults(
  defineProps<{
    to?: string;
    title?: string;
    ui?: Partial<typeof config>;
    class?: any;
  }>(),
  {
    to: "/readme",
    title: undefined,
    ui: () => ({}),
    class: undefined,
  },
);

const { ui, attrs } = useUI(
  "header",
  toRef(props, "ui"),
  config,
  toRef(props, "class"),
  true,
);

const ariaLabel = computed(() => (props.title || header.brand.name.value || site.brand.name.value).trim());
</script>