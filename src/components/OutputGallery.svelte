<script lang="ts">
  import type { Output } from '@utils/types';
  import { BASE_URL } from '@utils/constants';

  type Props = {
    outputs: Output[];
  };

  let { outputs }: Props = $props();

  let galleryOutputs = $derived(
    outputs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8),
  );
</script>

<section>
  <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each galleryOutputs as output}
      <li class="bg-[#EEEEEE] aspect-3/2">
        <img
          src={`${BASE_URL}/${output.filename}`}
          alt={`Output ${output.id} for sketch ${output.sketchId}`}
          class="w-full h-full object-contain"
          loading="lazy"
        />
      </li>
    {/each}
  </ul>
</section>
