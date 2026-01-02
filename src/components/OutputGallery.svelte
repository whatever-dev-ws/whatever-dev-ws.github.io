<script lang="ts">
  import type { Output } from '@utils/types';
  import { DEV_URL } from '@utils/constants';

  type Props = {
    outputs: Output[];
    onSelectTool: (toolId: string) => void;
  };

  let { outputs, onSelectTool }: Props = $props();

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
        <button
          type="button"
          onclick={() => onSelectTool(output.toolId)}
          class="block w-full h-full"
        >
          <img
            src={`${DEV_URL}/${output.url}`}
            alt={`Output ${output.id} for tool ${output.toolId}`}
            class="w-full h-full object-contain"
            loading="lazy"
          />
        </button>
      </li>
    {/each}
  </ul>
</section>
