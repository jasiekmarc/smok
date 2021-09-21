<template>
  <button id="load-button" :hidden="open" @click="open = true">
    Load level
  </button>
  <div class="offcanvas" :class="{ 'offcanvas-hidden': !open }">
    <h2>Load a level</h2>
    <ul>
      <li v-for="(l, i) in LEVELS" :key="i">
        <a
          href=""
          @click.prevent="
            loadLevel(l);
            open = false;
          "
          >Level {{ i }}</a
        >
      </li>
    </ul>
    <h3>or load your own</h3>
    <span class="error-message" v-if="parsingError !== null">{{
      parsingError
    }}</span>
    <textarea
      :class="{
        invalid: parsingError !== null,
        valid: levelJson !== '' && parsingError === null,
      }"
      v-model="levelJson"
      @change="loadOwn"
    ></textarea>
  </div>
  <div class="offcanvas-backdrop" v-show="open" @click="open = false"></div>
</template>
<script lang="ts">
import { Level } from "@/level";
import levelSchema from "@/level.schema.json";
import Ajv from "ajv";
import { Options, Vue } from "vue-class-component";

import level0 from "@/assets/level0.json";
import level1 from "@/assets/level1.json";

@Options({
  props: {
    level: Object,
  },
  emits: ["update:level"],
})
export default class LevelLoader extends Vue {
  level!: Level | null;
  open = false;
  levelJson = "";
  parsingError: string | null = null;
  // Function validating the level objects.
  validate = new Ajv().compile(levelSchema);

  LEVELS = [level0, level1];

  created(): void {
    this.loadLevel(this.LEVELS[0]);
  }

  // Interpretes the parsed object as Level and assigns to the prop.
  loadLevel(obj: unknown): void {
    const valid = this.validate(obj);
    if (!valid) {
      console.error(this.validate.errors);
      this.parsingError = (this.validate.errors as Ajv.ErrorObject[])
        .map((e) => JSON.stringify(e))
        .join();
    }
    const level = obj as Level;
    this.$emit("update:level", level);
  }

  // Parses JSON into the level description.
  loadOwn(): void {
    this.parsingError = null;
    if (this.levelJson === "") {
      return;
    }

    try {
      const obj = JSON.parse(this.levelJson);
      this.loadLevel(obj);
    } catch (e) {
      this.parsingError = e.message;
    }
  }
}
</script>
<style lang="scss" scoped>
#load-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.offcanvas {
  &,
  & * {
    box-sizing: border-box;
  }
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  width: 400px;
  padding: 2rem;
  border-right: 1px solid rgba(0, 0, 0, 0.2);

  z-index: 1045;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  background-color: #fff;
  background-clip: padding-box;
  outline: 0;
  transition: transform 0.3s ease-in-out;

  overflow-y: scroll;

  &.offcanvas-hidden {
    visibility: hidden;
    transform: translateX(-100%);
  }
}

.offcanvas-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    border: 1px var(--secondary-light) dotted;
    background: var(--primary-light);
    padding: 1rem;
    margin: 0.25rem 0;
  }
}

.error-message {
  word-wrap: break-word;
  width: 100%;
  background: rgba(220, 53, 69, 0.25);
  padding: 1rem;
  margin: 1rem 0;
}

textarea {
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;

  width: 100%;
  height: 30rem;
  padding: 0.375rem 0.75rem;

  border: 1px solid #ced4da;

  &:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }

  &.invalid {
    border: 2px var(--red) solid;

    &:focus {
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
    }
  }

  &.valid {
    border: 2px var(--green) solid;

    &:focus {
      box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
    }
  }
}
</style>
