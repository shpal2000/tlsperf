<script>
  import { sideStore } from './store.js';
  import Treenode from "./Treenode.svelte";

</script>



<Treenode 
    node={$sideStore.ProfileRoot} 
    level={1} 
    on:expandToggle={() => $sideStore.ProfileRoot.expanded = !$sideStore.ProfileRoot.expanded}/>

{#if $sideStore.ProfileRoot.expanded && $sideStore.ProfileRoot.children}
  {#each $sideStore.ProfileRoot.children as child}
      <Treenode node={child} level={2} />
  {/each}
{/if}

<style>

</style>