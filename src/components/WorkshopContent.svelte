<script lang="ts">
  import OutputGallery from './OutputGallery.svelte';
  import { Button, Tabs } from 'bits-ui';
  import ToolsList from './ToolsList.svelte';
  import Modal from './Modal.svelte';
  import type { Manifest } from '@utils/types';

  type Props = {
    manifest: Manifest;
    remoteAssetsUrl: string;
    currentWorkshopPath: string;
  };

  let { manifest, remoteAssetsUrl, currentWorkshopPath }: Props = $props();

  const hasOutputs = $derived(manifest.outputs?.length > 0);
  const hasTools = $derived(manifest.tools?.length > 0);
  const defaultTab = $derived(hasOutputs ? 'outputs' : 'tools');

  let selectedToolId = $state<string | null>(null);
  let selectedTool = $derived.by(() => {
    if (!selectedToolId) return null;
    const found = manifest.tools.find((tool) => tool.id === selectedToolId);
    return found ?? null;
  });
  let toolViewerUrl = $derived.by(() => {
    if (!selectedTool) return '';
    const params = new URLSearchParams({
      tool: `${remoteAssetsUrl}/${selectedTool.url}`,
    });
    return `${currentWorkshopPath}/tool-viewer/?${params.toString()}`;
  });

  let downloadPromise = $state<Promise<void> | null>(null);

  function handleSelectTool(toolId: string) {
    selectedToolId = toolId;
  }

  async function downloadFile(url: string, id: string) {
    const response = await fetch(`${remoteAssetsUrl}/${url}`);
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `${id}.js`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  function handleDownload(url: string, id: string) {
    downloadPromise = downloadFile(url, id);
  }
</script>

{#if hasOutputs || hasTools}
  <Tabs.Root value={defaultTab}>
    <Tabs.List class="flex gap-2 border border-[#DDDDDD] rounded-full p-1 mb-12 w-fit bg-[#F5F5F5]">
      <Tabs.Trigger
        value="outputs"
        disabled={!hasOutputs}
        class="ui-text px-8 pt-3 pb-[calc(var(--spacing)*3.5)] rounded-full font-medium transition-all duration-200 data-[state=active]:bg-[#222222] data-[state=active]:text-[#EEEEEE] data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#666666] data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#222222]"
      >
        Outputs
      </Tabs.Trigger>
      <Tabs.Trigger
        value="tools"
        disabled={!hasTools}
        class="ui-text px-8 pt-3 pb-[calc(var(--spacing)*3.5)] rounded-full font-medium transition-all duration-200 data-[state=active]:bg-[#222222] data-[state=active]:text-[#EEEEEE] data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#666666] data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#222222]"
      >
        Tools
      </Tabs.Trigger>
    </Tabs.List>
    {#if hasOutputs}
      <Tabs.Content value="outputs">
        <OutputGallery
          outputs={manifest.outputs}
          onSelectTool={handleSelectTool}
          {remoteAssetsUrl}
        />
      </Tabs.Content>
    {/if}
    {#if hasTools}
      <Tabs.Content value="tools">
        <ToolsList tools={manifest.tools} onSelectTool={handleSelectTool} />
      </Tabs.Content>
    {/if}
  </Tabs.Root>
{/if}

<Modal open={selectedToolId !== null} onClose={() => (selectedToolId = null)}>
  {#if selectedTool}
    <div class="flex flex-col gap-12">
      <div class="flex flex-col gap-4">
        <h2 class="heading-text text-[#222222]">{selectedTool.name}</h2>
        <div class="flex flex-col gap-2">
          <p class="body-text text-[#222222]">{selectedTool.description}</p>
          <p class="body-text text-[#222222]">
            <strong>{selectedTool.author}</strong> with <strong>{selectedTool.model}</strong>
          </p>
        </div>
      </div>
      <div class="flex flex-col md:flex-row md:gap-8 gap-4">
        <Button.Root
          href={toolViewerUrl}
          class="body-text text-[#EEEEEE] px-12 pt-2 pb-[calc(var(--spacing)*2.5)] rounded-full bg-[#222222] font-medium leading-none text-center flex items-center justify-center gap-4"
        >
          <span aria-hidden="true" class="text-xl">&#9654;</span>
          <span>Use the tool</span>
        </Button.Root>
        <Button.Root
          type="button"
          onclick={() => handleDownload(selectedTool.url, selectedTool.id)}
          disabled={downloadPromise !== null}
          class="body-text text-[#EEEEEE] px-12 pt-2 pb-[calc(var(--spacing)*2.5)] rounded-full bg-[#222222] font-medium leading-none cursor-pointer flex items-center justify-center gap-4"
        >
          <span aria-hidden="true" class="text-xl">&#9660;</span>
          <span>Download the tool</span>
        </Button.Root>
      </div>
    </div>
  {/if}
</Modal>
