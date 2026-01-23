<script lang="ts">
  import type { Output } from '@utils/types';

  type Props = {
    outputs: Output[];
    onSelectTool: (toolId: string) => void;
    remoteAssetsUrl: string;
  };

  let { outputs, onSelectTool, remoteAssetsUrl }: Props = $props();

  let sortedOutputs = $derived(
    outputs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  );
</script>

<section>
  <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each sortedOutputs as output}
      <li class="bg-[#EEEEEE] aspect-3/2">
        <button
          type="button"
          onclick={() => onSelectTool(output.toolId)}
          class="block w-full h-full"
        >
          <img
            src={`${remoteAssetsUrl}/${output.url}`}
            alt={`Output ${output.id} for tool ${output.toolId}`}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      </li>
    {/each}
  </ul>
</section>
