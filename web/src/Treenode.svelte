<script>
    import { slide } from 'svelte/transition';
    import { fly } from 'svelte/transition';
    import ClosedIcon from './ClosedIcon.svelte';
    import OpenedIcon from './OpenedIcon.svelte';
    import CircleIcon from './CircleIcon.svelte';
    import { clickOutside } from './clickOutside.js';
import { children } from 'svelte/internal';

    export let node;
    export let level=1;

    let menuX;
    let menuY;
    let showMenu;

    function onToggle() {
        node.expanded = !node.expanded;
        showMenu = false;
    }

    function onContextMenu(e) {
        showMenu = !showMenu;
        menuX = e.clientX;
        menuY = e.clientY;
    }

    function onClickOutside(e){
        showMenu = false;
    }

    function dummy(e){

    }
</script>


<li use:clickOutside
        on:click={onToggle} 
        style="padding-left:{level*1}rem" 
        transition:slide 
        on:contextmenu|preventDefault={onContextMenu}
        on:click_outside={onClickOutside}>
    {#if node.children}
      {#if !node.expanded}
        <ClosedIcon />
      {:else}
        <OpenedIcon />
      {/if}
    {:else}
      <CircleIcon />
    {/if}
    {node.Name}
</li>

{#if showMenu && node.MenuItems}
  <div class="dropdown is-active" style="position:fixed; left: {menuX}px; top: {menuY}px" in:fly="{{y:100, duration:500}}">
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        {#each node.MenuItems as menuItem}
          <a href="#" class="dropdown-item">
            {menuItem}
          </a>
        {/each}
      </div>
    </div>
  </div>
{/if}

{#if node.expanded && node.children}
    {#each node.children as child}
        <svelte:self node={child} level={level+1} />
    {/each}
{/if}

<style>
    li {
        border-bottom: solid 0px #eee;
        margin: 0 0;
        padding: 0.75rem;
        display: flex;
        cursor: pointer;

        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }
</style>