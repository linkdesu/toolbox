<template>
  <el-row>
    <el-col :span="24">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Cell">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            v-model="form.cell"
            @input="onInputCell"
          ></el-input>
        </el-form-item>
        <el-form-item label="Size">
          <el-input readonly v-model="form.size"></el-input>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";

function hex_data_occupied_bytes(hex_string: any) {
  // Exclude 0x prefix, and every 2 hex digits are one byte
  return (hex_string.length - 2) / 2;
}

function script_occupied_bytes(script: any) {
  if (script !== undefined && script !== null) {
    return (
      1 +
      hex_data_occupied_bytes(script.code_hash) +
      hex_data_occupied_bytes(script.args)
    );
  }
  return 0;
}

function cell_occupied_bytes(cell: any) {
  console.log(cell);

  let lockSize = cell.lock ? script_occupied_bytes(cell.lock) : 0;
  let typeSize = cell.type ? script_occupied_bytes(cell.type) : 0;
  let dataSize = cell.data ? hex_data_occupied_bytes(cell.data) : 0;

  return 8 + lockSize + typeSize + dataSize;
}

export default defineComponent({
  name: "CellSizeCalculator",
  props: {},
  data() {
    return {
      form: {
        cell: "",
        size: 0,
      },
    };
  },
  methods: {
    onInputCell() {
      console.log("dell:", this.form.cell);

      let cell;
      try {
        cell = JSON.parse(this.form.cell);
      } catch (e) {
        console.error(e);
        return;
      }

      this.form.size = cell_occupied_bytes(cell);
    },
  },
});
</script>
