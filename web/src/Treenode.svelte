<script>
  import {replace} from "svelte-spa-router";

  import { createEventDispatcher } from "svelte";
  import { slide } from 'svelte/transition';
  import { fly } from 'svelte/transition';
  import ClosedIcon from './ClosedIcon.svelte';
  import OpenedIcon from './OpenedIcon.svelte';
  import CircleIcon from './CircleIcon.svelte';
  import { clickOutside } from './clickOutside.js';
  import { selectedNode } from './store.js';
  import { get } from 'svelte/store';

  export let node;
  export let pnode;
  export let type;
  export let level;

  let menuX;
  let menuY;
  let showMenu;



  const dispatch = createEventDispatcher ();

  function onDispatch(msg, details) {
    dispatch (msg, details);
    showMenu = false;
  }

  function onClick(e) {
    $selectedNode.Name = node.Name;
    $selectedNode.ParentName = pnode.Name;
    $selectedNode.Type = type;
  
    dispatch ('expandToggle', {});
    showMenu = false;

    if (node.UrlPath) {
      replace('/');
      replace(node.UrlPath);
    }
  }

  function onContextMenu(e) {
    $selectedNode.Name = node.Name;
    $selectedNode.ParentName = pnode.Name;
    $selectedNode.Type = type;

    showMenu = !showMenu;
    menuX = e.clientX;
    menuY = e.clientY;
  }

  function onClickOutside(e){
      showMenu = false;
  }

</script>


<li on:click={onClick} 
        style="padding-left:{level*1}rem" 
        transition:slide 
        on:contextmenu|preventDefault={onContextMenu}
        class:selected="{$selectedNode.Name==node.Name && $selectedNode.ParentName==pnode.Name && $selectedNode.Type==type}">
    {#if node.children}
      {#if !node.expanded}
        <ClosedIcon /> {node.Name}
      {:else}
        <OpenedIcon /> {node.Name}
      {/if}
    {:else}
      <CircleIcon /> {node.Name}
    {/if}
</li>

{#if showMenu && node.MenuItems}
  <div use:clickOutside on:click_outside={onClickOutside} class="dropdown is-active" style="position:fixed; left: {menuX}px; top: {menuY}px" in:fly="{{y:100, duration:500}}">
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        {#each node.MenuItems as menuItem}
          <div class="dropdown-item"
              on:click={() => onDispatch(menuItem.Event, menuItem.EventCtx)}>
            {menuItem.Name}
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}



<style>

  .selected {
    background-color: darkgray;
    color: white;
  }

  li {
      border-bottom: solid 0px aliceblue;
      margin: 0 0;
      padding: 0.60rem;
      display: flex;
      cursor: pointer;

      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
  }
</style>