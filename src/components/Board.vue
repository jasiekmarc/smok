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
  <button @click.prevent="startGame" v-if="ticker === undefined">▶</button>
  <button @click.prevent="haltGame" v-else>■</button>
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
import { move, State } from "@/game";
import { Dragon, Gadget, GadgetToolbox, Level } from "@/level";
import { Options, Vue } from "vue-class-component";
import { reactive } from "vue";
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
  state: State | undefined = undefined;
  ticker: number | undefined = undefined;

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

    // Copy the initial position of the dragon.
    this.state = reactive({ dragon: Object.assign({}, this.level.dragon) });
  }

  // Passes the dragon to the correct field cell.
  dragon(position: number): Dragon | undefined {
    if (this.state === undefined || this.state.dragon.position !== position) {
      return undefined;
    }
    return this.state.dragon;
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
    const tool = event.dataTransfer?.getData("text");
    if (tool === undefined) {
      return;
    }
    const fieldNum = Number(
      ((event.target as Element).closest(".field") as Element).id
    );
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

  // Starts the interval with game moves.
  startGame(): void {
    this.ticker = setInterval(() => {
      if (
        !move(
          this.state as State,
          this.level as Level,
          this.fields[(this.state as State).dragon.position].gadget
        )
      ) {
        this.stopGame();
      }
    }, 500);
  }

  // Stops/pauses the game.
  stopGame(): void {
    clearInterval(this.ticker);
  }

  haltGame(): void {
    clearInterval(this.ticker);
    this.ticker = undefined;
    (this.state as State).dragon = Object.assign({}, this.level?.dragon);
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

button {
  margin: 0.5em auto;
  padding: 10px 30px;
  border-radius: 15px;
  border: 5px solid var(--primary-light);
  background: var(--primary-dark);
  font-size: 30px;
  &:hover {
    opacity: 70%;
  }
}

.toolbox {
  margin: 1em auto;
  max-width: min(768px, 90vh);
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(auto-fit, 100px);
  justify-content: center;
}
</style>
