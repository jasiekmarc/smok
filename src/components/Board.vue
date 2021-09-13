<template>
  <div
    class="board"
    :style="{ gridTemplateColumns: 'repeat(' + level.width + ', 100px)' }"
  >
    <Field
      v-for="(field, i) in fields"
      :key="i"
      :gadget="field.gadget"
      :dragon="dragon(i)"
    />
  </div>
  <div class="toolbox">
    <Field
      v-for="(t, i) in tools"
      :key="i"
      :gadget="t.gadget"
      :availability="t.availability"
    />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Gadget, GadgetToolbox, Level, Dragon } from "@/level";
import Field from "./Field.vue";

// Represents a single field;
type FieldType = {
  gadget: Gadget;
  // Gadget cannot be erased/replaced if it is initial.
  initial: boolean;
};

type ToolType = {
  gadget: Gadget;
  availability: number;
};

@Options({
  props: {
    level: Object,
  },
  components: {
    Field,
  },
  watch: {
    level: function () {
      this.populateLevel();
    },
  },
})
export default class Board extends Vue {
  level!: Level | undefined;
  fields: FieldType[] = [];
  toolbox: GadgetToolbox = {};

  get size(): number {
    if (this.level === undefined) {
      return 0;
    }
    return this.level.width * this.level.height;
  }

  mounted(): void {
    this.populateLevel();
  }

  // Scans the level prop and builds a new board. Triggered everytime `level`
  // changes.
  populateLevel(): void {
    if (this.level === undefined) {
      return;
    }
    // Populate fields with initial gadgets from the level.
    let fields = new Array<FieldType>(this.size);
    for (let i = 0; i < this.size; i++) {
      fields[i] = {
        gadget: "EMPTY",
        initial: true,
      };
    }

    const positions = Object.keys(this.level.board).map(Number);
    positions.map((p) => {
      fields[p].gadget = this.level?.board[p] || "EMPTY";
    });
    this.fields = fields;

    // Copy the original toolbox into ours.
    this.toolbox = Object.assign({}, this.level.toolbox);
    this.toolbox["EMPTY"] = 0;
  }

  // Passes the dragon to the correct field cell.
  dragon(position: number): Dragon | undefined {
    if (this.level?.dragon.position !== position) {
      return undefined;
    }
    return this.level.dragon;
  }

  get tools(): ToolType[] {
    return Object.entries(this.toolbox).map(([g, a]) => {
      return {
        gadget: g as Gadget,
        availability: a as number,
      };
    });
  }
}
</script>
<style lang="scss" scoped>
.board {
  display: grid;
  gap: 5px;
  place-items: stretch;
  place-content: center;
  grid-auto-rows: 100px;
}

.toolbox {
  margin: 5em auto;
  max-width: min(768px, 90vh);
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(auto-fit, 100px);
  justify-content: center;
}
</style>
