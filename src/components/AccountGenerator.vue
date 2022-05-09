<template>
  <el-row>
    <el-col :span="10">
      <el-input type="textarea" :autosize="{ minRows: 10 }" v-model="input"></el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" icon="el-icon-d-arrow-right" @click="onFilter">Filter</el-button>
    </el-col>
    <el-col :span="10">
      <el-input type="textarea" :autosize="{ minRows: 10 }" v-model="output"></el-input>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Buffer } from 'buffer'
import { ref, defineComponent } from 'vue'
import { blake160 } from '@nervosnetwork/ckb-sdk-utils'

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
      threshold: 12,
      input: '',
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
        let hash = blake160(buf)
        console.log(`Compare account to threshold: ${account} ${hash[0]} ${hash[0] <= this.threshold ? '<=' : '>' } ${this.threshold}`)
        return hash[0] <= this.threshold
      })

      this.output = available_accounts.join('\n')
    }
  }
})
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
