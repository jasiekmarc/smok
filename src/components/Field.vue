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
    <span v-if="hasGem" class="label gem" :class="`gem-${gemColour}`"></span>
    <span
      v-if="gemCount !== undefined"
      class="label gem-count"
      :class="`gem-${gemCount}`"
      >+ {{ gemCount }}</span
    >
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

    if (this.isDraggable) {
      classes.push("draggable");
    }

    if (this.gadget === "FINISH" && !this.state?.gateOpen) {
      classes.push("closed");
    }
    return classes;
  }

  get isDraggable(): boolean {
    if (
      this.field.kind === "tool" &&
      this.field.availability !== undefined &&
      this.field.availability > 0
    ) {
      return true;
    }
    if (
      this.field.kind === "field" &&
      this.field.gadget !== "EMPTY" &&
      !this.field.initial
    ) {
      return true;
    }
    return false;
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

  // First element are CSS classes. The second is amount.
  get gemCount(): string | number | undefined {
    if (this.field.kind === "tool") {
      return undefined;
    }
    if (this.gadget === "BASKET") {
      return this.field.attributes?.count;
    }
    return undefined;
  }

  get gemColour(): string | undefined {
    // if (this.field.kind === "tool") {
    //   return undefined;
    // }
    if (gadgetType(this.gadget) === "SCALE") {
      return gadgetColourOut(this.gadget);
    }
    if (this.field.kind === "field" && gadgetType(this.gadget) === "BASKET") {
      return this.field.attributes?.colour;
    }
    return undefined;
  }
}
</script>
<style lang="scss">
$fa-font-path: "~@fortawesome/fontawesome-free/webfonts";

@import "~@fortawesome/fontawesome-free/scss/fontawesome.scss";
// @import "~@fortawesome/fontawesome-free/scss/regular.scss";
@import "~@fortawesome/fontawesome-free/scss/solid.scss";

.field {
  border: 1px var(--primary-dark) solid;
  background: var(--primary);
  width: 100px;
  height: 100px;

  // Center horizontally and vertically.
  display: flex;
  flex-direction: column;

  position: relative;
  font-size: 50px;

  &.draggable:hover {
    background: var(--primary-dark);
  }

  &::before {
    @extend %fa-icon;
    @extend .fas;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;
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
  }

  .label {
    width: 20px;
    height: 20px;

    z-index: 1;

    font-size: 10px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;

    background: radial-gradient(rgba(0, 0, 0, 50%), transparent);
  }
}

/* Global styles for element */
.dragon {
  @extend %fa-icon;
  @extend .fas;

  &::before {
    content: "\f6d5";
    color: var(--green);
  }
}

.arrow::before {
  content: "\f061";
  color: var(--secondary-dark);
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

.rotate-L::before {
  transform: scaleX(-1);
}

.rotate-D::before {
  transform: rotate(90deg);
}

.rotate-U::before {
  transform: rotate(-90deg);
}

.gem {
  &::before {
    @extend %fa-icon;
    @extend .fas;
    font-weight: normal;
    font-size: 17px;
    content: "\f3a5";
  }
}

.gem-G {
  color: var(--green);
}

.gem-Y {
  color: var(--yellow);
}

.gem-K {
  color: var(--black);
}

.gem-R {
  color: var(--red);
}

.gem-B {
  color: var(--blue);
}

.availability {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  font-weight: normal;
}
</style>
