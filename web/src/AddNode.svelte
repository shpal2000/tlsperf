<script>
    export let isActive;

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher ();

    function onAddNodeSuccess () {
        dispatch ('addNodeSuccess', {});
        isActive=false;
    }

</script>

<div class="modal {isActive ? 'is-active' : ''}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        Node  Name: --
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" on:click={onAddNodeSuccess}>Add</button>
        <button class="button" on:click={() => isActive=false}>Cancel</button>
      </footer>
    </div>
</div>

<style>

</style>