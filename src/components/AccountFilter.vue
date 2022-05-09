<template>
  <el-row>
    <el-col :span="24">
      Threshold: <el-input-number v-model="threshold"></el-input-number>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="10">
      <el-input type="textarea" :autosize="{ minRows: 10 }" v-model="input"></el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" :icon="ArrowRightBold" @click="onFilter">Filter</el-button>
    </el-col>
    <el-col :span="10">
      <el-input type="textarea" :autosize="{ minRows: 10 }" v-model="output"></el-input>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ArrowRightBold } from '@element-plus/icons-vue'
</script>

<script lang="ts">
import { Buffer } from 'buffer'
import { ref, defineComponent } from 'vue'
import { ckbSdkUtils } from 'lib/ckb'

export default defineComponent({
  name: 'AccountFilter',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      threshold: 2362232012,
      input: ``,
      output: '',
    }
  },
  methods: {
    onFilter () {
      let accounts = this.input.split('\n')
      let available_accounts = accounts.filter((account) => {
        if (account == '') {
          return false
        }

        let buf = Buffer.from(account)
        let personal = Buffer.from('2021-07-22 12:00')
        let hasher = ckbSdkUtils.blake2b(32, null, null, personal)
        hasher.update(buf)
        let hash = hasher.digest('binary') as Uint8Array
        let first4Bytes = Buffer.from(hash.slice(0, 4)) as Buffer
        let lucky_num = first4Bytes.readUInt32BE()
        console.log(`Compare account to threshold: ${account} ${lucky_num} ${lucky_num <= this.threshold ? '<=' : '>' } ${this.threshold} hash[0..4]:`, first4Bytes)
        return lucky_num <= this.threshold
      })

      this.output = available_accounts.join('\n')
    }
  }
})
</script>

<style scoped>
.verticle-center {
  display: flex;
}
</style>
