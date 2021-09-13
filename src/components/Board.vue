<template>
  <div
    class="board"
    :style="{ gridTemplateColumns: 'repeat(' + level.width + ', 100px)' }"
  >
    <Field
      v-for="(field, i) in fields"
      :key="i"
      :id="i"
      :gadget="field.gadget"
      :dragon="dragon(i)"
      @drop="onToolDrop"
      @dragover.prevent
    />
  </div>
  <div class="toolbox">
    <Field
      v-for="(t, i) in tools"
      :key="i"
      :id="t.gadget"
      :gadget="t.gadget"
      :availability="t.availability"
      :draggable="t.availability > 0"
      @dragstart="onToolDragStart"
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
        initial: false,
      };
    }

    const positions = Object.keys(this.level.board).map(Number);
    positions.map((p) => {
      fields[p].gadget = this.level?.board[p] || "EMPTY";
      fields[p].initial = true;
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

  // Current state of the toolbox.
  get tools(): ToolType[] {
    return Object.entries(this.toolbox).map(([g, a]) => {
      return {
        gadget: g as Gadget,
        availability: a as number,
      };
    });
  }

  // Triggered when a tool is lifted up from a toolbox.
  onToolDragStart(event: DragEvent): void {
    event.dataTransfer?.setData("text/plain", (event.target as HTMLElement).id);
  }

  // Triggered when a tool is dropped onto the board.
  onToolDrop(event: DragEvent): void {
    console.log(event);
    const tool = event.dataTransfer?.getData("text");
    if (tool === undefined) {
      return;
    }
    const fieldNum = Number(((event.target as Element).closest('.field') as Element).id);
    if (this.fields[fieldNum].initial) {
      // An initial gadget cannot be removed.
      return;
    }
    // Move the current gadget to the toolbox.
    const currentGadget = this.fields[fieldNum].gadget;
    if (this.toolbox[currentGadget] === undefined) {
      this.toolbox[currentGadget] = 1;
    }
    (this.toolbox[currentGadget] as number) += 1;
    // Move the tool to the field.
    this.fields[fieldNum].gadget = tool as Gadget;
    // Remove it from the toolbox.
    (this.toolbox[tool as Gadget] as number) -= 1;
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
