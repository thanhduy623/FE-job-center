<template>
    <footer class="w-full flex flex-row justify-between items-center p-2 bg-primary">
        <div class="flex-1 text-left text-sm">
            {{ $t('schoolInfo.developedBy') }}: IT {{ $t('schoolInfo.shortname') }}
        </div>

        <div class="flex-1 text-center text-sm">
            {{ $t('schoolInfo.contactSuport') }}:
            <span class="font-medium">info@vietanhschool.edu.vn</span>
        </div>

        <div class="flex-1 text-right text-sm">
            © {{ new Date().getFullYear() }} {{ $t('schoolInfo.shortname') }}
        </div>
    </footer>
</template>