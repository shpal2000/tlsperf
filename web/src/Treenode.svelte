<script>
    import { slide } from 'svelte/transition';
    import ClosedIcon from './ClosedIcon.svelte';
    import OpenedIcon from './OpenedIcon.svelte';
    export let node;
    export let level=1;

    function toggle() {
        node.expanded = !node.expanded;
    }
</script>


<li on:click={toggle} style="padding-left:{level*1}rem" transition:slide>
    {#if !node.expanded}
        <ClosedIcon />
    {:else}
        <OpenedIcon />
    {/if}
    {node.data}
</li>

{#if node.expanded && node.children}
    {#each node.children as child}
        <svelte:self node={child} level={level+1} />
    {/each}
{/if}

<style>
    li {
        border-bottom: solid 0px #eee;
        margin: 0 0;
        padding: 1rem;
        display: flex;
    }
</style>