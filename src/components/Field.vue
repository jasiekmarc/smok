<template>
  <div class="field" :class="classList" :data-fieldnum="id">
    <span
      class="dragon"
      v-if="hasDragon"
      :class="`rotate-${state.dragon.direction}`"
    ></span>
    <span class="availability" v-if="field.availability !== undefined">{{
      field.availability
    }}</span>
    <span class="gem" :class="`gem-${gemColour}`" v-if="hasGem">{{
      gemOut
    }}</span>
  </div>
</template>
<script lang="ts">
import { State } from "@/game";
import {
  Gadget,
  gadgetColourOut,
  gadgetDirection,
  GadgetInfo,
  gadgetType,
} from "@/level";
import { Options, Vue } from "vue-class-component";

// Represents a single field;
export interface FieldType extends GadgetInfo {
  kind: "field";
  // Gadget cannot be erased/replaced if it is initial.
  initial: boolean;
}

export interface ToolType {
  kind: "tool";
  gadget: Gadget;
  availability: number;
}

@Options({
  props: {
    field: Object,
    state: Object,
    dragon: Object,
    id: Number,
  },
})
export default class Field extends Vue {
  field!: FieldType | ToolType;
  state!: State | undefined;
  id!: number | undefined;

  get classList(): string[] {
    let classes: string[] = [];

    classes.push(gadgetType(this.gadget).toLowerCase());
    if (gadgetDirection(this.gadget) !== undefined) {
      classes.push(`rotate-${gadgetDirection(this.gadget)}`);
    }
    if (
      this.field.kind === "tool" &&
      this.field.availability !== undefined &&
      this.field.availability > 0
    ) {
      classes.push("available");
    }
    if (this.gadget === "FINISH" && !this.state?.gateOpen) {
      classes.push("closed");
    }
    return classes;
  }

  get gadget(): Gadget {
    return this.field.gadget;
  }

  get hasDragon(): boolean {
    if (this.state === undefined || this.id === undefined) {
      return false;
    }
    return this.state?.dragon.position === this.id;
  }

  get hasGem(): boolean {
    return ["SCALE", "BASKET"].includes(gadgetType(this.gadget));
  }

  get gemOut(): number | string | undefined {
    if (this.field.kind === "tool") {
      return undefined;
    }
    if (this.gadget === "BASKET") {
      return this.field.attributes?.count;
    }
    return undefined;
  }

  get gemColour(): string | undefined {
    if (this.field.kind === "tool") {
      return undefined;
    }
    if (gadgetType(this.gadget) === "SCALE") {
      return gadgetColourOut(this.gadget);
    }
    if (gadgetType(this.gadget) === "BASKET") {
      return this.field.attributes?.colour;
    }
    return undefined;
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
  content: "🕳️";
}

.closed.finish::before {
  opacity: 20%;
}

.scale::before {
  content: "⚖️";
}

.basket::before {
  content: "🧺";
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

.gem {
  font-size: 20px;
  position: absolute;
  top: 5px;
  right: 5px;
}

.gem::before {
  content: "💎";
  color: rgba(0, 0, 0, 40%);
}

.gem-G::before {
  text-shadow: 0 0 0 green;
}

.gem-Y::before {
  text-shadow: 0 0 0 yellow;
}

.gem-K::before {
  text-shadow: 0 0 0 black;
}

.gem-R::before {
  text-shadow: 0 0 0 red;
}

.gem-B::before {
  text-shadow: 0 0 0 blue;
}

.availability {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  color: #3f3f3f;
}
</style>
