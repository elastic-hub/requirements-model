<template>
    <div v-if="user" class="rounded p-1 flex items-center" @click="isOpen = true">
        <img class="rounded-full w-9 h-9 border-2 border-blue-400" :title="name" :src="profile" />
    </div>

    <USlideover v-model="isOpen">
        <UCard class="flex flex-col flex-1"
            :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                        <div>{{ name }}</div>
                        <div class="text-xs dark:text-neutral-500">{{ username }}</div>
                    </div>
                    <NuxtLink :to="`https://github.com/${username}`" target="_blank">
                        <img class="rounded-full w-9 h-9" :title="name" :src="profile" />
                    </NuxtLink>
                </div>
            </template>

            <div class="h-full px-1 py-2">
                <div class="overflow-hidden border rounded-lg border-gray-200 dark:border-gray-700">
                    <table class="min-w-full text-xs">
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr>
                                <td class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                                    Organization
                                </td>
                                <td class="px-4 py-3">
                                    <NuxtLink :to="`https://github.com/${org}`" target="_blank" class="not-prose">
                                        {{ org }}
                                    </NuxtLink>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                                    Repository
                                </td>
                                <td class="px-4 py-3">
                                    <NuxtLink :to="`https://github.com/${org}/${repo}`" target="_blank"
                                        class="not-prose">
                                        {{ repo }}
                                    </NuxtLink>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                                    Team/Role
                                    <UIcon name="mdi:information-variant-circle" dynamic
                                        title="Depending on your Team/Role, certain functions will be unavailable"
                                        class="text-sm align-top" />
                                </td>
                                <td class="px-4 py-3 text-gray-800 dark:text-gray-200">
                                    <ul>
                                        <li v-for="(member, index) in teamMember" :key="index">
                                            {{ member }}
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <template #footer>
                <div class="flex items-center justify-end">
                    <button class="text-sm underline text-neutral-500 hover:text-neutral-400 flex items-center"
                        @click="logout">
                        <UIcon name="mynaui:logout-solid" dynamic />
                        Log out
                    </button>
                </div>
            </template>
        </UCard>
    </USlideover>
</template>

<script setup lang="ts">
import { useGitHubTeamCheck } from '~/composables/github/team'

const isOpen = ref(false)
const route = useRoute();
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const { org, repo } = useAppConfig().middleware.auth.github

const logout = async () => {
    const { error } = await auth.signOut();

    if (error) {
        console.error(error);
        return;
    }

    try {
        await $fetch('/api/_supabase/session', {
            method: 'POST',
            body: { event: 'SIGNED_OUT', session: null },
        });
        user.value = null;
    } catch (e) {
        console.error(e);
    }

    // Force full page reload
    window.location.reload();
};

const name = computed(
    () => user.value?.user_metadata.full_name
);
const username = computed(
    () => user.value?.user_metadata.user_name
);
const profile = computed(
    () => user.value?.user_metadata.avatar_url
);

// const teamMember = await useGitHubTeamCheck(username.value)
</script>