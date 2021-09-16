<template>
  <div class="row">
    <div
      class="board"
      :style="{ gridTemplateColumns: 'repeat(' + level.width + ', 100px)' }"
    >
      <Field
        v-for="(field, i) in fields"
        :key="i"
        :id="i"
        :field="field"
        :state="state"
        @drop.prevent="onToolDrop"
        @dragover.prevent
        @click="field.attributes !== undefined && openSettings(i)"
      />
    </div>
    <div class="balance">
      <Balance :level="level" :state="state" />
    </div>
  </div>
  <component
    v-if="currentSettings !== undefined"
    :is="currentSettingsComponent"
    v-model:attributes="fields[currentSettings].attributes"
    :allCols="allCols"
    v-on:close="closeSettings"
  ></component>
  <button @click.prevent="startGame" v-if="ticker === undefined">▶</button>
  <button @click.prevent="haltGame" v-else>■</button>
  <div class="toolbox">
    <Field
      v-for="(t, i) in tools"
      :key="i"
      :data-tool="t.gadget"
      :field="t"
      :draggable="t.availability > 0"
      @dragstart="onToolDragStart"
    />
  </div>
</template>
<script lang="ts">
import { move, State } from "@/game";
import {
  coloursInGame,
  Gadget,
  GadgetToolbox,
  GemColour,
  getDefaultAttributes,
  Level,
} from "@/level";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";
import Balance from "./Balance.vue";
import Field, { FieldType, ToolType } from "./Field.vue";
import BasketSettings from "./field-settings/BasketSettings.vue";

@Options({
  props: {
    level: Object,
  },
  components: {
    Field,
    Balance,
    BasketSettings,
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
  state = {};
  ticker: number | undefined = 0;
  allCols: GemColour[] = [];

  currentSettings: number | undefined = 0;

  openSettings(i: number): void {
    this.currentSettings = i;
  }

  closeSettings(): void {
    this.currentSettings = undefined;
  }

  get currentSettingsComponent(): string {
    if (this.currentSettings === undefined) {
      return "";
    }
    const gadget = this.fields[this.currentSettings].gadget;
    const gadgetCapitalised = gadget.charAt(0) + gadget.slice(1).toLowerCase();
    const componentName = `${gadgetCapitalised}Settings`;

    return componentName;
  }

  get size(): number {
    if (this.level === undefined) {
      return 0;
    }
    return this.level.width * this.level.height;
  }

  created(): void {
    this.populateLevel();
    this.ticker = undefined;
    this.currentSettings = undefined;
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
        kind: "field",
        gadget: "EMPTY",
        initial: false,
      };
    }

    const positions = Object.keys(this.level.board).map(Number);
    positions.map((p) => {
      const fs = { kind: "field", initial: true } as FieldType;
      fields[p] = Object.assign(fs, this.level?.board[p]);
    });
    this.fields = fields;

    // Copy the original toolbox into ours.
    this.toolbox = Object.assign({}, this.level.toolbox);
    this.toolbox["EMPTY"] = 0;

    // Copy the initial position of the dragon.
    this.state = reactive({
      dragon: Object.assign({}, this.level.dragon),
      balance: {},
      gateOpen: true,
    });

    this.allCols = coloursInGame(this.level);
  }

  // Current state of the toolbox.
  get tools(): ToolType[] {
    return Object.entries(this.toolbox).map(([g, a]) => {
      return {
        kind: "tool",
        gadget: g as Gadget,
        availability: a as number,
      };
    });
  }

  // Triggered when a tool is lifted up from a toolbox.
  onToolDragStart(event: DragEvent): void {
    const sourceElement = event.target as HTMLElement;
    const tool = sourceElement.dataset["tool"];
    if (tool === undefined) {
      return;
    }
    event.dataTransfer?.setData("text/plain", tool);
  }

  // Triggered when a tool is dropped onto the board.
  onToolDrop(event: DragEvent): void {
    const tool = event.dataTransfer?.getData("text");
    if (tool === undefined) {
      return;
    }
    const dropElement = (event.target as Element).closest(
      ".field"
    ) as HTMLElement;
    const fieldNum = Number(dropElement.dataset["fieldnum"]);
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
    this.fields[fieldNum].attributes = getDefaultAttributes(
      tool as Gadget,
      this.allCols
    );
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
          this.fields[(this.state as State).dragon.position]
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
    this.state = {
      dragon: Object.assign({}, this.level?.dragon),
      balance: {},
      gateOpen: true,
    };
  }
}
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.board {
  display: inline-grid;
  gap: 0.25rem;
  place-items: stretch;
  place-content: center;
  grid-auto-rows: 100px;
}

button {
  display: block;
  margin: 1rem auto;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  border: none;
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
  gap: 0.25rem;
  grid-template-columns: repeat(auto-fit, 100px);
  justify-content: center;
}
</style>
