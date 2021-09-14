<template>
  <div class="field" :class="classList">
    <span
      class="dragon"
      v-if="dragon !== undefined"
      :class="`rotate-${dragon.direction}`"
    ></span>
    <span class="availability" v-if="availability !== undefined">{{
      availability
    }}</span>
  </div>
</template>
<script lang="ts">
import { Dragon, Gadget, gadgetDirection, gadgetType } from "@/level";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    gadget: String,
    dragon: Object,
    availability: Number,
  },
})
export default class Field extends Vue {
  gadget!: Gadget;
  dragon!: Dragon | undefined;
  availability!: number | undefined;

  get classList(): string[] {
    let classes: string[] = [];

    classes.push(gadgetType(this.gadget).toLowerCase());
    if (gadgetDirection(this.gadget) !== undefined) {
      classes.push(`rotate-${gadgetDirection(this.gadget)}`);
    }
    if (this.availability !== undefined && this.availability > 0) {
      classes.push("available");
    }
    return classes;
  }
}
</script>
<style lang="scss">
.field {
  border: 1px var(--primary-dark) solid;
  background: var(--primary);
  width: 100px;
  height: 100px;

  // Center horizontally and vertically.
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  font-size: 50px;
  font-weight: bold;
  color: var(--secondary-dark);

  &::before {
    display: inline-block;
  }
}

.available:hover {
  background: var(--primary-dark);
}

.dragon {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    display: inline-block;
    content: "🐉";
  }
}

.arrow::before {
  content: "⇽";
}

.empty::before {
  content: "";
}

.finish::before {
  content: "🏁";
}

.rotate-R::before {
  transform: scaleX(-1);
}

.rotate-D::before {
  transform: rotate(-90deg);
}

.rotate-U::before {
  transform: rotate(90deg);
}

.availability {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  color: #3f3f3f;
}
</style>
