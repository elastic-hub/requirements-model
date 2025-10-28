<template>
    <div>
        <AppUser v-if="user" />
        <UDropdown v-else disabled :items="items" mode="click" :popper="{ placement: 'bottom-start' }"
            :ui="{ background: 'bg-neutral-200 contrast-[90%] dark:bg-[#10121A]', item: { active: 'bg-bloo saturate-150 dark:bg-bloo/[0.2]' } }">
            <template #item="{ item }">
                <ULink :to="item.to" @click="item.click" target="_blank"
                    class="text-black hover:text-black dark:text-bloo hover:dark:text-bloo flex items-center font-medium">
                    <UIcon :name="item.icon" class="text-2xl mr-2" />
                    {{ item.label }}
                </ULink>
            </template>
            <UIcon name="stash:user-avatar" title="This feature is currently disabled" dynamic
                class="cursor-not-allowed text-3xl -mt-1 hover:text-gray-500 transition-colors duration-200" />
        </UDropdown>
    </div>
</template>


<script setup lang="ts">

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { auth } = useSupabaseClient();

const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
    });

    if (error) {
        console.error(error);
    }
};

const items = [
    [{
        label: 'Login',
        icon: 'i-heroicons-user',
        click: login,
    }],
    [{
        label: 'Create an account',
        icon: 'i-heroicons-user-plus',
        to: 'https://github.com/signup'
    }]
];

</script>