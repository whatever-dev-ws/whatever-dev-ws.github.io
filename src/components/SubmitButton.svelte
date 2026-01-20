<script lang="ts">
  import { tv } from 'tailwind-variants';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type ButtonState = 'default' | 'loading' | 'success';

  type Props = Omit<HTMLButtonAttributes, 'class'> & {
    state?: ButtonState;
    label: string;
  };

  let { state = 'default', label, ...restProps }: Props = $props();

  const stateConfig = {
    default: {
      icon: '&#9650;',
      disabled: false,
    },
    loading: {
      icon: '&#8987;',
      disabled: true,
    },
    success: {
      icon: '&#10004;',
      disabled: true,
    },
  };

  const button = tv({
    base: 'ui-text px-8 pt-3 pb-[calc(var(--spacing)*3.5)] rounded-full text-center flex items-center justify-center gap-4 self-start transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#222222]',
    variants: {
      state: {
        default: 'bg-[#222222] text-[#EEEEEE]',
        loading: 'bg-[#555555] text-[#EEEEEE] pointer-events-none cursor-not-allowed opacity-60',
        success: 'bg-[#10B981] text-[#EEEEEE] pointer-events-none opacity-60',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  });

  const config = $derived.by(() => {
    return stateConfig[state];
  });
</script>

<button disabled={config.disabled} class={button({ state })} {...restProps}>
  <span aria-hidden="true" class="text-xl leading-none">{@html config.icon}</span>
  <span>{label}</span>
</button>
