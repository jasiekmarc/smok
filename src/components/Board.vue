<template>
  <div class="board">
    <Field v-for="(field, i) in fields" :key="i" />
  </div>
  <div class="toolbox"></div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Gadget, GadgetToolbox, Level } from "@/level";
import Field from "./Field.vue";

// Represents a single field;
type FieldType = {
  gadget: Gadget;
  // Gadget cannot be erased/replaced if it is initial.
  initial: boolean;
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
    console.log(this.level);
    if (this.level === undefined) {
      return;
    }
    console.log(this.size);
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
}
</script>
