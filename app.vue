<template>
  <div class="flex flex-col w-full min-h-screen dark:!bg-[#10121A]">
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <AppHeader />
      <NuxtPage class="mt-5 flex-grow" />
      <AppFooter class="mt-auto" />
    </NuxtLayout>
    <UModals />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth !important;
  scroll-padding-top: 16rem;
}

h1 {
  font-size: var(--h1-font-size);
  font-family: var(--h1-font-type);
}

h2 {
  font-size: var(--h2-font-size);
  font-family: var(--h2-font-type);
}

h3 {
  font-size: var(--h3-font-size);
  font-family: var(--h3-font-type);
}

h4 {
  font-size: var(--h4-font-size);
  font-family: var(--h4-font-type);
}

h5 {
  font-size: var(--h5-font-size);
  font-family: var(--h5-font-type);
}

h6 {
  font-size: var(--h6-font-size);
  font-family: var(--h6-font-type);
}

/* Dark HTML elements */
.dark .par,
/* custom class for paragraph located in /[...slug].vue */
.dark em,
.dark ul,
.dark ol,
.dark td,
.dark th {
  color: theme('colors.white');
}

.dark b {
  color: theme('colors.white');
  filter: saturate(2.8) brightness(0.75);
}

.dark strong {
  color: theme('colors.white');
  filter: saturate(3) brightness(0.75);
}

.dark h1,
.dark h2,
.dark h3 {
  color: theme('colors.white');
  filter: saturate(3) brightness(0.8);
}

.dark h4,
.dark h5,
.dark h6 {
  color: theme('colors.white');
  filter: saturate(3) brightness(0.75);
}

/* End of Dark HTML elements */

/* Links */
.prose a {
  text-decoration: none !important;
}

a:hover {
  color: theme('colors.blue.700');
}

.dark a {
  color: theme('colors.blue.100');
  text-decoration: none;
}

.dark a:hover {
  color: theme('colors.blue.50');
}

/* End of Links */

/* CodeBlock */
code {
  border: 3px solid #dcdcdc;
  border-radius: 6px;
  background-color: #dcdcdc;
  padding: 2px 6px;
  position: relative;
}

code::before,
code::after {
  content: '';
  display: none;
}

.dark code {
  border: 3px solid #414141;
  border-radius: 6px;
  background-color: #414141;
  padding: 2px 6px;
  color: #ffffff;
}

pre code {
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  box-shadow: none;
}

.dark pre code {
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  box-shadow: none;
  color: theme('colors.golden');
}

.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease-in-out;
}

.copy-btn:hover {
  opacity: 1;
}

pre {
  position: relative;
  padding-top: 2.5rem;
  /* Extra space for the button */
}

/* End of CodeBlock */

/* Blockquote */
.light blockquote {
  background-color: theme('colors.neutral.200');
  border-radius: 10px;
  padding: 1rem;
  border-left: 4px solid #858585;
  color: #333;
  font-style: italic;
}

.light blockquote p {
  margin: 0;
}

.dark blockquote {
  background-color: theme('colors.neutral.700');
  border-radius: 10px;
  padding: 1rem;
  border-left: 4px solid #ccc;
  margin: 1.5rem 0;
  font-style: italic;
}

.dark blockquote p {
  margin: 0;
  color: white;
}

/* End of Blockquote */

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
}

th:first-child,
td:first-child {
  padding-left: 1em;
}

th:first-child {
  border-top-left-radius: 0.6rem;
}

th:last-child {
  border-top-right-radius: 0.6rem;
}

th,
td {
  border-bottom: 1px solid #ddd;
  padding: 8px;
  font-size: 20px;
  text-align: left;
}

th {
  background-color: theme('colors.zinc.200');
}

th,
td {
  border-left: none;
  border-right: none;
}

.dark th {
  background-color: theme('colors.zinc.700');
  color: #f2f2f2;
}

/* End of Table */
</style>
