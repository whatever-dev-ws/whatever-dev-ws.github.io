<script lang="ts">
  import type { Tool } from '@utils/types';
  import { BASE_URL } from '@utils/constants';

  type Props = {
    tools: Tool[];
  };

  let { tools }: Props = $props();
</script>

<section>
  <div class="flex flex-col gap-8">
    <h2 class="heading-text">All the tools from this workshop</h2>
    <ul class="list-none space-y-4">
      {#each tools as tool}
        <li class="body-text">
          <a href={`/tool-viewer?tool=${BASE_URL}/${tool.url}`}>{tool.name} ({tool.id})</a>
        </li>
      {/each}
    </ul>
  </div>
</section>
