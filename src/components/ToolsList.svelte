<script lang="ts">
  import type { Sketch } from '@utils/types';

  type Props = {
    sketches: Sketch[];
  };

  let { sketches }: Props = $props();
</script>

<section>
  <div class="flex flex-col gap-8">
    <h2 class="heading-text">All the tools from this workshop</h2>
    <ul class="list-none space-y-4">
      {#each sketches as sketch}
        <li class="body-text">
          {sketch.id}
        </li>
      {/each}
    </ul>
  </div>
</section>
