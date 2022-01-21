<script>
    import { selectedNode } from './store.js';

    export let isActive;
    let Name = '';
    let SshIP = '';
    let SshUser = '';
    let SshPass = '';

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher ();

    async function onAddNodeSuccess () {

      const res = await fetch ('/api/nodes', {
        method: 'POST',
        body: JSON.stringify({
          Name,
          SshIP,
          SshUser,
          SshPass,
          Group : $selectedNode.Name
        })
      });

      if (res.ok) {
        const json = await res.json();

        if (json.status == 0){
          dispatch ('addNodeSuccess', {Name: Name});
          isActive=false;
        } else {
          console.log(json);
          alert (JSON.stringify(json))
        }
      } else {
        console.log(res);
        alert (JSON.stringify(res))
      }
    }

</script>

<div class="modal {isActive ? 'is-active' : ''}">
    <div class="modal-card box">
      <header>
        <p class="modal-card-title">Add Node</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Name</label>
          <div class="control">
            <input class="input is-info" type="text" placeholder="Text input" bind:value={Name}>
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Ssh IP</label>
          <div class="control">
            <input class="input is-info" type="text" placeholder="Text input" bind:value={SshIP}>
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Ssh User</label>
          <div class="control">
            <input class="input is-info" type="text" placeholder="Text input" bind:value={SshUser}>
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Ssh Pass</label>
          <div class="control">
            <input class="input is-info" type="password" placeholder="Text input" bind:value={SshPass}>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-info" on:click={onAddNodeSuccess}>Add</button>
          </div>
          <div class="control">
            <button class="button is-info is-light" on:click={() => isActive=false}>Cancel</button>
          </div>
        </div>
      </section>
    </div>
</div>

<style>

</style>