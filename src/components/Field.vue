<template>
    <div class="field" :class="classList">
    </div>
</template>
<script lang="ts">
import { Dragon, Gadget, gadgetDirection, gadgetType } from "@/level";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    gadget: String,
    dragon: Object,
  },
  components: {},
})
export default class Field extends Vue {
    gadget!: Gadget;
    dragon!: Dragon | undefined;

    classList() {
        let classes: string[] = [];
        if (this.dragon !== undefined) {
            classes.push('has-dragon', `has-dragon-${this.dragon.direction}`)
        }

        classes.push(gadgetType(this.gadget).toLowerCase());
        if (gadgetDirection(this.gadget) !== undefined) {
            classes.push(`rotate-${gadgetDirection(this.gadget)}`);
        }
        return classes;
    }
}
</script>
<style lang="scss">
    .field {
        border: 1px #ddd dotted;
        width: 100px;
        height: 100px;
    }
</style>