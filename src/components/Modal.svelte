<script lang="ts">
  import { Dialog } from 'bits-ui';

  type Props = {
    open: boolean;
    onClose: () => void;
    children: () => any;
  };

  let { open, onClose, children }: Props = $props();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      onClose();
    }
  }
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
    <Dialog.Content
      class="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] md:p-16 bg-[#EEEEEE] max-w-2xl w-full p-6"
    >
      {@render children?.()}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
