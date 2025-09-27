<template>
    <form class="flex flex-col wrap gap-1">
        <!-- Cột 1: Thông tin cá nhân -->
        <h3>Thông tin cá nhân</h3>

        <div class="flex flex-row wrap gap-1">
            <div class="flex flex-col">
                <label for="firstname">Họ và lót</label>
                <input type="text" id="firstname" name="firstname">
            </div>
            <div class="flex flex-col">
                <label for="lastname">Tên</label>
                <input type="text" id="lastname" name="lastname">
            </div>
        </div>

        <!-- Nhóm 2: Giới tính + Ngày sinh -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex flex-col">
                <label for="gender">Giới tính</label>
                <select id="gender" name="gender">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
            </div>
            <div class="flex flex-col">
                <label for="birthday">Ngày sinh</label>
                <input type="date" id="birthday" name="birthday">
            </div>
        </div>

        <!-- Nhóm 3: Căn cước + Ngày cấp -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex flex-col">
                <label for="cityzenID">Căn cước</label>
                <input type="text" id="cityzenID" name="cityzenID">
            </div>
            <div class="flex flex-col">
                <label for="cityzenDate">Ngày cấp</label>
                <input type="date" id="cityzenDate" name="cityzenDate">
            </div>
        </div>

        <!-- Nhóm 4: Số điện thoại + Email -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex flex-col">
                <label for="phone">Số điện thoại</label>
                <input type="text" id="phone" name="phone">
            </div>
            <div class="flex flex-col">
                <label for="email">Địa chỉ email</label>
                <input type="text" id="email" name="email">
            </div>
        </div>

        <!-- Cột 2: Đào tạo -->
        <div class="flex flex-col gap-1">

            <!-- Chứng chỉ -->
            <div>
                <h3>Chứng chỉ</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Số chứng chỉ</th>
                            <th>Tên chứng chỉ</th>
                            <th>Năm cấp</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Số chứng chỉ">1</td>
                            <td data-label="Tên chứng chỉ">1</td>
                            <td data-label="Năm cấp">1</td>
                            <td data-label="Thao tác">
                                <button class="table-action-btn edit">Sửa</button>
                                <button class="table-action-btn delete">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Bằng cấp -->
            <div>
                <h3>Bằng cấp</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Trình độ</th>
                            <th>Tên ngành</th>
                            <th>Năm cấp</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Trình độ">
                                <select name="" id="">
                                    <option value="">A</option>
                                    <option value="">B</option>
                                    <option value="">C</option>
                                </select>
                            </td>
                            <td data-label="Tên ngành">1</td>
                            <td data-label="Năm cấp">1</td>
                            <td data-label="Thao tác">
                                <button class="table-action-btn edit">Sửa</button>
                                <button class="table-action-btn delete">Xóa</button>
                            </td>
                        </tr>
                        <tr>
                            <td data-label="Trình độ">
                                <select name="" id="">
                                    <option value="">A</option>
                                    <option value="">B</option>
                                    <option value="">C</option>
                                </select>
                            </td>
                            <td data-label="Tên ngành">1</td>
                            <td data-label="Năm cấp">1</td>
                            <td data-label="Thao tác">
                                <button class="table-action-btn edit">Sửa</button>
                                <button class="table-action-btn delete">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Học vị -->
            <div>
                <h3>Học vị</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Chức danh</th>
                            <th>Tên ngành</th>
                            <th>Năm bổ nhiệm</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Chức danh">1</td>
                            <td data-label="Tên ngành">1</td>
                            <td data-label="Năm bổ nhiệm">1</td>
                            <td data-label="Thao tác">
                                <button class="table-action-btn edit">Sửa</button>
                                <button class="table-action-btn delete">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>


        <div class="custom-file-upload">
            <label for="cv-upload">
                <span class="label-text">CV của bạn *</span>
                <span class="instruction-text" id="file-name-display">Click để chọn & tải lên CV của bạn</span>
            </label>
            <input type="file" id="cv-upload" accept=".pdf,.doc,.docx" />
        </div>

        <button type="submi" class="bg-primary">NỘP HỒ SƠ</button>
    </form>
</template>


<style scoped>
    form {
        margin: 16px auto;
        max-width: fit-content;

    }

    table {
        width: 100%;
        /* take full width of parent div */
        border-collapse: collapse;
        /* optional, cleaner look */
    }
</style>