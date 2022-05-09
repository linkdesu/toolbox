<template>
  <el-row>
    <el-col :span="24">
      <el-form ref="form" :model="form" label-position="top">
        <el-form-item label="Chain ID">
          <el-input v-model="form.chainId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-alert type="warning">
            1. The chain ID must be the same with the chain in metamask,
            otherwise you will not be able to sign.<br />
            2. The chain ID will replace MM_JSON.domain.chainID .
          </el-alert>
        </el-form-item>
        <el-form-item label="Digest">
          <el-input
            v-model="form.digest"
            placeholder="Calculated by CKB signature process"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-alert type="warning">
            The digest will replace MM_JSON.message.digest .
          </el-alert>
        </el-form-item>
        <el-form-item label="Typed Data V4">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            v-model="form.typed_data_json"
            placeholder="AKA MM_JSON, calculated by metamask"
          ></el-input>
        </el-form-item>
        <el-form-item label="Hash of Typed Data V4">
          <el-input
            readonly
            v-model="form.typed_data_hash"
            placeholder="AKA MM_HASH, calculated by metamask"
          ></el-input>
        </el-form-item>
        <el-form-item label="Signature">
          <el-input readonly v-model="form.signature"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-d-arrow-right" @click="onSign"
            >Sign</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { ethSigUtil } from 'lib/eth'

const { TypedDataUtils, SignTypedDataVersion } = ethSigUtil

export default defineComponent({
  name: "EIP712Tester",
  data() {
    return {
      form: {
        chainId: "",
        digest: "",
        typed_data_json: "",
        typed_data_hash: "",
        signature: "",
      },
    };
  },
  methods: {
    async onSign() {
      if (typeof window.ethereum == null) {
        console.error("Metamask not init.");
        return;
      }
      const web3 = window.ethereum;
      let accounts;
      try {
        accounts = await web3.request({ method: "eth_requestAccounts" });
        console.log(accounts);
      } catch (e) {
        console.error(e);
      }

      let typed_data_json;
      try {
        let data = JSON.parse(this.form.typed_data_json);
        data.message["digest"] = this.form.digest;
        data.domain["chainId"] = parseInt(this.form.chainId);

        this.form.typed_data_hash =
          "0x" +
          TypedDataUtils.eip712Hash(
            data as any,
            SignTypedDataVersion.V4
          ).toString("hex");

        typed_data_json = JSON.stringify(data, null, "  ");
      } catch (e) {
        console.error(e);
      }

      console.log(typed_data_json);
      try {
        let signature = await web3.request({
          method: "eth_signTypedData_v4",
          params: [accounts[0], typed_data_json],
          from: accounts[0],
        });
        this.form.signature = signature;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
</script>
