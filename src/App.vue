<template>
  <board :level="level" v-if="level !== null" />
  <level-loader v-model:level="level" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Board from "./components/Board.vue";
import LevelLoader from "./components/LevelLoader.vue";
import { Level } from "./level";

@Options({
  components: {
    Board,
    LevelLoader,
  },
})
export default class App extends Vue {
  level: Level | null = null;
}
</script>

<style lang="scss">
html {
  --primary: #dcedc8;
  --primary-dark: #aabb97;
  --primary-light: #f9fbe7;
  --secondary: #f8bbd0;
  --secondary-dark: #c48b9f;
  --secondary-light: #ffeeff;

  --green: #689f38;
  --yellow: #fdd835;
  --black: #616161;
  --red: #9a0007;
  --blue: #006db3;

  color: #3f3f3f;

  font-family: 
    // Cross-platform generic font family (default user interface font)
    system-ui,
    // Safari for macOS and iOS (San Francisco)
    -apple-system,
    // Windows
    "Segoe UI",
    // Android
    Roboto,
    // Basic web fallback
    "Helvetica Neue",
    Arial,
    // Linux
    "Noto Sans",
    "Liberation Sans",
    // Sans serif fallback
    sans-serif,
    // Emoji fonts
    "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
