<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="1"
        class="el-menu-demo"
        mode="horizontal"
      >
        <el-menu-item :index="1">
          <router-link to="/">Home</router-link>
        </el-menu-item>
        <el-menu-item :index="2">
          <router-link to="/account-filter">Account Filter</router-link>
        </el-menu-item>
        <el-menu-item :index="3">
          <router-link to="/address-converter">Address Converter</router-link>
        </el-menu-item>
        <el-menu-item :index="4">
          <router-link to="/data-converter">Data Converter</router-link>
        </el-menu-item>
        <el-menu-item :index="5">
          <router-link to="/cell-size-calculator"
            >Cell Size Calculator</router-link
          >
        </el-menu-item>
        <el-menu-item index="6">
          <router-link to="/eip712-tester">EIP712 Tester</router-link>
        </el-menu-item>
      </el-menu>
    </el-header>

    <el-main>
      <!--  <img alt="Vue logo" src="./assets/logo.png" />-->
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
</script>
