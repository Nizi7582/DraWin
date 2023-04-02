<template>
    <div class="relative rounded-lg border border-gray-200 shadow-lg border-2 border-green-500">
        <button
            class="absolute -top-1 -right-1 rounded-full border border-gray-300 bg-gray-100 p-1"
        >
            <span class="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

        </button>

        <div class="flex items-center gap-4 p-4">
            <img
            alt="Women"
            src="https://images.unsplash.com/photo-1611432579699-484f7990b127?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            class="h-12 w-12 rounded-lg object-cover"
            />

            <div>
            <p class="font-medium text-gray-900">Connected</p>

            <p class="line-clamp-1 text-sm text-gray-500">
                You successfully connected !
            </p>
            </div>
        </div>
    </div>

</template>