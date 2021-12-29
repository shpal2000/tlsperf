<script>
    import { slide } from 'svelte/transition';
    import { fly } from 'svelte/transition';
    import ClosedIcon from './ClosedIcon.svelte';
    import OpenedIcon from './OpenedIcon.svelte';
    import { clickOutside } from './clickOutside.js';

    export let node;
    export let level=1;
    let menuX;
    let menuY;

    function onToggle() {
        node.expanded = !node.expanded;
        node.showMenu = false;
    }

    function onContextMenu(e) {
        node.showMenu = !node.showMenu;
        menuX = e.clientX;
        menuY = e.clientY;
    }

    function onClickOutside(e){
        node.showMenu = false;
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
    {#if !node.expanded}
        <ClosedIcon />
    {:else}
        <OpenedIcon />
    {/if}
    {node.data}
</li>

{#if node.showMenu}
  <div class="dropdown is-active" style="position:fixed; left: {menuX}px; top: {menuY}px" in:fly="{{y:100, duration:500}}">
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a href="#" class="dropdown-item">
          Dropdown item
        </a>
        <a class="dropdown-item">
          Other dropdown item
        </a>
        <a href="#" class="dropdown-item is-active">
          Active dropdown item
        </a>
        <a href="#" class="dropdown-item">
          Other dropdown item
        </a>
        <hr class="dropdown-divider">
        <a href="#" class="dropdown-item">
          With a divider
        </a>
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
        padding: 1rem;
        display: flex;
        cursor: pointer;
    }
</style>