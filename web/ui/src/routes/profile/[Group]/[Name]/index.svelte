<script>
    import { page } from '$app/stores';
    import TlsClientServer from './TlsClientServer.svelte';
</script>

{#if $page.stuff.Profile.Type == 'TlsClientServer'}
  <TlsClientServer />
{/if}