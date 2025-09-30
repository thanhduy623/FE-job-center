<template>
    <footer class="w-full flex flex-row justify-evenly">
        <!-- Giới thiệu -->
        <div class="footer-col">
            <h5 v-t="'introduction'"></h5>
            <p v-t="'schoolInfo.introduction'"> </p>
            <div class="flex items-center gap-1 mt-1">
                <!-- Website -->
                <a href="#" target="_blank">
                    <i class="fa-solid fa-globe fa-2x"></i>
                </a>
                <!-- Facebook -->
                <a href="#" target="_blank">
                    <i class="fa-brands fa-facebook fa-2x"></i>
                </a>
                <!-- Gmail -->
                <a href="#">
                    <i class="fa-solid fa-envelope fa-2x"></i>
                </a>
                <!-- Phone -->
                <a href="#">
                    <i class="fa-solid fa-phone fa-2x"></i>
                </a>
            </div>
        </div>

        <!-- Thông tin pháp lý -->
        <div class="footer-col">
            <h5 v-t="'infomation'"></h5>
            <p>{{ $t('tax') }}: {{ $t('schoolInfo.tax') }}</p>
            <p>{{ $t('type') }}: {{ $t('schoolInfo.type') }}</p>
            <p>{{ $t('apply') }}: {{ $t('schoolInfo.year') }}</p>
        </div>

        <!-- Liên hệ -->
        <div class="footer-col">
            <h5 v-t="'contact'"></h5>
            <p>{{ $t('phone') }}: {{ $t('schoolInfo.phone') }}</p>
            <p>Email: info@vietanhschool.edu.vn</p>
            <p>{{ $t('address') }}: {{ $t('schoolInfo.address') }}</p>
        </div>

        <!-- Góp ý -->
        <div class="footer-col">
            <h5 v-t="'feedback'"></h5>
            <p v-t="'schoolInfo.feedback'"> </p>
        </div>
    </footer>
</template>