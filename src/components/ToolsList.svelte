<script lang="ts">
  import type { Tool } from '@utils/types';

  type Props = {
    tools: Tool[];
    onSelectTool: (toolId: string) => void;
  };

  let { tools, onSelectTool }: Props = $props();
</script>

<section>
  <div class="flex flex-col gap-8">
    <h2 class="heading-text">All the tools from this workshop</h2>
    <ul class="list-none space-y-4">
      {#each tools as tool}
        <li class="body-text">
          <button type="button" onclick={() => onSelectTool(tool.id)}>{tool.id}</button>
        </li>
      {/each}
    </ul>
  </div>
</section>
