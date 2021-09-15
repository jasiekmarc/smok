<template>
  <table>
    <thead>
      <tr>
        <th></th>
        <th scope="col">🐉</th>
        <th scope="col">⚖️</th>
        <th scope="col">🕳️</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="col in allCols" :key="col">
        <th scope="row">
          <div
            class="gem"
            :class="`gem-${col}`"
          ></div>
        </th>
        <td>{{ dragonGems(col) }}</td>
        <td>{{ scalesGems(col) }}</td>
        <td>{{ goalGems(col) }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { State } from "@/game";
import { Level, GemColour } from "@/level";
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    state: Object,
    level: Object,
  },
})
export default class Balance extends Vue {
  state!: State | undefined;
  level!: Level;

  get allCols(): string[] {
    return Object.keys(this.level.goal);
  }

  dragonGems(col: GemColour): number {
    const balance = this.state?.dragon?.balance || {};
    return balance[col] || 0;
  }

  scalesGems(col: GemColour): number {
    const balance = this.state?.balance || {};
    return balance[col] || 0;
  }

  goalGems(col: GemColour): number {
    const balance = this.level.goal;
    return balance[col] || 0;
  }
}
</script>
<style lang="scss" scoped>
table {
  display: inline-block;
  background: var(--primary-light);
  padding: 3em;
  border-collapse: collapse;

  th {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;

    .gem {
      position: unset;
      vertical-align: top;
    }
  }

  thead th {
    border-bottom: 2px solid #dee2e6;
  }

  td {
    border-top: 1px solid #dee2e6;
  }
}
</style>
