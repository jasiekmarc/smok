<template>
  <div class="gadget-settings">
    <div class="col">
      <h3>Gems colour</h3>
      <div v-for="c in allCols" :key="c" class="form-check">
        <input
          type="radio"
          v-model="attributes.colour"
          :value="c"
          :id="`out-col-${c}`"
        />
        <label :class="`gem gem-${c}`" :for="`out-col-${c}`"></label>
      </div>
    </div>
    <div class="col">
      <h3>Gems Quantity</h3>
      <div class="form-check-inline">
        <input
          type="radio"
          v-model="inType"
          value="number"
          id="in-type-number"
        />
        <label for="in-type-number">Amount:</label>
      </div>
      or
      <div class="form-check-inline">
        <input type="radio" v-model="inType" value="other" id="in-type-other" />
        <label for="in-type-other">Same as:</label>
      </div>
      <input
        name="count"
        type="number"
        v-model="attributes.count"
        v-if="inType == 'number'"
      />
      <div v-else v-for="c in allCols" :key="c" class="form-check-inline">
        <input
          type="radio"
          v-model="attributes.count"
          :value="c"
          :id="`in-same-${c}`"
        />
        <label :class="`gem gem-${c}`" :for="`in-same-${c}`"></label>
      </div>
    </div>
    <button type="button" class="close" @click="$emit('close')"></button>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BasketAttributes, GemColour } from "@/level";
@Options({
  props: {
    attributes: Object,
    allCols: Array,
  },
  emits: ["update:attributes", "close"],
})
export default class BasketSettings extends Vue {
  attributes!: BasketAttributes;
  allCols!: GemColour[];
  inType: "number" | "other" = "number";
}
</script>
<style lang="scss">
.gadget-settings {
  position: relative;
  background: var(--secondary-light);
  max-width: min(576px, 90vh);
  margin: 3em auto;
  padding: 1em;

  display: flex;
  flex-wrap: wrap;

  .col {
    flex: 1 0 0%;
    width: 100%;
    max-width: 100%;
  }
}

.form-check {
  display: block;
}

.form-check-inline {
  display: inline-block;
  margin-right: 1rem;
}

select,
input {
  margin: 1em;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  padding: 0.75rem 1.25rem;
  color: inherit;

  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
  &::after {
    content: "×";
  }

  // Override <a>'s hover style
  &:hover {
    color: #000;
    text-decoration: none;
  }

  &:not(:disabled):not(.disabled) {
    &:hover,
    &:focus {
      opacity: 0.75;
    }
  }
}

// stylelint-disable-next-line selector-no-qualifying-type
button.close {
  background-color: transparent;
  border: 0;
}
</style>
