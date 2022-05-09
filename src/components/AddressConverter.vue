<template>
  <el-row>
    <el-col :span="24">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Network">
          <el-select v-model="form.network" style="float: left">
            <el-option
              v-for="item in networks"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Full Address">
          <el-input
            v-model="form.fullAddress"
            @input="onInputFullAddress"
          ></el-input>
        </el-form-item>
        <el-form-item label="Short Address">
          <el-input
            v-model="form.shortAddress"
            @input="onInputShortAddress"
          ></el-input>
        </el-form-item>
        <el-form-item label="Script">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            v-model="form.script"
            @input="onInputScript"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ckbSdkUtils, resultFormatter } from 'lib/ckb'

const {
  AddressPrefix,
  AddressType,
  bech32Address,
  scriptToAddress,
  addressToScript,
  systemScripts,
} = ckbSdkUtils;

export default defineComponent({
  name: "AddressConverter",
  props: {},
  data() {
    return {
      networks: [
        { label: "Lina(Mainnet)", value: "mainnet" },
        { label: "Aggron(Testnet)", value: "testnet" },
      ],
      form: {
        network: "mainnet",
        fullAddress: "",
        shortAddress: "",
        script: "",
      },
    };
  },
  methods: {
    onInputFullAddress() {
      console.log("full address:", this.form.fullAddress);

      let script;
      try {
        script = addressToScript(this.form.fullAddress);
        script = {
          code_hash: script.codeHash,
          hash_type: script.hashType,
          args: script.args,
        };
      } catch (e) {
        return;
      }

      console.log("script:", script);

      this.form.shortAddress = this.scriptToShortAddress(script);
      this.form.script = JSON.stringify(script, null, "  ");
    },
    onInputShortAddress() {
      console.log("short address:", this.form.shortAddress);

      let script;
      try {
        script = addressToScript(this.form.shortAddress);
        script = {
          code_hash: script.codeHash,
          hash_type: script.hashType,
          args: script.args,
        };
      } catch (e) {
        console.log(e);
        return;
      }

      console.log("script:", script);

      this.form.fullAddress = this.scriptToFullAddress(script);
      this.form.script = JSON.stringify(script, null, "  ");
    },
    onInputScript() {
      console.log("script:", this.form.script);
      let script;
      try {
        script = JSON.parse(this.form.script);
      } catch (e) {
        return;
      }

      console.log(script);
      this.form.fullAddress = this.scriptToFullAddress(script);
      this.form.shortAddress = this.scriptToShortAddress(script);
      this.form.script = JSON.stringify(script, null, "  ");
    },
    scriptToFullAddress(script: RPC.Script) {
      const compScript = resultFormatter.toScript(script);
      return scriptToAddress(compScript, this.form.network === "mainnet");
    },
    scriptToShortAddress(script: RPC.Script) {
      let codeHashIndex;
      switch (script.code_hash) {
        case systemScripts.SECP256K1_BLAKE160.codeHash:
          codeHashIndex = "0x00";
          break;
        case systemScripts.SECP256K1_MULTISIG.codeHash:
          codeHashIndex = "0x01";
          break;
        case systemScripts.ANYONE_CAN_PAY_MAINNET.codeHash:
        case systemScripts.ANYONE_CAN_PAY_TESTNET.codeHash:
          codeHashIndex = "0x02";
          break;
        default:
          return "";
      }

      return bech32Address(script.args, {
        prefix:
          this.form.network === "mainnet"
            ? AddressPrefix.Mainnet
            : AddressPrefix.Testnet,
        type: AddressType.HashIdx, // This is special for short addresses
        codeHashOrCodeHashIndex: codeHashIndex,
      });
    },
  },
});
</script>
