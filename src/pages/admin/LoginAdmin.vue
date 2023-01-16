<template>
    <div class="login-main">
        <div class="login-card">
            <div class="column">
                <h1>登录</h1>
                <el-form ref="ruleFormRef" :label-position="labelPosition" :rules="rules" label-width="100px" :model="formLabelAlign" style="max-width: 460px">
                    <el-form-item prop="userName" label="Name" style="margin-top: 50px">
                        <el-input v-model="formLabelAlign.userName" placeholder="用户名" clearable />
                    </el-form-item>
                    <el-form-item prop="userPassword" label="Password" style="margin-top: 50px">
                        <el-input v-model="formLabelAlign.userPassword" type="password" placeholder="密码" show-password @keyup.enter="logins" />
                    </el-form-item>
                    <el-form-item label="" style="margin-top: 50px">
                        <el-button :loading="loading" @click="logins">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="column">
                <h2>YOUNG ADMIN</h2>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup name="LoginAdmin">
import { ref, reactive } from 'vue';
import { debounce } from 'lodash-es';
import type { FormInstance, FormRules } from 'element-plus';
const labelPosition = ref('right');
const ruleFormRef = ref<FormInstance>();
const loading = ref<boolean>(false);

const rules = reactive<FormRules>({
    userName: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
        }
    ],
    userPassword: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        }
    ]
});

const formLabelAlign = reactive({
    userPassword: '',
    userName: ''
});

const handleLogin = async () => {
    loading.value = true;
    await ruleFormRef.value?.validate();
    loading.value = false;
};
const logins = debounce(() => {
    handleLogin();
}, 500);
</script>
<style scoped lang="scss">
$theme-color: #010101;

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
}
.login-main {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1.5rem;

    &:after {
        content: '';
        position: fixed;
        inset: 0;
        background-color: $theme-color;
        width: 60%;
        height: 100vh;
        clip-path: polygon(0 100%, 0 0, 100% 0, 70% 100%);
        z-index: -1;
    }
}
.login-card {
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 10px 50px -30px black;
    width: 1200px;
    border-radius: 30px;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto auto;

    a {
        text-decoration: none;
        color: $theme-color;
    }

    .column {
        padding: 4rem;

        &:last-child {
            background: url('../../assets/static/img/loginAdmin.jpg') center;
            background-size: cover;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 40px;

            &:after {
                content: '';
                position: absolute;
                background: linear-gradient(90deg, white, #ffffff22);
                inset: 0;
            }

            * {
                z-index: 1;
            }

            a {
                display: inline-block;
                padding: 12px 30px;
                font-size: 16px;
                border: 2px solid $theme-color;
                color: black;
                border-radius: 50px;
                cursor: pointer;
                transition: all;
                font-weight: 600;

                &:hover {
                    background-color: $theme-color;
                    color: white;
                }
            }
        }

        &:last-child {
            text-align: center;
        }
    }

    h1 {
        margin-bottom: 15px;
    }

    .form-element,
    :deep(.el-input .el-input--suffix .el-input__wrapper .el-input__inner) {
        width: 100% !important;
        border: none !important;
        background-color: white !important;
        padding: 20px 30px !important;
        font-size: 18px !important;
        border-radius: 50px !important;
        transition: box-shadow 0.2s !important;

        &:focus {
            outline: none;
            box-shadow: 0 0 0 2px $theme-color;
        }
    }

    input[type='checkbox'] {
        accent-color: $theme-color;
        width: 16px;
        height: 16px;
    }

    form {
        margin-top: 3rem;

        & > * {
            margin-top: 1rem;
        }

        button {
            background-color: $theme-color;
            color: white;
            border: none;
            padding: 20px 40px;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            font-size: 18px;
            transition: all 0.2s;

            &:active {
                scale: 0.95;
                background-color: darken($theme-color, 10%);
            }
        }

        .form-check-item {
            display: flex;
            align-items: end;
            gap: 0.7rem;
            margin-left: 5px;
        }
    }
}

.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.social-buttons {
    display: flex;
    gap: 1rem;

    a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border-radius: 50px;
        font-size: 22px;
        color: white;
        background-color: green;

        &.wechat {
            background-color: #06ca5c;
        }

        &.twitter {
            background-color: #55acee;
        }

        &.github {
            background-color: #111;
        }

        &:hover {
            scale: 0.95;
        }
    }
}

//响应式布局
@media (max-width: 992px) {
    .login-card {
        display: block;
        width: 500px;
        text-align: center;

        .column {
            &:last-child {
                display: none;
            }
        }
    }

    .flex {
        flex-direction: column;
        gap: 1rem;
    }

    .social-buttons {
        justify-content: center;
    }
}
</style>
