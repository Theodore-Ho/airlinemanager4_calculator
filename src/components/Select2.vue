<template>
  <select></select>
</template>

<script>
import $ from "jquery";
import "select2/dist/js/select2.js";
import "select2/dist/css/select2.min.css";

export default {
  props: ["options", "value"],
  mounted() {
    const vm = this;
    $(this.$el)
        .select2({ data: this.options })
        .val(this.value)
        .trigger("change")
        .on("change", function () {
          vm.$emit("input", this.value);
        });
  },
  watch: {
    value(value) {
      $(this.$el).val(value).trigger("change");
    },
    options(options) {
      $(this.$el)
          .empty()
          .select2({ data: options });
    },
  },
  beforeDestroy() {
    $(this.$el).off().select2("destroy");
  },
};
</script>
