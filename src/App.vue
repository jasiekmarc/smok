<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Board :level="level" />
</template>

<script lang="ts">
import Ajv from "ajv";
import { Options, Vue } from "vue-class-component";
import exampleLevel from "./assets/level.json";
import Board from "./components/Board.vue";
import { Level } from "./level";
import levelSchema from "./level.schema.json";

@Options({
  components: {
    Board,
  },
})
export default class App extends Vue {
  level: Level | undefined = undefined;
  beforeMount() {
    const ajv = new Ajv();
    const validate = ajv.compile(levelSchema);
    const valid = validate(exampleLevel);
    if (!valid) {
      // TODO: Handle parsing error.
      return;
    }
    this.level = exampleLevel as Level;
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
