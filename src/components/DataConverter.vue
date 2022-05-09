<template>
  <el-form ref="form" :model="form" label-position="top">
    <!-- Hex -->
    <el-row :gutter="20">
      <el-col :span="11">
        <el-form-item label="Hex">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            v-model="form.hex"
            @input="onInputHex"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col class="center-icon" :span="2">
        <i class="el-icon-refresh"></i>
      </el-col>
      <el-col :span="11">
        <el-form-item label="Bytes in Uint8Array">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            v-model="form.bytes"
            @input="onInputBytes"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- LE -->
    <el-row :gutter="20">
      <el-col :span="11">
        <el-form-item label="LE Hex">
          <el-input v-model="form.leHex" @input="onInputLeHex"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="center-icon" :span="2">
        <i class="el-icon-refresh"></i>
      </el-col>
      <el-col :span="11">
        <el-form-item label="Decimal">
          <el-input v-model="form.decimal" @input="onInputDecimal"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- BE -->
    <el-row :gutter="20">
      <el-col :span="11">
        <el-form-item label="BE Hex">
          <el-input v-model="form.beHex" @input="onInputLeHex"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="center-icon" :span="2">
        <i class="el-icon-refresh"></i>
      </el-col>
      <el-col :span="11">
        <el-form-item label="Decimal">
          <el-input v-model="form.decimal" @input="onInputDecimal"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Buffer } from "buffer";
import { hexToBuf } from '~/util';

export default defineComponent({
  name: "DataConverter",
  props: {},
  data() {
    return {
      form: {
        hex: "",
        bytes: "",
        leHex: "",
        beHex: "",
        decimal: "",
      },
    };
  },
  methods: {
    onInputHex() {
      console.log("hex:", this.form.hex);
      let buf = hexToBuf(this.form.hex);

      let bytes = [];
      for (const byte of new Uint8Array(buf)) {
        bytes.push(byte);
      }

      this.form.bytes = JSON.stringify(bytes);
    },
    onInputBytes() {
      console.log("bytes:", this.form.bytes);
      let bytes;
      try {
        bytes = JSON.parse(this.form.bytes);
      } catch (e) {
        console.error(e);
        return;
      }
      let buf = Buffer.from(bytes);

      this.form.hex = buf.toString("hex");
    },
    onInputLeHex() {
      console.log("LE Hex:", this.form.leHex);
      let buf = hexToBuf(this.form.leHex);

      switch (buf.length) {
        case 4:
          this.form.decimal = buf.readUInt32LE().toString();
          break;
        case 8:
          this.form.decimal = buf.readBigUInt64LE().toString();
          break;
        default:
          console.error("Unsupported length");
      }
    },
    onInputBeHex() {
      console.log("LE Hex:", this.form.leHex);
      let buf = hexToBuf(this.form.leHex);

      switch (buf.length) {
        case 4:
          this.form.decimal = buf.readUInt32BE().toString();
          break;
        case 8:
          this.form.decimal = buf.readBigUInt64BE().toString();
          break;
        default:
          console.error("Unsupported length");
      }
    },
    onInputDecimal() {
      console.log("Decimal:", this.form.decimal);

      let num = parseInt(this.form.decimal);

      let bufLe = Buffer.alloc(4);
      bufLe.writeUInt32LE(num, 0);
      this.form.leHex = bufLe.toString("hex");

      let bufBe = Buffer.alloc(4);
      bufBe.writeUInt32BE(num, 0);
      this.form.beHex = bufBe.toString("hex");
    },
  },
});
</script>

<style scoped>
.el-row > .el-col.center-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
